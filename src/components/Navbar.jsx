import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          <span className="navbar__logo-text">MEOW<span>612</span></span>
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Shop</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        </ul>

        <div className="navbar__actions">
          <button className="navbar__cart-btn" onClick={onCartOpen} id="cart-btn">
            <span className="navbar__cart-icon">🛒</span>
            {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
          </button>
          <button className="navbar__hamburger" onClick={() => setMenuOpen(v => !v)} id="menu-btn" aria-label="Toggle menu">
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
          </button>
        </div>
      </div>
    </nav>
  )
}
