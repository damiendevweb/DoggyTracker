// @ts-nocheck — Deno runtime, not Node.js

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push'

const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json',
}

type AccessEventRecord = {
      id: string
      animal_id: string
      event_type: 'qr_scan' | 'direct_access'
      source?: string | null
      visitor_user_id?: string | null
      meta?: Record<string, unknown> | null
      created_at: string
}

type WebhookPayload = {
      type: 'INSERT' | 'UPDATE' | 'DELETE'
      table: string
      schema: string
      record: AccessEventRecord
      old_record: AccessEventRecord | null
}

Deno.serve(async (req) => {
      if (req.method === 'OPTIONS') {
            return new Response(JSON.stringify({ ok: true }), {
                  status: 200,
                  headers: corsHeaders,
            })
      }

      if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                  status: 405,
                  headers: corsHeaders,
            })
      }

      try {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!
            const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
            const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
            const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!

            if (!supabaseUrl || !serviceRoleKey || !vapidPublicKey || !vapidPrivateKey) {
                  return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
                        status: 500,
                        headers: corsHeaders,
                  })
            }

            const supabase = createClient(supabaseUrl, serviceRoleKey, {
                  auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                  },
            })

            const payload: WebhookPayload = await req.json()

            if (payload.type !== 'INSERT') {
                  return new Response(JSON.stringify({ ok: true, skipped: 'Not an INSERT event' }), {
                        status: 200,
                        headers: corsHeaders,
                  })
            }

            const event = payload.record

            if (!event?.animal_id) {
                  return new Response(JSON.stringify({ error: 'Missing animal_id in webhook record' }), {
                        status: 400,
                        headers: corsHeaders,
                  })
            }

            const { data: animal, error: animalError } = await supabase
                  .from('animal')
                  .select('id, nom, user_id')
                  .eq('id', event.animal_id)
                  .single()

            if (animalError || !animal) {
                  return new Response(JSON.stringify({ error: 'Animal not found' }), {
                        status: 404,
                        headers: corsHeaders,
                  })
            }

            const ownerUserId = animal.user_id
            if (!ownerUserId) {
                  return new Response(JSON.stringify({ ok: true, skipped: 'Animal has no owner' }), {
                        status: 200,
                        headers: corsHeaders,
                  })
            }

            const { data: subscriptions, error: subscriptionsError } = await supabase
                  .from('push_subscriptions')
                  .select('id, endpoint, p256dh, auth')
                  .eq('user_id', ownerUserId)

            if (subscriptionsError) {
                  return new Response(JSON.stringify({ error: subscriptionsError.message }), {
                        status: 500,
                        headers: corsHeaders,
                  })
            }

            if (!subscriptions || subscriptions.length === 0) {
                  return new Response(JSON.stringify({ ok: true, skipped: 'Owner has no push subscriptions' }), {
                        status: 200,
                        headers: corsHeaders,
                  })
            }

            webpush.setVapidDetails(
                  'mailto:contact@doggytracker.app',
                  vapidPublicKey,
                  vapidPrivateKey
            )

            const animalName = animal.nom ?? 'votre animal'
            const meta = event.meta ?? {}

            const rawAddress = typeof meta.address === 'string' ? meta.address : (typeof meta.shortAddress === 'string' ? meta.shortAddress : null)
            const shortAddress = typeof meta.shortAddress === 'string' ? meta.shortAddress : (typeof meta.address === 'string' ? meta.address : null)
            const latitude = typeof meta.latitude === 'number' ? meta.latitude : null
            const longitude = typeof meta.longitude === 'number' ? meta.longitude : null

            const title = 'Fiche animal consultée'

            let locationPart = ''

            if (shortAddress || rawAddress) {
                  locationPart = ` à ${shortAddress || rawAddress}`
            } else if (latitude != null && longitude != null) {
                  locationPart = ` près de ${latitude}, ${longitude}`
            }

            const body = `Quelqu’un a consulté la fiche de ${animalName}${locationPart}.`

            const notificationPayload = JSON.stringify({
                  notificationId: crypto.randomUUID(),
                  sentAt: new Date().toISOString(),
                  title,
                  body,
                  url: `/dashboard/animal/${animal.id}`,
                  animalId: animal.id,
                  animalName,
                  eventType: event.event_type,
                  eventId: event.id,
            })

            let sent = 0
            let failed = 0
            const invalidSubscriptionIds: string[] = []

            for (const sub of subscriptions) {
                  try {
                        await webpush.sendNotification(
                              {
                                    endpoint: sub.endpoint,
                                    keys: {
                                          p256dh: sub.p256dh,
                                          auth: sub.auth,
                                    },
                              },
                              notificationPayload
                        )
                        sent++
                  } catch (error: any) {
                        failed++
                        console.error('Push error for subscription', sub.id, error)

                        const statusCode = error?.statusCode || error?.status
                        if (statusCode === 404 || statusCode === 410) {
                              invalidSubscriptionIds.push(sub.id)
                        }
                  }
            }

            return new Response(
                  JSON.stringify({
                        ok: true,
                        sent,
                        failed,
                        removedInvalidSubscriptions: invalidSubscriptionIds.length,
                  }),
                  {
                        status: 200,
                        headers: corsHeaders,
                  }
            )
      } catch (error: any) {
            console.error('Unhandled error in notify-animal-owner:', error)

            return new Response(
                  JSON.stringify({
                        error: error?.message ?? 'Internal server error',
                  }),
                  {
                        status: 500,
                        headers: corsHeaders,
                  }
            )
      }
})
