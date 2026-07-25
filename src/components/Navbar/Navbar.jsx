import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav'
import './Navbar.css'

export default function Navbar({ cartCount, onCartOpen }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setDrawerOpen(false)
  }, [location])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  // Secret Triple-Click on Logo triggers Admin Navigation
  const handleLogoClick = (e) => {
    setLogoClickCount(prev => {
      const next = prev + 1
      if (next >= 3) {
        e.preventDefault()
        navigate('/meow-admin')
        return 0
      }
      return next
    })

    setTimeout(() => {
      setLogoClickCount(0)
    }, 1500)
  }

  return (
    <>
      {/* Top Header Bar */}
      <header className="top-header">
        <Link to="/" className="top-header__brand" onClick={handleLogoClick}>
          <span className="material-symbols-outlined top-header__logo-icon">bolt</span>
          <span className="top-header__logo-text">
            MEOW<span>612</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav>
          <ul className="top-header__desktop-nav">
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `top-header__nav-link ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/shop" 
                className={({ isActive }) => `top-header__nav-link ${isActive ? 'active' : ''}`}
              >
                Shop
              </NavLink>
            </li>
            <li>
              <a href="/#community" className="top-header__nav-link">
                Community
              </a>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="top-header__actions">
          <button 
            onClick={onCartOpen}
            className="top-header__cart-btn"
            aria-label="Shopping Cart"
            id="cart-btn"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="top-header__cart-badge">{cartCount}</span>
            )}
          </button>
          
          <button 
            onClick={() => setDrawerOpen(true)}
            className="top-header__menu-btn"
            id="menu-toggle"
            aria-label="Open menu drawer"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`drawer-overlay ${drawerOpen ? 'drawer-overlay--open' : ''}`} 
        id="drawer-overlay"
        onClick={() => setDrawerOpen(false)}
      />
      
      <aside 
        className={`nav-drawer ${drawerOpen ? 'nav-drawer--open' : ''}`}
        id="nav-drawer"
      >
        <div className="nav-drawer__header">
          <span className="nav-drawer__title">MENU</span>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="nav-drawer__close" 
            id="close-drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav>
          <ul className="nav-drawer__links">
            <li>
              <Link 
                to="/" 
                className="nav-drawer__link active"
                onClick={() => setDrawerOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/shop" 
                className="nav-drawer__link"
                onClick={() => setDrawerOpen(false)}
              >
                Shop
              </Link>
            </li>
            <li>
              <a 
                href="/#community" 
                className="nav-drawer__link"
                onClick={() => setDrawerOpen(false)}
              >
                Community
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav onCartOpen={onCartOpen} cartCount={cartCount} />
    </>
  )
}
