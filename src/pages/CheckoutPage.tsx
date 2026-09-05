import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/product.types'

export const CheckoutPage = () => {
    const { cart, cartTotal } = useCart()
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const cancelled = searchParams.get('cancelled') === '1'

    const [email, setEmail] = useState(user?.email ?? '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handlePay = async () => {
        if (cart.length === 0) return

        setLoading(true)
        setError('')

        const items = cart.map((item) => ({
            id: item.id,
            quantity: 1,
            customization: item.customization ?? null,
        }))

        const { data, error: fnError } = await supabase.functions.invoke('checkout', {
            body: {
                items,
                email: email.trim() || undefined,
                origin: window.location.origin,
            },
        })

        if (fnError) {
            setError(fnError.message || 'Impossible de lancer le paiement.')
            setLoading(false)
            return
        }

        const url = (data as { url?: string } | null)?.url
        if (url) {
            window.location.href = url
        } else {
            setError('Impossible de lancer le paiement.')
            setLoading(false)
        }
    }

    if (cart.length === 0 && !cancelled) {
        return (
            <div className="min-h-screen">
                <div className="max-w-3xl mx-auto px-5 py-16 text-center">
                    <h1 className="font-unbounded text-2xl font-bold text-text-primary mb-4">
                        Votre panier est vide
                    </h1>
                    <Link
                        to="/categorie/medaille-gravee"
                        className="inline-block rounded bg-accent px-6 py-3 text-sm font-medium text-bg hover:bg-accent-hover"
                    >
                        Voir les médailles
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto px-5 py-10">
                <div className="mb-8">
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">
                        Paiement sécurisé
                    </span>
                    <h1 className="font-unbounded text-2xl md:text-3xl font-bold text-text-primary mt-2">
                        Commande
                    </h1>
                </div>

                {cancelled && (
                    <div className="mb-6 rounded border border-border bg-bg-elevated px-4 py-3 text-sm text-text-secondary">
                        Le paiement a été annulé. Aucun montant n'a été débité.
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-5 md:items-start">
                    <div className="md:col-span-3">
                        <div className="rounded border border-border overflow-hidden">
                            <div className="border-b border-border px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Récapitulatif
                            </div>
                            <ul role="list" className="divide-y divide-border">
                                {cart.map((item) => (
                                    <li key={item.cartItemId} className="flex items-start gap-4 px-4 py-3">
                                        {item.image_url ? (
                                            <img
                                                alt={item.name}
                                                src={item.image_url}
                                                className="h-14 w-14 shrink-0 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-14 w-14 shrink-0 rounded bg-bg-surface" />
                                        )}
                                        <div className="flex flex-1 flex-col">
                                            <div className="flex justify-between gap-4 text-sm font-medium text-text-primary">
                                                <span>{item.name}</span>
                                                <span>{formatPrice(item.price_cents)}</span>
                                            </div>
                                            <div className="mt-1 text-xs text-text-secondary">
                                                {item.customization?.petName}
                                                {item.customization?.phone1 ? ` — ${item.customization.phone1}` : ''}
                                                {item.customization?.phone2 ? ` — ${item.customization.phone2}` : ''}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 rounded border border-border px-4 py-4 text-xs text-text-secondary">
                            Votre code promo peut être saisi à l'étape suivante, sur la page de paiement Stripe.
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="rounded border border-border p-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-text-primary">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-success">
                                    <span>Livraison</span>
                                    <span>Offerte</span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-text-primary">
                                    <span>Total</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <label className="mt-5 block">
                                <span className="text-xs font-medium text-text-muted">
                                    Email {user ? '(facture envoyée à votre compte)' : ''}
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vous@exemple.fr"
                                    className="mt-1 block w-full rounded border border-border bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                                />
                            </label>

                            {user ? (
                                <p className="mt-2 text-xs text-text-muted">
                                    Commande rattachée à votre compte.
                                </p>
                            ) : (
                                <p className="mt-2 text-xs text-text-muted">
                                    Paiement en tant qu'invité. Vous pourrez créer un compte plus tard.
                                </p>
                            )}

                            {error && (
                                <p className="mt-3 rounded border border-error/30 bg-error/5 px-3 py-2 text-xs text-error">
                                    {error}
                                </p>
                            )}

                            <button
                                type="button"
                                disabled={loading || cart.length === 0}
                                onClick={handlePay}
                                className="mt-4 flex w-full items-center justify-center rounded bg-accent px-6 py-3 text-sm font-medium text-bg hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? 'Redirection vers Stripe…' : 'Payer en toute sécurité'}
                            </button>

                            <p className="mt-3 text-center text-[10px] text-text-muted">
                                Paiement par carte bancaire, Apple Pay ou Google Pay via Stripe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}