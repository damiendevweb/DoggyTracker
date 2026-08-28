import { Link } from 'react-router-dom'

export const TopInfoBanner = () => {
    const text = 'LIVRAISON GRATUITE CE WEEK-END'
    const repeatCount = 20

    return (
        <div className="w-full overflow-hidden bg-[#6eff8e] py-2">
            <Link
                to="/categorie/medaille-gravee"
                className="flex whitespace-nowrap animate-marquee"
                aria-label="Livraison gratuite ce week-end"
            >
                {[...Array(repeatCount)].map((_, i) => (
                    <span key={i} className="flex items-center gap-4 px-4 text-sm font-semibold text-text-primary">
                        {text}
                    </span>
                ))}
            </Link>
        </div>
    )
}