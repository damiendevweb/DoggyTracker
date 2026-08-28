import { useState } from 'react'

const faqItems = [
    {
        q: 'Faut-il une app pour scanner ?',
        a: 'Non. L\'appareil photo du smartphone suffit. Le QR Code ouvre directement la fiche dans le navigateur.',
    },
    {
        q: 'Que se passe-t-il quand quelqu\'un scanne ?',
        a: 'La personne accède à la fiche de votre animal. Vous recevez une notification push avec la localisation du scan.',
    },
    {
        q: 'Délai de livraison ?',
        a: 'Gratuit en France métropolitaine, sous 5-7 jours ouvrés. Expédiée sous 48h.',
    },
    {
        q: 'Puis-je modifier les infos après gravure ?',
        a: 'Oui. La fiche est modifiable à tout moment depuis votre espace personnel.',
    },
    {
        q: 'La médaille est-elle résistante ?',
        a: 'Acier inoxydable, résistante aux chocs, à l\'eau et aux UV. Le QR Code est gravé en profondeur.',
    },
]

export function FaqAccordion() {
    const [open, setOpen] = useState<number | null>(null)

    return (
        <div className="space-px bg-border rounded overflow-hidden">
            {faqItems.map((item, i) => (
                <div key={i} className="bg-bg-elevated">
                    <button
                        type="button"
                        onClick={() => setOpen(open === i ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm text-text-primary hover:bg-bg-hover transition-colors"
                    >
                        <span className="font-medium">{item.q}</span>
                        <svg
                            className={`w-3.5 h-3.5 shrink-0 text-text-muted transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {open === i && (
                        <div className="px-5 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border pt-3">
                            {item.a}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
