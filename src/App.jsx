import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/components/Navbar/Navbar'
import CartSidebar from '@/components/CartSidebar/CartSidebar'
import ProductDetailsModal from '@/components/ProductDetailsModal/ProductDetailsModal'
import ReviewModal from '@/components/ReviewModal/ReviewModal'
import CheckoutModal from '@/components/CheckoutModal/CheckoutModal'
import Home from '@/pages/Home/Home'
import Shop from '@/pages/Shop/Shop'
import Admin from '@/pages/Admin/Admin'
import Toast from '@/components/Toast/Toast'
import '@/styles/index.css'

export const CartContext = createContext(null)
export function useCartCtx() { return useContext(CartContext) }

// Secret keyboard shortcut helper: Ctrl+Shift+A or Cmd+Shift+A to jump to Admin
function SecretAdminShortcut() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        navigate('/meow-admin')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return null
}

function App() {
  const cart = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState(null)
  const [reviewProduct, setReviewProduct] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, icon = '✅') => {
    setToast({ msg, icon })
    setTimeout(() => setToast(null), 2800)
  }

  const addToCart = (product) => {
    cart.addToCart(product)
    showToast(`${product.name} added to cart`, '🛒')
  }

  const openReview = (product) => {
    setReviewProduct(product)
  }

  return (
    <CartContext.Provider value={{ 
      ...cart, 
      addToCart, 
      openCart: () => setCartOpen(true),
      openCheckout: () => { setCartOpen(false); setCheckoutOpen(true) },
      openProductDetails: (product) => setActiveProduct(product),
      openReview,
    }}>
      <Router>
        <SecretAdminShortcut />
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
        <ProductDetailsModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onWriteReview={(product) => {
            setActiveProduct(null)
            openReview(product)
          }}
        />
        <ReviewModal
          product={reviewProduct}
          onClose={() => setReviewProduct(null)}
          onSuccess={() => showToast('Review submitted! 🙏', '⭐')}
        />
        <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onSuccess={(msg) => showToast(msg, '📦')} />
      </Router>
    </CartContext.Provider>
  )
}

export default App
