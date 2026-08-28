import { Link } from 'react-router-dom'
import herobanner_visual from '../assets/images/herobanner_1.jpg'

export const HeroBanner = () => {
    return (
        <section className="relative bg-bg border-b border-border">
            <div className="max-w-7xl mx-auto px-5">
                <div className="grid lg:grid-cols-2 gap-0 min-h-[70vh]">
                    {/* Left — copy */}
                    <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-12 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                            <span className="text-[11px] font-medium text-accent uppercase tracking-widest">
                                La médaille connectée n°1 en France
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-text-primary mb-5">
                            Ne perdez plus
                            <br />
                            <span className="text-accent">votre animal</span>
                            <br />
                            de vue
                        </h1>

                        <p className="text-sm text-text-secondary leading-relaxed max-w-md mb-8">
                            QR Code scannable par tout smartphone. Fiche complète,
                            géolocalisation et notification instantanée.
                        </p>

                        <div className="flex flex-wrap gap-2.5 mb-8">
                            <Link
                                to="/categorie/medaille-gravee"
                                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-semibold text-sm px-6 py-2.5 rounded transition-all"
                            >
                                Commander
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/le-concept"
                                className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm px-6 py-2.5 rounded border border-border hover:border-border-strong transition-all"
                            >
                                Comment ça marche
                            </Link>
                        </div>

                        <div className="flex items-center gap-5 text-xs text-text-muted">
                            <span>+2 500 animaux protégés</span>
                            <span className="w-px h-3 bg-border" />
                            <span>4.9/5 avis</span>
                            <span className="w-px h-3 bg-border" />
                            <span>98% retrouvailles</span>
                        </div>
                    </div>

                    {/* Right — visual */}
                    <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <img
                            className="w-full h-full min-h-[320px] lg:min-h-[480px] object-cover"
                            src={herobanner_visual}
                            alt="Chien avec médaille connectée"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent lg:block hidden" />

                        {/* Floating badge */}
                        <div className="absolute bottom-5 left-5 bg-bg-elevated border border-border rounded px-3 py-2 flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-accent-dim rounded flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-text-primary leading-tight">Scan réussi</p>
                                <p className="text-[10px] text-text-muted">Retrouvailles en cours</p>
                            </div>
                        </div>

                        {/* Tech badge */}
                        <div className="absolute top-5 right-5 bg-bg-elevated border border-border rounded px-2.5 py-1.5 flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" />
                            </svg>
                            <span className="text-[10px] text-text-secondary">QR Code</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
