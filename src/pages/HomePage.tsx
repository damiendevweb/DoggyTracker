import { Link } from 'react-router-dom'
import { FaqAccordion } from '../components/FAQ'
import { HeroBanner } from '../components/HeroBanner'
import { BlogSection } from '../components/BlogSection'

const steps = [
    { step: '01', title: 'Commande', desc: 'Choisis la taille et la couleur. Livrée en 48h.' },
    { step: '02', title: 'Profil', desc: 'Nom, santé, vaccins, coordonnées. Modifiable à tout moment.' },
    { step: '03', title: 'Scan', desc: 'N\'importe qui scanne avec son téléphone. Zéro app.' },
    { step: '04', title: 'Alerte', desc: 'Notification push + géolocalisation. Retrouvailles rapides.' },
]

const stats = [
    { value: '2 500+', label: 'Animaux' },
    { value: '98%', label: 'Retrouvailles' },
    { value: '4.9/5', label: 'Avis' },
    { value: '10 min', label: 'Scan → contact' },
]

export const HomePage = () => {
    return (
        <>
            <HeroBanner />

            {/* ── Stats bar ── */}
            <section className="bg-bg-elevated border-y border-border">
                <div className="max-w-7xl mx-auto px-5 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((s) => (
                            <div key={s.label} className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-accent">{s.value}</span>
                                <span className="text-xs text-text-muted">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="bg-bg py-20">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Processus</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded overflow-hidden">
                        {steps.map((s) => (
                            <div key={s.step} className="bg-bg-elevated p-6 group hover:bg-bg-hover transition-colors">
                                <span className="text-[10px] text-text-muted tracking-wider">{s.step}</span>
                                <h3 className="text-sm font-semibold text-text-primary mt-3 mb-1.5">{s.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Product ── */}
            <section className="bg-bg-elevated border-y border-border py-20">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Produit</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>
                            <h2 className="font-unbounded text-2xl md:text-3xl font-bold text-text-primary mb-4">
                                La médaille qui change tout
                            </h2>
                            <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                Acier inoxydable. QR Code gravé en profondeur. Fiche modifiable à tout moment.
                            </p>
                            <ul className="space-y-2.5 mb-8">
                                {[
                                    'Résiste aux chocs, à l\'eau, au temps',
                                    'QR Code impossible à effacer',
                                    'Fiche complète en un scan',
                                    'Notification push + géolocalisation',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-xs text-text-secondary">
                                        <span className="text-accent mt-0.5">→</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/categorie/medaille-gravee"
                                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-semibold text-sm px-6 py-2.5 rounded transition-all"
                            >
                                Découvrir
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        <div className="bg-bg-surface border border-border rounded aspect-square flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-5xl block mb-3">🏅</span>
                                <p className="text-xs text-text-muted">Aperçu médaille</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="bg-bg py-20">
                <div className="max-w-3xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">FAQ</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <FaqAccordion />
                </div>
            </section>

            {/* ── Blog ── */}
            <BlogSection />

            {/* ── CTA ── */}
            <section className="bg-accent py-16">
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <h2 className="font-unbounded text-2xl md:text-3xl font-bold text-white mb-3">
                        Prêt à protéger votre animal de compagnie ?
                    </h2>
                    <p className="text-sm text-white mb-6">
                        Rejoignez l'aventure Où est Médor !
                    </p>
                    <Link
                        to="/categorie/medaille-gravee"
                        className="inline-flex items-center gap-2 bg-white hover:bg-accent-hover hover:text-white text-accent font-semibold text-sm px-6 py-2.5 rounded transition-all"
                    >
                        Commander
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </>
    )
}
