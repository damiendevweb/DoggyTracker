import { Link } from 'react-router-dom'

const milestones = [
    { year: '2020', title: 'L\'idée', text: 'Max, le golden retriever de notre fondateur, s\'échappe. Après 6 heures d\'angoisse, une évidence : il faut un moyen plus simple de réunir propriétaires et animaux.' },
    { year: '2021', title: 'Prototype', text: '8 mois de R&D. 12 prototypes. Le rêve prend forme dans l\'imprimante 3D artisanale.' },
    { year: '2022', title: 'Lancement', text: 'Les premières médailles voient le jour. Le site est en ligne. Les premiers témoignages de retrouvailles arrivent.' },
    { year: '2023', title: '1000 animaux', text: 'Le cap des 1000 animaux protégés est franchi. Bouches-à-oreilles, vétérinaires, presse locale.' },
    { year: '2024', title: 'App mobile', text: 'Notification instantanée, gestion de profil, partage de localisation avec les vétérinaires.' },
    { year: '2025', title: 'Nouvelle gamme', text: 'Nouvelles couleurs, tailles XXS pour chats, éditions limitées, colliers connectés.' },
    { year: '2026', title: '2500 animaux', text: '98% de retrouvailles. Partenariats refuges, expansion internationale.' },
]

export const NotreHistoire = () => {
    return (
        <div className="min-h-screen bg-bg">
            <div className="max-w-7xl mx-auto px-5 py-6">
                <nav className="flex items-center gap-2 text-xs text-text-muted">
                    <Link to="/" className="hover:text-text-secondary transition-colors">Accueil</Link>
                    <span>/</span>
                    <span className="text-text-secondary">Histoire</span>
                </nav>
            </div>

            <div className="max-w-4xl mx-auto px-5 pb-16">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Notre histoire
                </h1>
                <p className="text-sm text-text-secondary">
                    De l'angoisse à 2500 animaux protégés.
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-5 pb-20">
                <div className="relative">
                    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />

                    {milestones.map((m) => (
                        <div key={m.year} className="relative pl-10 pb-10 last:pb-0">
                            <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-bg-surface border-2 border-border flex items-center justify-center z-10">
                                <div className="w-2 h-2 rounded-full bg-accent" />
                            </div>
                            <div>
                                <span className="text-[10px] text-accent tracking-wider">{m.year}</span>
                                <h3 className="text-sm font-semibold text-text-primary mt-1 mb-1">{m.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed">{m.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <section className="bg-bg-elevated border-t border-border py-16">
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        Écrivez la suite
                    </h2>
                    <p className="text-sm text-text-secondary mb-6">Chaque médaille, une nouvelle histoire.</p>
                    <Link
                        to="/categorie/medaille-gravee"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-semibold text-sm px-6 py-2.5 rounded transition-all"
                    >
                        Commander
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    )
}
