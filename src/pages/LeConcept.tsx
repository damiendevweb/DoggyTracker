import { Link } from 'react-router-dom'

const steps = [
    { num: '01', title: 'Réception', desc: 'Commande en ligne, reçue en 48h.' },
    { num: '02', title: 'Configuration', desc: 'Crée le profil depuis ton espace sécurisé.' },
    { num: '03', title: 'Scan', desc: 'N\'importe qui scanne. Aucune app requise.' },
    { num: '04', title: 'Notification', desc: 'Alerte push avec localisation GPS.' },
]

const comparisons = [
    { trad: 'Infos limitées gravées', smart: 'Fiche complète et modifiable' },
    { trad: 'Pas de mise à jour', smart: 'Modifiable en ligne, sans frais' },
    { trad: 'Pas de suivi', smart: 'Notification instantanée + GPS' },
    { trad: 'Médaille générique', smart: 'Personnalisation complète' },
]

const materials = [
    { title: 'Acier inoxydable', desc: 'Résiste aux chocs et à l\'eau.' },
    { title: 'QR gravé', desc: 'Impossible à effacer.' },
    { title: 'Anneau renforcé', desc: 'Attache solide et fiable.' },
    { title: 'Finition premium', desc: 'Bords polis, aspect soigné.' },
]

export const LeConcept = () => {
    return (
        <div className="min-h-screen bg-bg">
            <div className="max-w-7xl mx-auto px-5 py-6">
                <nav className="flex items-center gap-2 text-xs text-text-muted">
                    <Link to="/" className="hover:text-text-secondary transition-colors">Accueil</Link>
                    <span>/</span>
                    <span className="text-text-secondary">Concept</span>
                </nav>
            </div>

            <div className="max-w-4xl mx-auto px-5 pb-16">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Le concept
                </h1>
                <p className="text-sm text-text-secondary max-w-xl">
                    Une médaille connectée qui transforme un QR Code en{' '}
                    <span className="text-accent font-medium">lien direct</span> entre celui qui trouve et vous.
                </p>
            </div>

            {/* Intro */}
            <div className="max-w-5xl mx-auto px-5 pb-20">
                <div className="grid lg:grid-cols-2 border border-border rounded overflow-hidden">
                    <div className="p-8 md:p-10">
                        <h2 className="text-xl font-bold text-text-primary mb-3">
                            <span className="text-accent">Où est Médor ?</span>, c'est quoi ?
                        </h2>
                        <p className="text-sm text-text-secondary leading-relaxed mb-3">
                            Une médaille connectée qui remplace les plaques gravées par un QR Code intelligent.
                            Fixée au collier, elle permet d'accéder instantanément aux informations de votre animal.
                        </p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Pas d'application, pas d'abonnement. Une médaille, un QR Code, la tranquillité.
                        </p>
                    </div>
                    <div className="bg-bg-surface border-l border-border p-8 md:p-10 flex items-center justify-center min-h-[240px]">
                        <div className="text-center">
                            <span className="text-4xl block mb-3">🏅</span>
                            <p className="text-xs text-text-muted">QR Code + scan = retrouvailles</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works */}
            <section className="bg-bg-elevated border-y border-border py-20">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Processus</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded overflow-hidden">
                        {steps.map((s) => (
                            <div key={s.num} className="bg-bg-elevated p-6">
                                <span className="text-[10px] text-text-muted">{s.num}</span>
                                <h3 className="text-sm font-semibold text-text-primary mt-2 mb-1">{s.title}</h3>
                                <p className="text-xs text-text-secondary">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="bg-bg py-20">
                <div className="max-w-4xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Comparaison</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="space-px bg-border rounded overflow-hidden">
                        {comparisons.map((c, i) => (
                            <div key={i} className="bg-bg-elevated grid md:grid-cols-2 gap-px">
                                <div className="bg-bg-elevated p-5">
                                    <p className="text-[10px] text-text-muted uppercase mb-1">Classique</p>
                                    <p className="text-sm text-text-secondary">{c.trad}</p>
                                </div>
                                <div className="bg-bg-surface p-5">
                                    <p className="text-[10px] text-accent uppercase mb-1">Où est Médor ?</p>
                                    <p className="text-sm text-text-primary font-medium">{c.smart}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Materials */}
            <section className="bg-bg-elevated border-y border-border py-20">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Matériaux</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded overflow-hidden">
                        {materials.map((m) => (
                            <div key={m.title} className="bg-bg-elevated p-6 hover:bg-bg-hover transition-colors">
                                <h3 className="text-sm font-semibold text-text-primary mb-1">{m.title}</h3>
                                <p className="text-xs text-text-secondary">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-bg py-16">
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        Prêt ?
                    </h2>
                    <p className="text-sm text-text-secondary mb-6">Rejoignez les 2500+ familles protégées.</p>
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
            </section>
        </div>
    )
}
