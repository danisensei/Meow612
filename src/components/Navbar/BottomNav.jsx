import { Link, useLocation } from 'react-router-dom'
import { useCartCtx } from '@/App'
import './BottomNav.css'

export default function BottomNav({ onCartOpen, cartCount }) {
  const location = useLocation()
  const path = location.pathname
  const cartCtx = useCartCtx()
  const count = cartCount ?? cartCtx?.cartCount ?? 0

  return (
    <nav className="bottom-nav">
      <Link 
        to="/" 
        className={`bottom-nav__item ${path === '/' ? 'bottom-nav__item--active' : ''}`}
      >
        <span 
          className="material-symbols-outlined bottom-nav__icon" 
          style={{ fontVariationSettings: path === '/' ? "'FILL' 1" : "'FILL' 0" }}
        >
          bolt
        </span>
        <span>Home</span>
      </Link>

      <Link 
        to="/shop" 
        className={`bottom-nav__item ${path === '/shop' ? 'bottom-nav__item--active' : ''}`}
      >
        <span 
          className="material-symbols-outlined bottom-nav__icon"
          style={{ fontVariationSettings: path === '/shop' ? "'FILL' 1" : "'FILL' 0" }}
        >
          storefront
        </span>
        <span>Shop</span>
      </Link>

      <a 
        href="/#community" 
        className="bottom-nav__item"
      >
        <span className="material-symbols-outlined bottom-nav__icon">forum</span>
        <span>Social</span>
      </a>

      <button 
        onClick={onCartOpen || cartCtx?.openCart} 
        className="bottom-nav__item"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}
      >
        <span className="material-symbols-outlined bottom-nav__icon">shopping_cart</span>
        <span>Cart {count > 0 ? `(${count})` : ''}</span>
      </button>
    </nav>
  )
}
