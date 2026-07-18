import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard/ProductCard'
import './Home.css'

const testimonials = [
  {
    name: 'Marcus T.',
    handle: '@marcus_trains',
    text: 'These parallets completely changed my training. The grip, the stability — pure perfection.',
    rating: 5,
    avatar: 'MT',
  },
  {
    name: 'Sofia K.',
    handle: '@sofiastrength',
    text: 'Finally landed my first planche on these. The height is spot on and they feel incredibly sturdy.',
    rating: 5,
    avatar: 'SK',
  },
  {
    name: 'James R.',
    handle: '@jamesfit',
    text: "I've tried many brands. Meow612 is in a league of its own. The craftsmanship is unreal.",
    rating: 5,
    avatar: 'JR',
  },
]

const marqueeItems = ['CALISTHENICS', 'PARALLETS', 'APPAREL', 'ACCESSORIES', 'BUILT DIFFERENT', 'ATHLETE GRADE']

export default function Home() {
  const { products, loading, error } = useProducts()

  return (
    <main className="home">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg-glow" />
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">Premium Calisthenics Equipment</p>
            <h1 className="hero__title">
              BUILT<br />
              <span>FOR THE</span><br />
              ELITE
            </h1>
            <p className="hero__sub">
              Engineered for athletes who refuse to settle. Every product crafted with precision and purpose.
            </p>
            <div className="hero__ctas">
              <Link to="/shop" className="btn-primary" id="hero-shop-btn">Shop Gear</Link>
              <a href="#community" className="btn-outline">See Reviews</a>
            </div>
          </div>

          <div className="hero__card-wrap">
            <div className="hero__card">
              <div className="hero__card-inner">
                <div className="hero__card-tag">PERFORMANCE GEAR</div>
                <div className="hero__card-emoji">🏋️</div>
                <div className="hero__card-parallette">
                  <div className="par-base" />
                  <div className="par-post par-post--l" />
                  <div className="par-post par-post--r" />
                  <div className="par-bar" />
                </div>
                <div className="hero__card-badge">
                  <span>★ 4.9</span>
                  <span>10K+ Athletes</span>
                </div>
              </div>
            </div>
            <div className="hero__floating-pill hero__floating-pill--1">
              <span>⚡</span> Pro Grade
            </div>
            <div className="hero__floating-pill hero__floating-pill--2">
              <span>🌍</span> Ships Worldwide
            </div>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE TICKER ────────────────────────── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── GEAR SECTION ──────────────────────────── */}
      <section className="featured-section" id="featured">
        <div className="container">
          <div className="featured-header">
            <div>
              <p className="section-label">Collection</p>
              <h2 className="section-title">Our <span>Gear</span></h2>
            </div>
            <Link to="/shop" className="btn-outline" id="view-all-btn">View All</Link>
          </div>

          {loading && (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          )}
          {error && <p className="db-error">⚠️ Could not load products.</p>}
          {!loading && !error && products.length === 0 && (
            <div className="gear-empty">
              <div className="gear-empty__icon">🔧</div>
              <h3>New drops coming soon</h3>
              <p>We're restocking. Check back shortly for the latest gear.</p>
            </div>
          )}
          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section className="testimonials-section" id="community">
        <div className="container">
          <div className="testimonials-header">
            <div>
              <p className="section-label">Community</p>
              <h2 className="section-title">What They <span>Say</span></h2>
            </div>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
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
            <p className="footer__logo">MEOW612</p>
            <p className="footer__copy">© 2025 Meow612. All rights reserved.</p>
          </div>
          <div className="footer__socials">
            <a href="#" className="social-btn" aria-label="Instagram">
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
