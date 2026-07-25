import { useState } from 'react'
import { useCartCtx } from '@/App'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart, openProductDetails } = useCartCtx()
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="product-card" id={`product-${product.id}`} onClick={() => openProductDetails(product)}>
      {product.badge && (
        <span className={`product-card__badge product-card__badge--${product.badge.toLowerCase().replace(' ', '-')}`}>
          {product.badge}
        </span>
      )}

      <div className="product-card__img" style={{ background: product.imageUrl ? '#0e0e0e' : product.color }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card__photo"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <span
          className="product-card__emoji"
          style={{ display: product.imageUrl ? 'none' : 'flex' }}
        >{product.emoji}</span>
        <div className="product-card__img-glow" />
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>



        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="price-current">PKR {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="price-original">PKR {product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className={`product-card__btn ${added ? 'product-card__btn--added' : ''}`}
            onClick={handleAdd}
            id={`add-to-cart-${product.id}`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
