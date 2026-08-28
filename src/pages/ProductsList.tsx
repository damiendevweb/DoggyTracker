import { Link } from "react-router-dom"

const products = [
  { id: 1, name: 'Médaille QR', href: 'medaille-qr', price: '48 €' },
  { id: 2, name: 'Médaille Or', href: '#', price: '59 €' },
  { id: 3, name: 'Pack 2 Médailles', href: '#', price: '89 €' },
  { id: 4, name: 'Médaille Mini', href: '#', price: '35 €' },
]

export const ProductList = () => {
  return (
    <div className="bg-bg">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Produits</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-8" style={{ fontFamily: "'Unbounded', sans-serif" }}>
          Nos produits
        </h1>
        <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-border rounded overflow-hidden">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/produit/${product.href}`}
              className="group bg-bg-elevated p-5 hover:bg-bg-hover transition-colors"
            >
              <div className="aspect-square w-full bg-bg-surface border border-border mb-4 flex items-center justify-center">
                <span className="text-2xl">🏅</span>
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
