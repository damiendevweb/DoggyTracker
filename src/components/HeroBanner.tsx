import { Link } from 'react-router-dom'
import heroImage from '../assets/images/hero-1.jpg'

export const HeroBanner = () => {
    return (
        <section className="hero-banner relative bg-bg border-b border-border -mt-22">
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={heroImage}
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                />
            </div>
            <div className="max-w-7xl mx-auto px-5 mt-22">
                <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-12 animate-fade-in-up relative z-10">

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
                    </div>

                </div>
            </div>
        </section>
    )
}
