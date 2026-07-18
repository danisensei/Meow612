import { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/components/Navbar/Navbar'
import CartSidebar from '@/components/CartSidebar/CartSidebar'
import ProductDetailsModal from '@/components/ProductDetailsModal/ProductDetailsModal'
import CheckoutModal from '@/components/CheckoutModal/CheckoutModal'
import Home from '@/pages/Home/Home'
import Shop from '@/pages/Shop/Shop'
import Admin from '@/pages/Admin/Admin'
import Toast from '@/components/Toast/Toast'
import '@/styles/index.css'

export const CartContext = createContext(null)
export function useCartCtx() { return useContext(CartContext) }

function App() {
  const cart = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, icon = '✅') => {
    setToast({ msg, icon })
    setTimeout(() => setToast(null), 2800)
  }

  const addToCart = (product) => {
    cart.addToCart(product)
    showToast(`${product.name} added to cart`, '🛒')
  }

  return (
    <CartContext.Provider value={{ 
      ...cart, 
      addToCart, 
      openCart: () => setCartOpen(true),
      openCheckout: () => { setCartOpen(false); setCheckoutOpen(true) },
      openProductDetails: (product) => setActiveProduct(product)
    }}>
      <Router>
        <div className="noise-overlay" />
        <Navbar cartCount={cart.cartCount} onCartOpen={() => setCartOpen(true)} />
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/meow-admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
        {toast && <Toast msg={toast.msg} icon={toast.icon} />}
        <ProductDetailsModal product={activeProduct} onClose={() => setActiveProduct(null)} />
        <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onSuccess={(msg) => showToast(msg, '📦')} />
      </Router>
    </CartContext.Provider>
  )
}

export default App
