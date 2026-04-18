import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const formatPrice = (priceCents: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceCents / 100)

export const ShoppingCartDrawer = () => {
  const [open, setOpen] = useState(false)
  const { cart, cartCount, cartTotal, removeFromCart, addToCart, decreaseQuantity } = useCart()

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative">
        {cartCount > 0 && (
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400">
            <span className="text-[10px] font-semibold text-gray-900">{cartCount}</span>
          </div>
        )}

        <svg
          className="h-6 w-6 text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
          />
        </svg>
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">
                        Mon panier
                      </DialogTitle>

                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <svg
                            className="h-6 w-6 text-gray-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
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
                        <div className="py-10 text-center text-sm text-gray-500">
                          Ton panier est vide.
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cart.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
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
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link to={`/produit/${item.slug}`} onClick={() => setOpen(false)}>
                                          {item.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">{formatPrice(item.price_cents)}</p>
                                    </div>
                                  </div>

                                  <div className="mt-2 flex items-end justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() => decreaseQuantity(item.id)}
                                        className="font-medium text-gray-500 hover:text-gray-700"
                                      >
                                        -
                                      </button>

                                      <p className="text-gray-500">Qty {item.quantity}</p>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          addToCart({
                                            id: item.id,
                                            slug: item.slug,
                                            name: item.name,
                                            price_cents: item.price_cents,
                                            image_url: item.image_url,
                                          })
                                        }
                                        className="font-medium text-gray-500 hover:text-gray-700"
                                      >
                                        +
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id)}
                                      className="font-medium text-yellow-150 hover:opacity-75"
                                    >
                                      Remove
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

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>{formatPrice(cartTotal)}</p>
                    </div>

                    <p className="mt-0.5 text-sm text-green-600">Frais d'envoi offerts !</p>

                    <div className="mt-6">
                      <a
                        href="#"
                        className="flex items-center justify-center rounded-md border border-transparent bg-yellow-150 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-yellow-150/80"
                      >
                        Valider mon panier
                      </a>
                    </div>

                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        ou{' '}
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="font-medium text-yellow-150 hover:opacity-75"
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
  )
}