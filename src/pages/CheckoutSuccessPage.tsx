import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

type OrderSummary = {
    id: string
    status: string
    total_cents: number
    currency: string
    created_at: string
}

export const CheckoutSuccessPage = () => {
    const [searchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const { clearCart } = useCart()
    const { user } = useAuth()

    const [order, setOrder] = useState<OrderSummary | null>(null)

    useEffect(() => {
        clearCart()
    }, [clearCart])

    useEffect(() => {
        if (!user || !sessionId) return
        let cancelled = false

        supabase
            .from('orders')
            .select('id, status, total_cents, currency, created_at')
            .eq('stripe_session_id', sessionId)
            .maybeSingle()
            .then(({ data }) => {
                if (!cancelled && data) setOrder(data as OrderSummary)
            })

        return () => {
            cancelled = true
        }
    }, [user, sessionId])

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto px-5 py-20 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="font-unbounded text-2xl md:text-3xl font-bold text-text-primary mb-3">
                    Merci pour votre commande !
                </h1>
                <p className="mx-auto max-w-md text-sm text-text-secondary leading-relaxed">
                    Votre médaille est en cours de préparation. Un email de confirmation vous a été envoyé
                    avec le récapitulatif de votre commande.
                </p>

                {order && (
                    <div className="mx-auto mt-8 max-w-sm rounded border border-border px-4 py-4 text-left text-sm">
                        <div className="flex justify-between border-b border-border pb-2">
                            <span className="text-text-muted">Référence</span>
                            <span className="font-mono text-xs text-text-primary">
                                {order.id.slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-border py-2">
                            <span className="text-text-muted">Statut</span>
                            <span className="font-medium text-success capitalize">{order.status}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-text-muted">Total</span>
                            <span className="font-semibold text-text-primary">
                                {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: order.currency,
                                }).format(order.total_cents / 100)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="rounded bg-accent px-6 py-3 text-sm font-medium text-bg hover:bg-accent-hover"
                        >
                            Aller au tableau de bord
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded bg-accent px-6 py-3 text-sm font-medium text-bg hover:bg-accent-hover"
                        >
                            Créer un compte
                        </Link>
                    )}
                    <Link
                        to="/categorie/medaille-gravee"
                        className="rounded border border-border px-6 py-3 text-sm font-medium text-text-primary hover:bg-bg-hover"
                    >
                        Continuer mes achats
                    </Link>
                </div>
            </div>
        </div>
    )
}