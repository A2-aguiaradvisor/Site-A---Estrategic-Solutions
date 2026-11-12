import React, { createContext, useContext, useEffect, useState } from 'react'
import type { CartItem, Product, SubscriptionPeriod } from '@/types'

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addToCart: (product: Product, quantity?: number, subscriptionPeriod?: SubscriptionPeriod) => void
  removeFromCart: (productId: string, subscriptionPeriod?: SubscriptionPeriod) => void
  updateQuantity: (
    productId: string,
    quantity: number,
    subscriptionPeriod?: SubscriptionPeriod,
  ) => void
  setSubscriptionPeriod: (productId: string, period: SubscriptionPeriod | undefined) => void
  clearCart: () => void
  hasJustChanged: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'aguiar_advisory_cart_v2'

/** Cada combinação produto + periodicidade é uma linha própria no carrinho. */
function itemKey(productId: string, period?: SubscriptionPeriod): string {
  return period ? `${productId}__${period}` : productId
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [hasJustChanged, setHasJustChanged] = useState<boolean>(false)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage:', e)
    }
  }, [items])

  const triggerPop = () => {
    setHasJustChanged(true)
    setTimeout(() => setHasJustChanged(false), 300)
  }

  const addToCart = (
    product: Product,
    quantity: number = 1,
    subscriptionPeriod?: SubscriptionPeriod,
  ) => {
    if (quantity <= 0) return
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          itemKey(i.product.id, i.subscription_period) === itemKey(product.id, subscriptionPeriod),
      )
      if (existingIndex > -1) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        }
        return next
      }
      return [...prev, { product, quantity, subscription_period: subscriptionPeriod }]
    })
    triggerPop()
  }

  const removeFromCart = (productId: string, subscriptionPeriod?: SubscriptionPeriod) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          itemKey(i.product.id, i.subscription_period) !== itemKey(productId, subscriptionPeriod),
      ),
    )
    triggerPop()
  }

  const updateQuantity = (
    productId: string,
    quantity: number,
    subscriptionPeriod?: SubscriptionPeriod,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, subscriptionPeriod)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.product.id, i.subscription_period) === itemKey(productId, subscriptionPeriod)
          ? { ...i, quantity }
          : i,
      ),
    )
    triggerPop()
  }

  /** Converte um item comum em assinatura (ou remove a assinatura) preservando a linha. */
  const setSubscriptionPeriod = (productId: string, period: SubscriptionPeriod | undefined) => {
    setItems((prev) => {
      const sourceIndex = prev.findIndex((i) => i.product.id === productId)
      if (sourceIndex === -1) return prev

      const item = prev[sourceIndex]
      const withoutSource = prev.filter((_, idx) => idx !== sourceIndex)
      const targetIndex = withoutSource.findIndex(
        (i) => itemKey(i.product.id, i.subscription_period) === itemKey(productId, period),
      )

      if (targetIndex > -1) {
        const next = [...withoutSource]
        next[targetIndex] = {
          ...next[targetIndex],
          quantity: next[targetIndex].quantity + item.quantity,
        }
        return next
      }

      const converted: CartItem = { ...item, subscription_period: period }
      return [...withoutSource, converted]
    })
    triggerPop()
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        setSubscriptionPeriod,
        clearCart,
        hasJustChanged,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}
