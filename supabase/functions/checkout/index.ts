// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- Supabase Edge Functions resolve npm: imports at runtime
import Stripe from 'npm:stripe@17'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- Supabase Edge Functions resolve npm: imports at runtime
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

type CartCustomization = {
  petName: string
  phone1: string
  phone2?: string
  font: string
}

type CheckoutRequest = {
  items: {
    id: string
    quantity: number
    customization?: CartCustomization | null
  }[]
  email?: string
}

type ProductRecord = {
  id: string
  slug: string
  name: string
  description: string | null
  price_cents: number
  stock: number | null
  is_active: boolean
  product_images: { image_url: string; sort_order: number; is_primary: boolean }[]
}

const MAX_ITEMS = 20
const MAX_QUANTITY_PER_ITEM = 20

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

const isOriginAllowed = (origin: string, allowedOrigins: string | undefined) => {
  if (allowedOrigins) {
    return allowedOrigins.split(',').map((o) => o.trim()).includes(origin)
  }
  try {
    const url = new URL(origin)
    if (url.protocol === 'https:') return true
    if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) return true
  } catch {
    return false
  }
  return false
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  try {
    const stripeSecretKey = readSecret('STRIPE_SECRET_KEY', 'STRIPE_TEST_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = getServiceRoleKey()
    const allowedOrigins = Deno.env.get('CHECKOUT_ALLOWED_ORIGINS')

    if (!stripeSecretKey || !supabaseUrl || !serviceRoleKey) {
      return json(500, { error: 'Missing environment variables' })
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return json(400, { error: 'Invalid JSON body' })
    }

    const { items, email, origin } = body as CheckoutRequest & { origin?: string }

    if (!Array.isArray(items) || items.length === 0) {
      return json(400, { error: 'Votre panier est vide.' })
    }
    if (items.length > MAX_ITEMS) {
      return json(400, { error: 'Trop d’articles dans le panier.' })
    }

    for (const item of items) {
      if (!item?.id || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY_PER_ITEM) {
        return json(400, { error: 'Article invalide dans le panier.' })
      }
    }

    if (!origin || !isOriginAllowed(origin, allowedOrigins)) {
      return json(400, { error: 'Origine invalide.' })
    }

    // Identifie l'utilisateur si connecté
    let userId: string | null = null
    let userEmail: string | null = null
    const authHeader = req.headers.get('Authorization') ?? ''
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { data: user, error: userError } = await supabase.auth.getUser(token)
      if (!userError && user.user) {
        userId = user.user.id
        userEmail = user.user.email ?? null
      }
    }

    const productIds = items.map((i) => i.id)

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(
        'id, slug, name, description, price_cents, stock, is_active, product_images ( image_url, sort_order, is_primary )'
      )
      .in('id', productIds)

    if (productsError) {
      console.error('Products fetch error:', productsError)
      return json(500, { error: 'Impossible de vérifier les produits.' })
    }

    const productMap = new Map<string, ProductRecord>((products as ProductRecord[] ?? []).map((p) => [p.id, p]))

    const lineItems: {
      price_data: {
        currency: string
        product_data: {
          name: string
          description?: string
          images?: string[]
          metadata: Record<string, string>
        }
        unit_amount: number
      }
      quantity: number
    }[] = []

    let subtotalCents = 0

    for (const item of items) {
      const product = productMap.get(item.id)
      if (!product || !product.is_active) {
        return json(400, { error: `Le produit demandé n’est plus disponible.` })
      }
      if (product.stock !== null && product.stock < item.quantity) {
        return json(400, { error: `Stock insuffisant pour « ${product.name} ».` })
      }

      const customization = item.customization
      const description =
        customization && customization.petName
          ? [
              `Animal : ${customization.petName}`,
              customization.phone1 ? `Tél. : ${customization.phone1}` : null,
              customization.phone2 ? `Tél. 2 : ${customization.phone2}` : null,
              customization.font ? `Police : ${customization.font}` : null,
            ]
              .filter(Boolean)
              .join(' — ')
          : undefined

      const images = product.product_images
        ?.slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => img.image_url)
        .filter(Boolean) as string[] | undefined

      const customizationMetadata: Record<string, string> = customization
        ? {
            pet_name: customization.petName || '',
            phone1: customization.phone1 || '',
            phone2: customization.phone2 || '',
            font: customization.font || '',
          }
        : {}

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            ...(description ? { description } : {}),
            ...(images && images.length > 0 ? { images } : {}),
            metadata: { product_id: product.id, ...customizationMetadata },
          },
          unit_amount: product.price_cents,
        },
        quantity: item.quantity,
      })

      subtotalCents += product.price_cents * item.quantity
    }

    const stripeCustomerEmail = userEmail ?? (email ? email.trim() : null)

    // Identifiant de commande généré AVANT la session Stripe :
    // le webhook retrouvera la commande via metadata.order_id, sans course.
    const orderId = crypto.randomUUID()

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: lineItems,
        ...(stripeCustomerEmail ? { customer_email: stripeCustomerEmail } : {}),
        customer_creation: 'always',
        allow_promotion_codes: true,
        shipping_address_collection: { allowed_countries: ['FR'] },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'eur' },
              display_name: 'Livraison offerte',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 5 },
                maximum: { unit: 'business_day', value: 7 },
              },
            },
          },
        ],
        metadata: {
          order_id: orderId,
          ...(userId ? { user_id: userId } : {}),
        },
        payment_intent_data: {
          metadata: { order_id: orderId, ...(userId ? { user_id: userId } : {}) },
        },
        success_url: `${origin}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/commande?cancelled=1`,
      },
      { idempotencyKey: crypto.randomUUID() }
    )

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        stripe_session_id: session.id,
        status: 'pending',
        user_id: userId,
        customer_email: stripeCustomerEmail,
        subtotal_cents: subtotalCents,
        shipping_cents: 0,
        total_cents: subtotalCents,
        currency: 'eur',
      })

    if (orderError) {
      console.error('Order insert error:', orderError)
      await stripe.checkout.sessions.expire(session.id).catch(() => {})
      return json(500, { error: 'Impossible de créer la commande.' })
    }

    return json(200, { url: session.url })
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Unhandled error in checkout:', err)
    return json(500, { error: err.message ?? 'Internal server error' })
  }
})