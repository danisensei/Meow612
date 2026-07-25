import { useState } from 'react'
import { useCartCtx } from '@/App'
import { supabase } from '@/lib/supabase'
import './CheckoutModal.css'

export default function CheckoutModal({ open, onClose, onSuccess }) {
  const { cartItems, cartTotal, clearCart } = useCartCtx()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!open || cartItems.length === 0) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        emoji: item.emoji,
        color: item.color
      }))

      const { error: dbError } = await supabase.from('orders').insert([
        {
          customer_name: name,
          customer_email: email,
          address: address,
          items: orderItems,
          total_price: cartTotal
        }
      ])

      if (dbError) throw dbError

      clearCart()
      onSuccess?.('Order placed successfully! 📦')
      onClose()
    } catch (err) {
      console.error('[CheckoutError]', err)
      setError(err.message || 'Failed to place order. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="checkout-overlay" onClick={onClose} />
      <div className="checkout-modal">
        <button className="checkout-close" onClick={onClose}>✕</button>
        
        <h2 className="checkout-title">Checkout 🛒</h2>
        
        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-field">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                disabled={submitting}
              />
            </div>

            <div className="checkout-field">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled={submitting}
              />
            </div>

            <div className="checkout-field">
              <label>Shipping Address</label>
              <textarea
                required
                rows="3"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 Street Name, City, Country"
                disabled={submitting}
              />
            </div>

            {error && <p className="checkout-error">⚠️ {error}</p>}

            <button type="submit" className="btn-primary checkout-submit" disabled={submitting}>
              {submitting ? <span className="checkout-spinner" /> : `Place Order • PKR ${cartTotal.toFixed(2)}`}
            </button>
          </form>

          {/* Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-sum-item">
                  <div className="checkout-sum-img" style={{ background: item.color }}>
                    <span>{item.emoji}</span>
                  </div>
                  <div className="checkout-sum-info">
                    <p className="checkout-sum-name">{item.name}</p>
                    <p className="checkout-sum-qty">Qty: {item.qty}</p>
                  </div>
                  <span className="checkout-sum-price">PKR {(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="checkout-summary-footer">
              <div className="checkout-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="checkout-divider" />
              <div className="checkout-row total">
                <span>Total</span>
                <span>PKR {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
