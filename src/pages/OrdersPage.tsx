import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import SidebarProfile from '../components/SidebarProfile'

type OrderItem = {
    id: string
    product_id: string | null
    quantity: number
    unit_price_cents: number
    customization: {
        petName?: string
        phone1?: string
        phone2?: string
        font?: string
    } | null
}

type Order = {
    id: string
    status: string
    currency: string
    created_at: string
    subtotal_cents: number
    discount_cents: number
    shipping_cents: number
    total_cents: number
    promo_code: string | null
    shipping_address: {
        line1?: string | null
        city?: string | null
        postal_code?: string | null
        country?: string | null
    } | null
    order_items: OrderItem[]
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    paid: { label: 'Payée', className: 'bg-success/10 text-success' },
    pending: { label: 'En attente de paiement', className: 'bg-amber-100 text-amber-700' },
    expired: { label: 'Expirée', className: 'bg-bg-hover text-text-muted' },
    cancelled: { label: 'Annulée', className: 'bg-bg-hover text-text-muted' },
}

const formatPrice = (cents: number, currency: string) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
    }).format(cents / 100)

export const OrdersPage = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('orders')
                .select(
                    'id, status, currency, created_at, subtotal_cents, discount_cents, shipping_cents, total_cents, promo_code, shipping_address, order_items ( id, product_id, quantity, unit_price_cents, customization )'
                )
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
                setError('Impossible de récupérer vos commandes.')
            } else {
                setOrders((data as Order[]) ?? [])
            }
            setLoading(false)
        }

        fetchOrders()
    }, [user])

    return (
        <div className="md:flex flex-1">
            <SidebarProfile />
            <main className="flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-3xl">
                    <h1 className="font-unbounded mb-6 text-xl font-bold text-text-primary">
                        Mes commandes
                    </h1>

                    {loading ? (
                        <p className="text-sm text-text-muted">Chargement...</p>
                    ) : error ? (
                        <div className="rounded bg-error/10 border border-error/20 p-4 text-sm text-error">
                            {error}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="rounded border border-border bg-bg-elevated p-8 text-center">
                            <p className="text-sm text-text-muted">
                                Vous n'avez pas encore de commande.
                            </p>
                            <a
                                href="/categorie/medaille-gravee"
                                className="mt-4 inline-block rounded bg-accent px-6 py-3 text-sm font-medium text-bg hover:bg-accent-hover"
                            >
                                Voir les médailles
                            </a>
                        </div>
                    ) : (
                        <ul role="list" className="space-y-4">
                            {orders.map((order) => {
                                const status = STATUS_LABELS[order.status] ?? {
                                    label: order.status,
                                    className: 'bg-bg-hover text-text-muted',
                                }
                                const date = new Date(order.created_at)
                                const address = order.shipping_address
                                const hasDiscount = order.discount_cents > 0

                                return (
                                    <li
                                        key={order.id}
                                        className="rounded border border-border bg-bg-elevated overflow-hidden"
                                    >
                                        <div className="border-b border-border px-5 py-4">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-xs text-text-primary">
                                                        {order.id.slice(0, 8).toUpperCase()}
                                                    </span>
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${status.className}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-text-muted">
                                                    {date.toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}{' '}
                                                    · {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        <ul role="list" className="divide-y divide-border">
                                            {order.order_items.map((item) => (
                                                <li key={item.id} className="px-5 py-3">
                                                    <div className="flex items-baseline justify-between gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-text-primary">
                                                                {item.customization?.petName
                                                                    ? `Médaille « ${item.customization.petName} »`
                                                                    : 'Produit'}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-text-secondary">
                                                                Qté {item.quantity}
                                                                {item.customization?.phone1 &&
                                                                    ` · ${item.customization.phone1}`}
                                                                {item.customization?.phone2 &&
                                                                    ` · ${item.customization.phone2}`}
                                                                {item.customization?.font &&
                                                                    ` · Police : ${item.customization.font}`}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-text-primary">
                                                            {formatPrice(
                                                                item.unit_price_cents * item.quantity,
                                                                order.currency
                                                            )}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="border-t border-border px-5 py-4">
                                            <div className="space-y-1 text-xs text-text-secondary">
                                                <div className="flex justify-between">
                                                    <span>Sous-total</span>
                                                    <span>{formatPrice(order.subtotal_cents, order.currency)}</span>
                                                </div>
                                                {hasDiscount && (
                                                    <div className="flex justify-between text-success">
                                                        <span>Promo{order.promo_code ? ` (${order.promo_code})` : ''}</span>
                                                        <span>−{formatPrice(order.discount_cents, order.currency)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span>Livraison</span>
                                                    <span>{order.shipping_cents > 0 ? formatPrice(order.shipping_cents, order.currency) : 'Offerte'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm font-semibold text-text-primary pt-1">
                                                    <span>Total</span>
                                                    <span>{formatPrice(order.total_cents, order.currency)}</span>
                                                </div>
                                            </div>

                                            {address?.line1 && (
                                                <p className="mt-3 border-t border-border pt-3 text-[10px] text-text-muted">
                                                    Livré à : {address.line1}
                                                    {address.postal_code && `, ${address.postal_code}`}
                                                    {address.city && ` ${address.city}`}
                                                    {address.country && ` (${address.country})`}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    )
}