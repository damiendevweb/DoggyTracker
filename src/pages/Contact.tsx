export const Contact = () => {
    return (
        <div className="min-h-screen bg-bg">
            <div className="max-w-7xl mx-auto px-5 py-6">
                <nav className="flex items-center gap-2 text-xs text-text-muted">
                    <a href="/" className="hover:text-text-secondary transition-colors">Accueil</a>
                    <span>/</span>
                    <span className="text-text-secondary">Contact</span>
                </nav>
            </div>

            <div className="max-w-4xl mx-auto px-5 pb-16">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Contact
                </h1>
                <p className="text-sm text-text-secondary">
                    Une question, un doute, une histoire à partager ?
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-5 pb-20">
                {/* Contact cards */}
                <div className="grid md:grid-cols-3 gap-px bg-border rounded overflow-hidden mb-14">
                    {[
                        { icon: '📧', title: 'Email', line1: 'contact@ouestmedor.fr', line2: 'Réponse sous 24h' },
                        { icon: '📞', title: 'Téléphone', line1: '01 23 45 67 89', line2: 'Lun-Ven 9h-18h' },
                        { icon: '📍', title: 'Adresse', line1: '12 Rue des Toutous', line2: '75000 Paris' },
                    ].map((card) => (
                        <div key={card.title} className="bg-bg-elevated p-6 text-center hover:bg-bg-hover transition-colors">
                            <div className="w-10 h-10 bg-accent-dim rounded flex items-center justify-center text-lg mx-auto mb-3">
                                {card.icon}
                            </div>
                            <h3 className="text-sm font-semibold text-text-primary mb-1">{card.title}</h3>
                            <p className="text-xs text-text-secondary">{card.line1}</p>
                            <p className="text-xs text-text-muted">{card.line2}</p>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-bg-elevated border border-border rounded p-8 md:p-10">
                        <h2 className="text-lg font-bold text-text-primary mb-1">Envoie-nous un message</h2>
                        <p className="text-xs text-text-muted mb-8">Tous les champs marqués d'un * sont obligatoires.</p>

                        <form className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                        Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Sophie"
                                        className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Martin"
                                        className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    placeholder="sophie@exemple.fr"
                                    className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                    Téléphone <span className="text-text-muted">(optionnel)</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="06 01 02 03 04"
                                    className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                    Sujet *
                                </label>
                                <select className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0">
                                    <option value="">Sélectionne un sujet</option>
                                    <option value="produit">Question sur un produit</option>
                                    <option value="commande">Suivi de commande</option>
                                    <option value="retrouvailles">Témoignage de retrouvailles</option>
                                    <option value="partenariat">Partenariat</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                    Message *
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="Dis-nous tout..."
                                    className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted resize-y"
                                />
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    id="consent"
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 rounded border-border bg-bg-surface text-accent focus:ring-accent"
                                />
                                <label htmlFor="consent" className="text-xs text-text-muted">
                                    J'accepte que mes données soient traitées pour répondre à ma demande.{' '}
                                    <a href="#" className="text-accent hover:underline">Politique de confidentialité</a>.
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-accent hover:bg-accent-hover text-bg font-semibold text-sm px-8 py-3 rounded transition-all"
                            >
                                Envoyer mon message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
