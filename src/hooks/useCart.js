import { useState } from 'react'

const CART_KEY = 'meow612_cart'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}
function saveLocal(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function useCart() {
  const [cartItems, setCartItems] = useState(loadLocal)

  const update = (updater) => {
    setCartItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveLocal(next)
      return next
    })
  }

  const addToCart = (product) => {
    update(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => update(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return }
    update(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => update([])

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  return { cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }
}
