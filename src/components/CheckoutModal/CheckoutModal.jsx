import { useState, useRef } from 'react'
import { useCartCtx } from '@/App'
import { supabase } from '@/lib/supabase'
import './CheckoutModal.css'

const PAYMENT_DETAILS = {
  bank: 'Easypaisa',
  accountNumber: '03191902586',
  accountName: 'Hassam Khalid',
}

export default function CheckoutModal({ open, onClose, onSuccess }) {
  const { cartItems, cartTotal, clearCart } = useCartCtx()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  if (!open || cartItems.length === 0) return null

  const handleProofChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Screenshot must be under 5 MB.')
      return
    }
    setProofFile(file)
    setProofPreview(URL.createObjectURL(file))
    setError(null)
  }

  const uploadProof = async (file) => {
    const ext = file.name.split('.').pop()
    const path = `payment-proofs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: false })
    if (uploadError) throw new Error('Failed to upload payment screenshot: ' + uploadError.message)
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!proofFile) {
      setError('Please upload your payment screenshot before placing the order.')
      return
    }
    setError(null)
    setSubmitting(true)

    try {
      const proofUrl = await uploadProof(proofFile)

      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        emoji: item.emoji,
        color: item.color,
      }))

      const { error: dbError } = await supabase.from('orders').insert([{
        customer_name: name,
        customer_email: email,
        address: address,
        items: orderItems,
        total_price: cartTotal,
        payment_proof_url: proofUrl,
      }])

      if (dbError) throw dbError

      clearCart()
      onSuccess?.('Order placed! We\'ll confirm after verifying your payment. 📦')
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
                rows="2"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 Street Name, City, Country"
                disabled={submitting}
              />
            </div>

            {/* ── Payment Section ── */}
            <div className="payment-box">
              <p className="payment-box__title">💳 Pay via {PAYMENT_DETAILS.bank}</p>
              <div className="payment-box__details">
                <div className="payment-detail-row">
                  <span className="payment-detail-label">Account Name</span>
                  <span className="payment-detail-value">{PAYMENT_DETAILS.accountName}</span>
                </div>
                <div className="payment-detail-row">
                  <span className="payment-detail-label">Account Number</span>
                  <span className="payment-detail-value payment-detail-value--number">{PAYMENT_DETAILS.accountNumber}</span>
                </div>
              </div>
              <p className="payment-box__hint">Send the exact amount and upload your payment screenshot below.</p>
            </div>

            {/* ── Proof Upload ── */}
            <div className="checkout-field">
              <label>Payment Screenshot <span style={{ color: '#ff6b6b' }}>*</span></label>
              {proofPreview ? (
                <div className="proof-preview">
                  <img src={proofPreview} alt="Payment proof" className="proof-preview__img" />
                  <button
                    type="button"
                    className="proof-preview__remove"
                    onClick={() => { setProofFile(null); setProofPreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <label className="proof-upload-zone" htmlFor="proof-file-input">
                  <span className="proof-upload-zone__icon">📸</span>
                  <span>Click to upload screenshot</span>
                  <span className="proof-upload-zone__hint">JPG, PNG, WEBP · max 5 MB</span>
                  <input
                    id="proof-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProofChange}
                    style={{ display: 'none' }}
                    disabled={submitting}
                  />
                </label>
              )}
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
