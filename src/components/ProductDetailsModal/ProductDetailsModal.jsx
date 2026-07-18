import { useState } from 'react'
import { useCartCtx } from '@/App'
import './ProductDetailsModal.css'

export default function ProductDetailsModal({ product, onClose }) {
  const { addToCart } = useCartCtx()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return null

  const handleAdd = () => {
    // Add multiple quantities
    for (let i = 0; i < qty; i++) {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 1200)
  }

  return (
    <>
      <div className="p-details-overlay" onClick={onClose} />
      <div className="p-details-modal">
        <button className="p-details-close" onClick={onClose}>✕</button>

        <div className="p-details-grid">
          {/* Image panel */}
          <div className="p-details-img-panel" style={{ background: product.imageUrl ? '#0a0a0a' : product.color }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="p-details-photo" />
            ) : (
              <span className="p-details-emoji">{product.emoji}</span>
            )}
            <div className="p-details-glow" />
          </div>

          {/* Info panel */}
          <div className="p-details-info">
            <p className="p-details-cat">{product.category}</p>
            <h2 className="p-details-title">{product.name}</h2>

            <div className="p-details-price">
              <span className="current">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="p-details-desc">{product.description || 'No description provided.'}</p>

            {/* Premium Badges */}
            <div className="p-details-badges">
              <div className="p-badge">
                <span className="p-badge-icon">🛡️</span>
                <div>
                  <p className="p-badge-title">2 Year Warranty</p>
                  <p className="p-badge-sub">Built to last</p>
                </div>
              </div>
              <div className="p-badge">
                <span className="p-badge-icon">🚚</span>
                <div>
                  <p className="p-badge-title">Free Shipping</p>
                  <p className="p-badge-sub">Worldwide delivery</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-details-actions">
              <div className="p-details-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="qty-btn">−</button>
                <span className="qty-val">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="qty-btn">+</button>
              </div>

              <button
                className={`btn-primary p-details-add-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={added}
              >
                {added ? '✓ Added' : `Add to Cart • $${(product.price * qty).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
