import { useState, useRef } from 'react'
import { useReviews } from '@/hooks/useReviews'
import { useProducts } from '@/hooks/useProducts'
import './ReviewModal.css'

const STARS = [1, 2, 3, 4, 5]

export default function ReviewModal({ product, onClose, onSuccess }) {
  const { submitReview, submitting } = useReviews()
  const { products } = useProducts()

  // selectedProduct can be changed via the dropdown; defaults to the prop
  const [selectedProductId, setSelectedProductId] = useState(product?.id ?? '')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewerName, setReviewerName] = useState('')
  const [body, setBody] = useState('')
  const [images, setImages] = useState([])       // File objects
  const [previews, setPreviews] = useState([])   // Data URLs for preview
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)
  const fileInputRef = useRef(null)

  if (!product) return null

  // Resolve the currently selected product object
  const selectedProduct =
    products.find(p => p.id === selectedProductId) ??
    product ??
    products[0]

  const handleFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (valid.length === 0) return
    setImages(prev => [...prev, ...valid])
    valid.forEach(f => {
      const reader = new FileReader()
      reader.onload = (e) => setPreviews(prev => [...prev, e.target.result])
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!selectedProduct) {
      setError('Please select a product to review.')
      return
    }
    if (!body.trim()) {
      setError('Please write something in your review.')
      return
    }

    const result = await submitReview({
      productId: selectedProduct.id,
      reviewerName: reviewerName.trim() || 'Anonymous',
      rating,
      body: body.trim(),
      images,
    })

    if (!result.success) {
      setError(result.error || 'Failed to submit review. Please try again.')
      return
    }

    setDone(true)
    setTimeout(() => {
      onSuccess?.()
      onClose()
    }, 1400)
  }

  return (
    <div className="review-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="review-modal">
        {/* Header */}
        <div className="review-modal__header">
          <div>
            <p className="review-modal__product">
              {selectedProduct?.category ?? 'Select a product'}
            </p>
            <h2 className="review-modal__title">Write a Review</h2>
          </div>
          <button className="review-modal__close" onClick={onClose}>✕</button>
        </div>

        {done ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Review Submitted!
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
              Thanks for sharing your experience with {selectedProduct?.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="review-modal__body">

              {/* ── Product selector dropdown ── */}
              <div className="review-field">
                <label htmlFor="review-product-select">Reviewing</label>
                <div className="review-product-dropdown">
                  <button
                    type="button"
                    id="review-product-select"
                    className="review-product-trigger"
                    onClick={() => setDropdownOpen(o => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                  >
                    {selectedProduct ? (
                      <span className="review-product-trigger__inner">
                        {selectedProduct.imageUrl ? (
                          <img
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            className="review-product-thumb"
                          />
                        ) : (
                          <span className="review-product-emoji-thumb">{selectedProduct.emoji}</span>
                        )}
                        <span className="review-product-trigger__name">{selectedProduct.name}</span>
                        <span className="review-product-trigger__cat">{selectedProduct.category}</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Select a product…</span>
                    )}
                    <span className={`review-dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▾</span>
                  </button>

                  {dropdownOpen && (
                    <ul className="review-product-list" role="listbox">
                      {products.map(p => (
                        <li
                          key={p.id}
                          role="option"
                          aria-selected={p.id === selectedProductId}
                          className={`review-product-option ${p.id === selectedProductId ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedProductId(p.id)
                            setDropdownOpen(false)
                          }}
                        >
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="review-product-thumb" />
                          ) : (
                            <span className="review-product-emoji-thumb">{p.emoji}</span>
                          )}
                          <span className="review-product-option__info">
                            <span className="review-product-option__name">{p.name}</span>
                            <span className="review-product-option__meta">
                              {p.category} · PKR {p.price.toFixed(0)}
                            </span>
                          </span>
                          {p.id === selectedProductId && (
                            <span className="review-product-option__check">✓</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* ── Star rating ── */}
              <div>
                <p className="review-stars-label">Your Rating ({hoverRating || rating} / 5)</p>
                <div className="review-stars" onMouseLeave={() => setHoverRating(0)}>
                  {STARS.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`review-star-btn ${s <= (hoverRating || rating) ? 'active' : ''}`}
                      onClick={() => {
                        setRating(s)
                        setHoverRating(0)
                      }}
                      onMouseEnter={() => setHoverRating(s)}
                      aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Name ── */}
              <div className="review-field">
                <label htmlFor="reviewer-name">Your Name</label>
                <input
                  id="reviewer-name"
                  type="text"
                  placeholder="Anonymous"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  maxLength={60}
                />
              </div>

              {/* ── Review body ── */}
              <div className="review-field">
                <label htmlFor="review-body">Review *</label>
                <textarea
                  id="review-body"
                  placeholder={`Tell others what you think about ${selectedProduct?.name ?? 'this product'}…`}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  maxLength={1000}
                  required
                />
              </div>

              {/* ── Image upload ── */}
              <div>
                <p className="review-stars-label">Photos (optional)</p>
                <div
                  className={`review-upload-area ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => handleFiles(e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <div className="review-upload-icon">📷</div>
                  <p className="review-upload-text">
                    <strong>Click to upload</strong> or drag &amp; drop<br />
                    JPG, PNG, WEBP up to 5MB each
                  </p>
                </div>

                {previews.length > 0 && (
                  <div className="review-image-previews">
                    {previews.map((src, i) => (
                      <div key={i} className="review-img-preview-wrap">
                        <img src={src} alt={`Preview ${i + 1}`} />
                        <button
                          type="button"
                          className="review-img-remove"
                          onClick={() => removeImage(i)}
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <p className="review-error">⚠ {error}</p>}

            <div className="review-modal__footer">
              <button
                type="submit"
                className="btn-primary review-submit-btn"
                disabled={submitting || !selectedProduct}
                id="submit-review-btn"
              >
                {submitting ? 'Submitting…' : 'Submit Review ✓'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
