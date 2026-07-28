import { useState, useEffect, useMemo } from 'react'
import { useCartCtx } from '@/App'
import { useReviews } from '@/hooks/useReviews'
import './ProductDetailsModal.css'

function StarDisplay({ rating }) {
  return (
    <span className="rev-stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ opacity: s <= rating ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  )
}

function ReviewCard({ review }) {
  const [lightbox, setLightbox] = useState(null)
  const initials = (review.reviewer_name || 'A')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="p-rev-card">
      <div className="p-rev-card__top">
        <div className="p-rev-avatar">{initials}</div>
        <div>
          <p className="p-rev-name">{review.reviewer_name || 'Anonymous'}</p>
          <StarDisplay rating={review.rating} />
        </div>
        <span className="p-rev-date">
          {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
      {review.body && <p className="p-rev-body">{review.body}</p>}
      {review.image_urls?.length > 0 && (
        <div className="p-rev-images">
          {review.image_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Review photo ${i + 1}`}
              className="p-rev-img"
              onClick={() => setLightbox(url)}
            />
          ))}
        </div>
      )}
      {lightbox && (
        <div className="p-rev-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Review photo enlarged" />
        </div>
      )}
    </div>
  )
}

export default function ProductDetailsModal({ product, onClose, onWriteReview }) {
  const { addToCart } = useCartCtx()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [mainLightbox, setMainLightbox] = useState(false)
  const { reviews, loading: reviewsLoading } = useReviews(product?.id)

  const images = useMemo(() => {
    if (!product) return []
    if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls
    }
    return product.imageUrl ? [product.imageUrl] : []
  }, [product])

  useEffect(() => {
    setActiveImgIdx(0)
  }, [product?.id])

  if (!product) return null

  const isOutOfStock = Boolean(product?.isOutOfStock || product?.is_out_of_stock || (product?.stock !== null && product?.stock !== undefined && Number(product.stock) <= 0))

  const handlePrevImg = (e) => {
    e?.stopPropagation()
    setActiveImgIdx(prev => (prev - 1 + images.length) % images.length)
  }

  const handleNextImg = (e) => {
    e?.stopPropagation()
    setActiveImgIdx(prev => (prev + 1) % images.length)
  }

  const handleAdd = () => {
    if (isOutOfStock) return
    for (let i = 0; i < qty; i++) {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 1200)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const currentImage = images[activeImgIdx] || product.imageUrl

  return (
    <>
      <div className="p-details-overlay" onClick={onClose} />
      <div className="p-details-modal">
        <button className="p-details-close" onClick={onClose}>✕</button>

        <div className="p-details-grid">
          {/* Image panel / Gallery */}
          <div className="p-details-gallery">
            <div
              className="p-details-img-panel"
              style={{ background: currentImage ? '#0a0a0a' : product.color }}
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${product.name} photo ${activeImgIdx + 1}`}
                  className="p-details-photo"
                  onClick={() => setMainLightbox(true)}
                  title="Click to view full size"
                />
              ) : (
                <span className="p-details-emoji">{product.emoji}</span>
              )}
              <div className="p-details-glow" />

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="p-gallery-arrow p-gallery-arrow--prev"
                    onClick={handlePrevImg}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="p-gallery-arrow p-gallery-arrow--next"
                    onClick={handleNextImg}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                  <span className="p-gallery-counter">
                    {activeImgIdx + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="p-details-thumbnails">
                {images.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`p-thumb-btn ${i === activeImgIdx ? 'active' : ''}`}
                    onClick={() => setActiveImgIdx(i)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Lightbox for Product Photo */}
          {mainLightbox && currentImage && (
            <div className="p-rev-lightbox" onClick={() => setMainLightbox(false)}>
              <img src={currentImage} alt={`${product.name} enlarged`} />
            </div>
          )}

          {/* Info panel */}
          <div className="p-details-info">
            {isOutOfStock && (
              <span style={{ display: 'inline-block', background: '#dc2626', color: '#ffffff', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, width: 'fit-content' }}>
                🚫 Out of Stock
              </span>
            )}
            <p className="p-details-cat">{product.category}</p>
            <h2 className="p-details-title">{product.name}</h2>

            <div className="p-details-price">
              <span className="current">PKR {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original">PKR {product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="p-details-desc">{product.description || 'No description provided.'}</p>


            {/* Actions */}
            <div className="p-details-actions">
              {!isOutOfStock && (
                <div className="p-details-qty">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="qty-btn">−</button>
                  <span className="qty-val">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="qty-btn">+</button>
                </div>
              )}

              <button
                className={`btn-primary p-details-add-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={added || isOutOfStock}
                style={isOutOfStock ? { background: '#1c1c1c', color: '#777', borderColor: '#333', cursor: 'not-allowed', width: '100%', justifyContent: 'center' } : {}}
              >
                {isOutOfStock ? 'Currently Out of Stock' : (added ? '✓ Added' : `Add to Cart • PKR ${(product.price * qty).toFixed(2)}`)}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-details-reviews">
          <div className="p-details-reviews__header">
            <div>
              <h3 className="p-details-reviews__title">Customer Reviews</h3>
              {avgRating && (
                <p className="p-details-reviews__avg">
                  <StarDisplay rating={Math.round(Number(avgRating))} />
                  <span>{avgRating} out of 5 · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                </p>
              )}
            </div>
            <button
              className="p-details-review-btn p-details-review-btn--sm"
              onClick={() => onWriteReview(product)}
              id={`write-review-${product.id}`}
            >
              ✍ Write a Review
            </button>
          </div>

          {reviewsLoading && (
            <div className="p-rev-loading">Loading reviews…</div>
          )}

          {!reviewsLoading && reviews.length === 0 && (
            <div className="p-rev-empty">
              <span style={{ fontSize: 32 }}>💬</span>
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}

          {!reviewsLoading && reviews.length > 0 && (
            <div className="p-rev-list">
              {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
