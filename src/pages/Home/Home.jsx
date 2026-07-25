import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useCartCtx } from '@/App'
import ProductCard from '@/components/ProductCard/ProductCard'
import './Home.css'

const featuredDaniyalProduct = {
  id: 'daniyal-parallels-featured',
  name: 'Daniyal Parallels',
  category: 'parallets',
  price: 123.00,
  originalPrice: 149.99,
  description: 'Professional Wood Finish. Engineered for maximum stability, palm comfort, and elite planche training.',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6r85watuZn0mjdTjtu8gV6sJYsRiXDmnOiTRj9tsavciJaF27w-i0YOZIYi2Cm33L6daQg8OethgHelr1qfs78gT_2DbNPA-KuqUhUEc74C7lD-eqgITWdjA2YKH_B8AWfnJksaExpDpE_IBqVJfvAvOEJ_N6QUtXXK2v55TTX_o4-wdqEgIROt-27OxBKQn0ajTPrQArfI7ikprgmV4X1OpDTf6yyk6hUdc16TjP0_eynnKUXNZ7IjiaN8mbulXvA8PqyaitjZg',
  badge: 'ELITE GRADE',
  rating: 5.0,
  reviews: 48,
  emoji: '🪵',
  color: '#1c1b1b'
}

const testimonials = [
  {
    name: 'Marcus T.',
    handle: '@marcus_trains',
    text: '"These parallels completely changed my training. The grip, the stability — pure perfection. It\'s the only gear I trust for my planche sessions."',
    avatar: 'MT',
  },
  {
    name: 'Sofia K.',
    handle: '@sofiastrength',
    text: '"Finally landed my first planche on these. The height is spot on and they feel incredibly sturdy even on uneven surfaces."',
    avatar: 'SK',
  },
  {
    name: 'James R.',
    handle: '@jamesfit',
    text: '"I\'ve tried many brands. Meow612 is in a league of its own. The craftsmanship and durability are unmatched."',
    avatar: 'JR',
  },
]

export default function Home() {
  const { products, loading, error } = useProducts()
  const { addToCart, openProductDetails } = useCartCtx()
  const [featuredAdded, setFeaturedAdded] = useState(false)

  const handleAddFeatured = (e) => {
    e.stopPropagation()
    addToCart(featuredDaniyalProduct)
    setFeaturedAdded(true)
    setTimeout(() => setFeaturedAdded(false), 1200)
  }

  return (
    <main className="home-page">
      
      {/* ── HERO SECTION ──────────────────────────── */}
      <section className="hero">
        <div className="hero__bg-glow" />
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">Premium Calisthenics Equipment</p>
            <h1 className="hero__title">
              BUILT
              <span>FOR THE</span>
              <strong className="hero__title-highlight">ELITE</strong>
            </h1>
            <p className="hero__sub">
              Engineered for athletes who refuse to settle. Every product crafted with precision and purpose.
            </p>
            <div className="hero__ctas">
              <Link to="/shop" className="btn-primary" id="hero-shop-gear-btn">
                Shop Gear →
              </Link>
              <a href="#community" className="btn-outline">
                See Reviews
              </a>
            </div>
          </div>

          <div className="hero__card-wrap">
            <div 
              className="hero__card" 
              onClick={() => openProductDetails(featuredDaniyalProduct)}
            >
              <div className="hero__card-inner">
                <span className="hero__card-tag">ELITE GRADE</span>
                <div className="hero__card-parallette">
                  <div className="par-base" />
                  <div className="par-post par-post--l" />
                  <div className="par-post par-post--r" />
                  <div className="par-bar" />
                </div>
                <span className="hero__card-emoji">🪵</span>
                <div className="hero__card-badge">
                  <span>⚡ Planche Ready</span>
                  <span>🔥 Beech Wood</span>
                </div>
              </div>
            </div>
            <div className="hero__floating-pill hero__floating-pill--1">
              <span>🏆 Tested by Pros</span>
            </div>
            <div className="hero__floating-pill hero__floating-pill--2">
              <span>🚚 Free Shipping</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <span>SCROLL</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── MARQUEE TICKER ────────────────────────── */}
      <section className="marquee-strip">
        <div className="marquee-track">
          <div className="marquee-content">
            <span className="marquee-item">CALISTHENICS <span className="marquee-dot">✚</span></span>
            <span className="marquee-item">PARALLETS <span className="marquee-dot">✚</span></span>
            <span className="marquee-item">APPAREL <span className="marquee-dot">✚</span></span>
            <span className="marquee-item">ACCESSORIES <span className="marquee-dot">✚</span></span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span className="marquee-item">CALISTHENICS <span className="marquee-dot">✚</span></span>
            <span className="marquee-item">PARALLETS <span className="marquee-dot">✚</span></span>
            <span className="marquee-item">APPAREL <span className="marquee-dot">✚</span></span>
            <span className="marquee-item">ACCESSORIES <span className="marquee-dot">✚</span></span>
          </div>
        </div>
      </section>

      {/* ── COLLECTION SECTION ────────────────────── */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div>
              <p className="section-label">Collection</p>
              <h2 className="section-title">OUR <span>GEAR</span></h2>
            </div>
            <Link to="/shop" className="btn-outline">
              View All Products →
            </Link>
          </div>

          {/* Featured Daniyal Parallels Banner */}
          <div 
            className="featured-hero-banner"
            onClick={() => openProductDetails(featuredDaniyalProduct)}
          >
            <div className="featured-hero-banner__img-wrap">
              <img 
                src={featuredDaniyalProduct.imageUrl} 
                alt={featuredDaniyalProduct.name}
                className="featured-hero-banner__img"
              />
              <span className="featured-hero-banner__badge">ELITE GRADE</span>
            </div>
            <div className="featured-hero-banner__body">
              <span className="featured-hero-banner__category">PARALLETS</span>
              <h3 className="featured-hero-banner__title">Daniyal Parallels</h3>
              <p className="featured-hero-banner__desc">
                Professional Wood Finish. Engineered for maximum stability, palm comfort, and elite planche training.
              </p>
              <div className="featured-hero-banner__footer">
                <div className="featured-hero-banner__price">
                  <span className="banner-price-current">${featuredDaniyalProduct.price.toFixed(2)}</span>
                  <span className="banner-price-original">${featuredDaniyalProduct.originalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleAddFeatured}
                  className={`btn-primary ${featuredAdded ? 'btn-primary--added' : ''}`}
                >
                  {featuredAdded ? '✓ Added to Cart' : 'Add to Cart 🛒'}
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading && (
            <div className="products-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="products-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── COMMUNITY SECTION ──────────────────────── */}
      <section className="testimonials-section" id="community">
        <div className="container">
          <div className="testimonials-header">
            <p className="section-label">Community</p>
            <h2 className="section-title">WHAT THEY <span>SAY</span></h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-stars">★ ★ ★ ★ ★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-handle">{t.handle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <span className="footer__logo">MEOW<span>612</span></span>
            <Link to="/meow-admin" style={{ color: 'inherit', textDecoration: 'none', cursor: 'default' }} title="Meow Portal">
              <p className="footer__copy">© 2026 MEOW612. ALL RIGHTS RESERVED.</p>
            </Link>
          </div>
          <div className="footer__socials">
            <a href="https://www.instagram.com/hassam_612/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" className="social-btn" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg>
            </a>
            <a href="#" className="social-btn" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
