import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ShoppingCartDrawer } from "./ShoppingCartDrawer";
import { useState, useEffect } from "react";

export const NavigationBar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="sticky w-full top-0 z-50 p-4"
    >
        <div className={`flex items-center justify-between max-w-7xl mx-auto rounded-lg px-5 h-14 transition-all duration-400 header--is-transparent ${
        scrolled || menuOpen ? 'bg-white header--is-activate' : 'bg-transparent hover:bg-white'
      }`}>
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span
                className="text-sm font-semibold text-text-primary tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                Où est Médor ?
              </span>
            </Link>
            <nav>
              <ul className="hidden lg:flex items-center gap-0.5 mr-4">
                {[
                  { to: "/categorie/medaille-gravee", label: "Produits" },
                  { to: "/le-concept", label: "Concept" },
                  { to: "/notre-histoire", label: "Histoire" },
                  { to: "/contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                    to={link.to}
                    className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                to="/profile"
                className="text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded border border-border hover:border-border-strong transition-colors"
              >
                Profil
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-bg bg-accent hover:bg-accent-hover px-4 py-1.5 rounded transition-colors"
              >
                Connexion
              </Link>
            )}

            <ShoppingCartDrawer />

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center p-1.5 text-text-secondary rounded hover:bg-bg-hover hover:text-text-primary lg:hidden transition-colors"
              aria-expanded={menuOpen}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-bg-elevated">
            <div className="px-5 py-3 space-y-1">
              {[
                { to: "/categorie/medaille-gravee", label: "Produits" },
                { to: "/le-concept", label: "Concept" },
                { to: "/notre-histoire", label: "Histoire" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
    </header>
  );
};
