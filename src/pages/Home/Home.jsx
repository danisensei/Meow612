import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useReviews } from '@/hooks/useReviews'
import { useCartCtx } from '@/App'
import ProductCard from '@/components/ProductCard/ProductCard'
import './Home.css'

function StarDisplay({ rating }) {
  return (
    <span className="comm-stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ opacity: s <= rating ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  )
}

function CommunityReviewCard({ review, productName }) {
  const [lightbox, setLightbox] = React.useState(null)
  const initials = (review.reviewer_name || 'A')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="comm-card">
      <div className="comm-card__top">
        <div className="comm-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="comm-reviewer">{review.reviewer_name || 'Anonymous'}</p>
          {productName && <p className="comm-product-name">{productName}</p>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <StarDisplay rating={review.rating} />
          <p className="comm-date">
            {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {review.body && <p className="comm-body">{review.body}</p>}

      {review.image_urls?.length > 0 && (
        <div className="comm-images">
          {review.image_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Review photo ${i + 1}`}
              className="comm-img"
              onClick={() => setLightbox(url)}
            />
          ))}
        </div>
      )}

      {lightbox && (
        <div className="comm-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Review photo enlarged" />
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { products, loading } = useProducts()
  const { reviews, loading: reviewsLoading } = useReviews()   // all reviews
  const { openReview, openProductDetails } = useCartCtx()

  // Build a map of productId → productName for the community cards
  const productMap = React.useMemo(
    () => Object.fromEntries(products.map(p => [p.id, p])),
    [products]
  )

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
            <div className="hero__card">
              <div className="hero__card-inner">
                <span className="hero__card-tag">ELITE GRADE</span>
                <div className="hero__card-parallette">
                  <div className="par-base" />
                  <div className="par-post par-post--l" />
                  <div className="par-post par-post--r" />
                  <div className="par-bar" />
                </div>
                <span className="hero__card-emoji">🤸</span>
                <div className="hero__card-badge">
                  <span>⚡ Planche Ready</span>
                  <span>🔥 Beech Wood</span>
                </div>
              </div>
            </div>
            <div className="hero__floating-pill hero__floating-pill--1">
              <span>🏆 Tested by Pros</span>
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

      {/* ── COMMUNITY / REVIEWS SECTION ───────────── */}
      <section className="community-section" id="community">
        <div className="container">
          <div className="community-header">
            <div>
              <p className="section-label">Community</p>
              <h2 className="section-title">WHAT ATHLETES <span>SAY</span></h2>
              <p className="community-sub">
                Real reviews from real athletes. See what the MEOW612 community is training with.
              </p>
            </div>
          </div>

          {reviewsLoading && (
            <div className="community-loading">
              <div className="comm-skeleton" />
              <div className="comm-skeleton" />
              <div className="comm-skeleton" />
            </div>
          )}

          {!reviewsLoading && reviews.length === 0 && (
            <div className="community-empty">
              <span className="community-empty__icon">💬</span>
              <p className="community-empty__title">No reviews yet</p>
              <p className="community-empty__sub">
                Be the first to review a product and help the community!
              </p>
              {products.length > 0 && (
                <button
                  className="btn-primary community-empty__cta"
                  onClick={() => openReview(products[0])}
                  id="community-write-review-btn"
                >
                  Write the First Review →
                </button>
              )}
            </div>
          )}

          {!reviewsLoading && reviews.length > 0 && (
            <>
              <div className="community-grid">
                {reviews.map(r => (
                  <CommunityReviewCard
                    key={r.id}
                    review={r}
                    productName={productMap[r.product_id]?.name}
                  />
                ))}
              </div>

              {/* CTA row */}
              <div className="community-cta-row">
                {products.length > 0 && (
                  <button
                    className="btn-outline community-write-btn"
                    onClick={() => {
                      // Open product details for the first product — user can pick
                      openProductDetails(products[0])
                    }}
                    id="community-review-cta-btn"
                  >
                    ✍ Write a Review
                  </button>
                )}
              </div>
            </>
          )}
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
