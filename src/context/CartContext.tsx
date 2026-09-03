import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartCustomization = {
  petName: string
  phone1: string
  phone2: string
  font: string
}

export type CartItem = {
  cartItemId: string
  id: string
  slug: string
  name: string
  price_cents: number
  image_url: string | null
  customization?: CartCustomization | null
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void
  removeFromCart: (cartItemId: string) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'ou-est-medor-cart'

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Erreur lecture panier localStorage', error)
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = crypto.randomUUID()
    setCart((prev) => [...prev, { ...item, cartItemId }])
  }

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
  }

  const clearCart = () => setCart([])

  const cartCount = cart.length

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price_cents, 0),
    [cart]
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}