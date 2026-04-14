import herobanner_visual from '../assets/images/herobanner_1.jpg'

export const HeroBanner = () => {
    return (
            <section className="h-96 relative flex">
                <div className='absolute top-0 left-0 w-full h-full'>
                    <img className='object-cover w-full h-full' src={herobanner_visual} alt="Hero Banner" />
                </div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center '>
                        <h2 className='text-lg md:text-2xl lg:text-3xl font-bold'>Où est Médor, la médaille intelligente dont votre animal de compagnie a besoin.</h2>
                        <a className='' href='#'>Nos produits</a>
                    </div>
            </section>
    )
}