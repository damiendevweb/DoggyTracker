export const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-5 py-8 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
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
                    <a href="#" className="link-style text-xs text-text-secondary">
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
            © 2026 Où est Médor ?
          </span>
          <div className="flex items-center gap-3">
            {['Facebook', 'Instagram', 'Twitter'].map((s) => (
              <a key={s} href="#" className="text-[11px] text-text-muted hover:text-text-secondary">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
