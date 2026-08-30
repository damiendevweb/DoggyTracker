import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatPrice = (priceCents: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);

export const ShoppingCartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { cart, cartCount, cartTotal, removeFromCart } = useCart();

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative">
        {cartCount > 0 && (
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
            <span className="text-[10px] font-semibold text-bg">
              {cartCount}
            </span>
          </div>
        )}

        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="shopping-cart__icon"
        >
          <path
            d="M4.67151 8.6279C4.85917 7.12661 6.13538 6 7.64835 6H16.3517C17.8646 6 19.1408 7.12661 19.3285 8.6279L20.5785 18.6279C20.8023 20.4185 19.4061 22 17.6017 22H6.39835C4.59385 22 3.19769 20.4185 3.42151 18.6279L4.67151 8.6279Z"
            stroke="var(--color-accent, #fff)"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="var(--svg-fill-color, transparent)"
          ></path>
          <path
            d="M16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6"
            stroke="var(--color-accent, #fff)"
            strokeWidth="1.3"
            strokeLinejoin="round"
          ></path>
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
                        Mon panier
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
                      {cart.length === 0 ? (
                        <div className="py-10 text-center text-xs text-text-muted">
                          Ton panier est vide.
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-4 divide-y divide-border"
                          >
                            {cart.map((item) => (
                              <li key={item.cartItemId} className="flex py-4">
                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded border border-border bg-bg-surface">
                                  {item.image_url ? (
                                    <img
                                      alt={item.name}
                                      src={item.image_url}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : null}
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-sm font-medium text-text-primary">
                                      <h3>
                                        <Link
                                          to={`/produit/${item.slug}`}
                                          onClick={() => setOpen(false)}
                                        >
                                          {item.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4 text-xs">
                                        {formatPrice(item.price_cents)}
                                      </p>
                                    </div>
                                    <div className="mt-1">
                                      <p className="text-[10px] text-text-muted">
                                        Personnalisation
                                      </p>
                                      <ul className="text-xs text-text-secondary">
                                        <li>{item.customization?.petName}</li>
                                        <li>{item.customization?.phone1}</li>
                                        {item.customization?.phone2 && (
                                          <li>{item.customization?.phone2}</li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="mt-2 flex items-end justify-between text-xs">
                                    <p className="text-text-muted">Qté 1</p>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeFromCart(item.cartItemId)
                                      }
                                      className="font-medium text-error hover:text-error/80"
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-sm font-medium text-text-primary">
                      <p>Total</p>
                      <p className="">{formatPrice(cartTotal)}</p>
                    </div>

                    <p className="mt-0.5 text-xs text-success">
                      Frais d'envoi offerts !
                    </p>

                    <div className="mt-6">
                      <a
                        href="#"
                        className="flex items-center justify-center rounded border border-transparent bg-accent px-6 py-3 text-sm font-medium text-bg hover:bg-accent-hover"
                      >
                        Valider mon panier
                      </a>
                    </div>

                    <div className="mt-6 flex justify-center text-center text-xs text-text-muted">
                      <p>
                        ou{" "}
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="font-medium text-accent hover:text-accent-hover"
                        >
                          continuer mes achats
                        </button>
                      </p>
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
