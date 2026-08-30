import { Link } from "react-router-dom"
import heroImage from '../assets/images/hero-1.jpg'

const products = [
  { id: 1, name: 'Médaille QR', href: 'medaille-qr', price: '48 €' },
  { id: 2, name: 'Médaille Or', href: '#', price: '59 €' },
  { id: 3, name: 'Pack 2 Médailles', href: '#', price: '89 €' },
  { id: 4, name: 'Médaille Mini', href: '#', price: '35 €' },
]

export const ProductList = () => {
  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="mb-8">
          <h2 className="font-unbounded text-3xl font-bold text-text-primary mb-6">
            Nos produits
          </h2>
          <p className="text-text-secondary max-w-2xl text-sm">
            Découvrez notre gamme de médailles en acier inoxydable, conçues pour assurer la sécurité de votre animal. Chaque médaille est équipée d'un QR code unique, permettant à toute personne qui le scanne d'accéder instantanément aux informations de contact que vous avez fournies.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-hidden">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/produit/${product.href}`}
            >
              <div className="aspect-4/5 w-full mb-4 flex items-center justify-center">
                <img src={heroImage} alt={product.name} className="w-full h-full object-cover"/>
              </div>
              <h3 className="text-sm font-medium text-text-primary">{product.name}</h3>
              <p className="mt-1 text-sm font-semibold text-accent">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
