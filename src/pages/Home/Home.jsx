import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard/ProductCard'
import './Home.css'

import './Home.css'
const stats = [
  { value: '10K+', label: 'Happy Athletes' },
  { value: '5★', label: 'Average Rating' },
  { value: '50+', label: 'Countries Shipped' },
  { value: '3yr', label: 'Warranty' },
]

const features = [
  {
    icon: '🏗️',
    title: 'Built to Last',
    desc: 'Every piece of gear is engineered for years of intense training. No compromises.',
  },
  {
    icon: '🎯',
    title: 'Athlete-Designed',
    desc: 'Our products are designed by calisthenics athletes who know exactly what you need.',
  },
  {
    icon: '🚀',
    title: 'Fast Shipping',
    desc: 'Get your gear fast with free worldwide shipping on all orders over $50.',
  },
  {
    icon: '🔄',
    title: '30-Day Returns',
    desc: 'Not satisfied? Return it hassle-free within 30 days, no questions asked.',
  },
]

const testimonials = [
  {
    name: 'Marcus T.',
    handle: '@marcus_trains',
    text: 'These parallets completely changed my training. The grip, the stability — pure perfection. Worth every penny.',
    rating: 5,
    avatar: '💪',
  },
  {
    name: 'Sofia K.',
    handle: '@sofiastrength',
    text: 'Finally landed my first planche on these. The height is spot on and they feel incredibly sturdy.',
    rating: 5,
    avatar: '🤸',
  },
  {
    name: 'James R.',
    handle: '@jamesfit',
    text: "I've tried many brands. Meow612 is in a league of its own. The craftsmanship is unreal.",
    rating: 5,
    avatar: '🏋️',
  },
]

export default function Home() {
  const { products, loading, error } = useProducts()

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="glow-orb hero__orb-1" />
        <div className="glow-orb hero__orb-2" />
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="section-label">🔥 Free shipping on orders $50+</div>
            <h1 className="hero__title">
              Train Like <br />
              <span>A Beast.</span><br />
              Look Like One Too.
            </h1>
            <p className="hero__subtitle">
              Premium calisthenics equipment and apparel for athletes who refuse to settle. Built by athletes, for athletes.
            </p>
            <div className="hero__ctas">
              <a href="#featured" className="btn-primary" id="hero-shop-btn">
                View Gear ↓
              </a>
            </div>

            <div className="hero__stats">
              {stats.map((s, i) => (
                <div key={i} className="hero__stat">
                  <span className="hero__stat-value">{s.value}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__visual-ring hero__visual-ring--outer" />
            <div className="hero__visual-ring hero__visual-ring--inner" />
            <div className="hero__visual-card">
              <div className="hero__visual-emoji">🏋️</div>
              <div className="hero__visual-parallette">
                <div className="par-base" />
                <div className="par-post par-post--l" />
                <div className="par-post par-post--r" />
                <div className="par-bar" />
              </div>
            </div>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section" id="featured">
        <div className="container">
          <div className="featured-header">
            <div>
              <div className="section-label">🏆 Full Collection</div>
              <h2 className="section-title">Our <span>Gear</span></h2>
              <p className="section-subtitle">Premium equipment for athletes who refuse to settle. Browse our complete collection.</p>
            </div>
            <a href="#featured" className="btn-outline" id="view-all-btn">View All ↓</a>
          </div>
          {loading && (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          )}
          {error && (
            <p className="db-error">⚠️ Could not load products. Check your Supabase credentials.</p>
          )}
          {!loading && !error && (
            <div className="products-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="glow-orb cta-banner__orb" />
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__tag">⚡ Limited Time</div>
            <h2 className="cta-banner__title">Level Up Your <span>Training</span></h2>
            <p className="cta-banner__sub">Get 15% off your first order with code <strong>BEAST15</strong></p>
            <a href="#featured" className="btn-primary" id="cta-shop-btn">Browse the Collection</a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="community">
        <div className="container">
          <div className="section-header-center">
            <div className="section-label">💬 Real Athletes</div>
            <h2 className="section-title">What They <span>Say</span></h2>
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

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__brand">
              <p className="footer__logo">⚡ MEOW612</p>
              <p className="footer__tagline">Train hard. Stay consistent. Level up.</p>
            </div>
            <div className="footer__links-group">
              <p className="footer__group-title">Support</p>
              <a href="#">FAQ</a>
              <a href="#">Returns</a>
              <a href="#">Shipping</a>
            </div>
          </div>
          <div className="footer__bottom">
            <p>© 2025 Meow612. All rights reserved.</p>
            <div className="footer__socials">
              <a href="#" className="social-btn">📸</a>
              <a href="#" className="social-btn">🎵</a>
              <a href="#" className="social-btn">🐦</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
