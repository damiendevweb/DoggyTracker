// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- Supabase Edge Functions resolve npm: imports at runtime
import Stripe from 'npm:stripe@17'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- Supabase Edge Functions resolve npm: imports at runtime
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders })

// Lis un secret en essayant plusieurs noms : nom canonique (utilisé en live)
// puis nom de test éventuel défini dans le dashboard Supabase.
const readSecret = (...names: string[]) => {
  for (const name of names) {
    const value = Deno.env.get(name)
    if (value) return value
  }
  return undefined
}

// Clé d'accès données (bypass RLS) :
// - nouveau format SUPABASE_SECRET_KEYS (JSON {"default":"sb_secret_xxx"})
// - legacy SUPABASE_SERVICE_ROLE_KEY (chaîne JWT), déprécié fin 2026
const getServiceRoleKey = (): string | undefined => {
  const newKeys = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (newKeys) {
    try {
      const parsed = JSON.parse(newKeys) as Record<string, string>
      if (parsed['default']) return parsed['default']
    } catch {
      // Ignore, on retombe sur le legacy
    }
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  const stripeSecretKey = readSecret('STRIPE_SECRET_KEY', 'STRIPE_TEST_SECRET_KEY')
  const webhookSecret = readSecret('STRIPE_WEBHOOK_SECRET', 'STRIPE_TEST_WEBHOOK_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = getServiceRoleKey()

  if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return json(500, { error: 'Missing environment variables' })
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return json(400, { error: 'Missing stripe-signature header' })
  }

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Webhook signature verification failed:', err.message)
    return json(400, { error: 'Invalid signature' })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const orderId = session.metadata?.order_id
      const userId = session.metadata?.user_id ?? null

      if (!orderId) {
        return json(200, { received: true, skipped: 'No order_id in metadata' })
      }

      const { data: existing } = await supabase
        .from('orders')
        .select('id, status, stripe_session_id')
        .eq('id', orderId)
        .single()

      if (existing && existing.status === 'paid') {
        return json(200, { received: true, skipped: 'Already processed' })
      }

      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price.product'],
      })

      const lineItems = (fullSession.line_items?.data ?? []) as Stripe.Checkout.Session.LineItem[]

      const shippingAddress = fullSession.shipping_details?.address
        ? {
            line1: shippingAddressLine1(fullSession.shipping_details.address as unknown as Record<string, unknown>),
            city: addressField(fullSession.shipping_details.address as unknown as Record<string, unknown>, 'city'),
            postal_code: addressField(fullSession.shipping_details.address as unknown as Record<string, unknown>, 'postal_code'),
            country: addressField(fullSession.shipping_details.address as unknown as Record<string, unknown>, 'country'),
          }
        : null

      const totalDetails = fullSession.total_details
      const discountCents = totalDetails?.amount_discount ?? 0
      const shippingCents = totalDetails?.amount_shipping ?? 0

      // Récupère les codes promo lisibles (ex: BIENVENUE10)
      let promoCode: string | null = null
      const breakdownDiscounts = totalDetails?.breakdown?.discounts ?? []
      const promoIds = breakdownDiscounts
        .map((d: { promotion_code?: string }) => d.promotion_code)
        .filter(Boolean) as string[]

      if (promoIds.length > 0) {
        const codes: string[] = []
        for (const promoId of promoIds) {
          try {
            const promo = await stripe.promotionCodes.retrieve(promoId)
            codes.push(promo.code)
          } catch {
            codes.push(promoId)
          }
        }
        promoCode = codes.join(',')
      }

      const orderPayload = {
        stripe_session_id: fullSession.id,
        stripe_payment_intent_id:
          typeof fullSession.payment_intent === 'string' ? fullSession.payment_intent : null,
        status: 'paid',
        user_id: userId,
        customer_email:
          fullSession.customer_details?.email ?? fullSession.customer_email ?? null,
        shipping_address: shippingAddress as unknown as Record<string, unknown> | null,
        shipping_cents: shippingCents,
        subtotal_cents: fullSession.amount_subtotal ?? 0,
        discount_cents: discountCents,
        total_cents: fullSession.amount_total ?? 0,
        promo_code: promoCode,
        currency: (fullSession.currency ?? 'eur').toLowerCase(),
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from('orders')
          .update(orderPayload)
          .eq('id', orderId)
        if (updateError) {
          console.error('Order update error:', updateError)
          return json(500, { error: 'Failed to update order' })
        }
      } else {
        const { error: insertError } = await supabase
          .from('orders')
          .insert({ id: orderId, ...orderPayload })
        if (insertError) {
          console.error('Order insert error:', insertError)
          return json(500, { error: 'Failed to create order' })
        }
      }

      const orderItems = lineItems.map((li) => {
        const product = li.price?.product as
          | (Stripe.Product & { metadata?: Record<string, string> })
          | string
          | null

        const metadata = product && typeof product === 'object' ? (product.metadata ?? {}) : {}

        const customization =
          metadata.pet_name != null || metadata.phone1 != null
            ? {
                petName: metadata.pet_name ?? '',
                phone1: metadata.phone1 ?? '',
                phone2: metadata.phone2 ?? '',
                font: metadata.font ?? '',
              }
            : null

        return {
          order_id: orderId,
          product_id: metadata.product_id ?? null,
          quantity: li.quantity ?? 1,
          unit_price_cents: Math.round((li.amount_total ?? 0) / (li.quantity ?? 1)),
          customization,
        }
      }).filter((oi) => oi.product_id)

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
        if (itemsError) {
          console.error('Order items insert error:', itemsError)
        }
      }

      // Décrémente le stock (atomique, sans effet si stock limité insuffisant)
      for (const oi of orderItems) {
        const { error: stockError } = await supabase.rpc('decrement_product_stock', {
          p_product_id: oi.product_id,
          p_quantity: oi.quantity,
        })
        if (stockError) {
          console.error('Stock decrement error:', stockError)
        }
      }

      return json(200, {
        received: true,
        orderId,
        status: 'paid',
        items: orderItems.length,
      })
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id
      if (orderId) {
        await supabase
          .from('orders')
          .update({ status: 'expired' })
          .eq('id', orderId)
          .eq('status', 'pending')
      }
      return json(200, { received: true, skipped: 'Session expired' })
    }

    return json(200, { received: true, skipped: `Unhandled event ${event.type}` })
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Unhandled error in stripe-webhook:', err)
    return json(500, { error: err.message ?? 'Internal server error' })
  }
})

function shippingAddressLine1(address: Record<string, unknown>): string | null {
  const line1 = address['line1'] as string | null | undefined
  const line2 = address['line2'] as string | null | undefined
  return [line1, line2].filter(Boolean).join(' ') || null
}

function addressField(address: Record<string, unknown>, key: string): string | null {
  const value = address[key] as string | null | undefined
  return value ?? null
}