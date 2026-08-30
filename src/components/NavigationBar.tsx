import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ShoppingCartDrawer } from "./ShoppingCartDrawer";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { useState, useEffect } from "react";

export const NavigationBar = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky w-full top-0 z-50 p-4">
      <div
        className={`
          flex items-center justify-between 
          max-w-7xl mx-auto 
          rounded-lg px-5 h-14 
          transition-all duration-400
          hover:bg-white hover:shadow-[0_4px_8px_0px_rgb(0_0_0/15%)]
          ${
            scrolled
              ? "bg-white shadow-[0_4px_8px_0px_rgb(0_0_0/15%)] header--is-activate"
              : "bg-transparent"
          }
        `}
      >
        <MobileMenuDrawer />
        <div className="flex items-center justify-between lg-gap-4">
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
                    className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
            <Link
              to={user ? '/profile' : '/login'}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="account__icon"
              >
                <circle
                  cx="12"
                  cy="6"
                  r="4"
                  stroke="var(--color-accent, #fff)"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                  fill="var(--svg-fill-color, transparent)"
                ></circle>
                <path
                  d="M16.8377 22H7.16228C5.1146 22 3.6687 19.9939 4.31623 18.0513L5.31623 15.0513C5.72457 13.8263 6.87099 13 8.16228 13H15.8377C17.129 13 18.2754 13.8263 18.6838 15.0513L19.6838 18.0513C20.3313 19.9939 18.8854 22 16.8377 22Z"
                  stroke="var(--color-accent, #fff)"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                  fill="var(--svg-fill-color, transparent)"
                ></path>
              </svg>
            </Link>

          <ShoppingCartDrawer />
        </div>
      </div>
    </header>
  );
};
