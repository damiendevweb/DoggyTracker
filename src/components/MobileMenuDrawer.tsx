import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";

export const MobileMenuDrawer = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/categorie/medaille-gravee", label: "Produits" },
    { to: "/le-concept", label: "Concept" },
    { to: "/notre-histoire", label: "Histoire" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="lg:hidden"
        aria-expanded={open}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent, #fff)"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/60 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-bg-elevated border-l border-border">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-sm font-semibold text-text-primary">
                        Menu
                      </DialogTitle>

                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative -m-2 p-2 text-text-muted hover:text-text-secondary"
                        >
                          <svg
                            className="h-4 w-4"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <nav className="space-y-1">
                        {navLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className={`link-style block px-3 py-2.5 text-sm font-medium transition-colors rounded ${
                              location.pathname === link.to
                                ? "bg-accent text-bg"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
