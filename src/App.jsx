import { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Toast from './components/Toast'
import './index.css'

export const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}

function App() {
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, icon = '✅') => {
    setToast({ msg, icon })
    setTimeout(() => setToast(null), 2800)
  }

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
    showToast(`${product.name} added to cart`, '🛒')
  }

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, cartCount, cartTotal }}>
      <Router>
        <div className="noise-overlay" />
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
        </Routes>
        {toast && <Toast msg={toast.msg} icon={toast.icon} />}
      </Router>
    </CartContext.Provider>
  )
}

export default App
