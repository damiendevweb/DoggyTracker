import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-bg border-t border-border">
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-1.5 mb-3">
              <span className="text-xs">🐾</span>
              <span className="text-xs font-semibold text-text-primary" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                Où est Médor ?
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              La médaille intelligente pour retrouver votre animal.
            </p>
          </div>

          {[
            { title: 'Produit', items: ['Médailles', 'Accessoires', 'Concept', 'Blog'] },
            { title: 'Aide', items: ['FAQ', 'Contact', 'Livraison', 'Retours'] },
            { title: 'Légal', items: ['CGV', 'Confidentialité', 'Mentions légales'] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-text-muted">
            © 2026 Où est Médor.
          </span>
          <div className="flex items-center gap-3">
            {['Facebook', 'Instagram', 'Twitter'].map((s) => (
              <a key={s} href="#" className="text-[11px] text-text-muted hover:text-text-secondary transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
