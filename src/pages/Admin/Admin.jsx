import { useState, useRef } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { supabase } from '@/lib/supabase'
import './Admin.css'

const PASSCODE = 'meow2026'
const BUCKET = 'product-images'

// ── Upload helper ──────────────────────────────────────────────────
async function uploadImage(file) {
  const ext  = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
  if (error) return { url: null, error: error.message }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

// ── Tiny in-app toast ─────────────────────────────────────────────
function AdminToast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9999 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? '#1a0505' : '#0d1a00',
          border: `1px solid ${t.type === 'error' ? '#ff4444' : '#c8ff00'}`,
          color: t.type === 'error' ? '#ff6b6b' : '#c8ff00',
          padding: '12px 18px', borderRadius: 10,
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.3s ease', maxWidth: 320,
        }}>
          {t.type === 'error' ? '⚠️' : '✅'} {t.msg}
        </div>
      ))}
    </div>
  )
}

// ── In-app confirm dialog ──────────────────────────────────────────
function ConfirmDialog({ product, onConfirm, onCancel }) {
  if (!product) return null
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)', zIndex: 2000,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#111', border: '1px solid #2a2a2a',
        borderRadius: 16, padding: '32px 28px',
        zIndex: 2001, width: 360, textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        animation: 'fadeUp 0.25s ease',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#f0f0f0' }}>Delete Product?</h3>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
          "<strong style={{ color: '#f0f0f0' }}>{product.name}</strong>" will be permanently removed from the store.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: 8,
            background: 'transparent', border: '1px solid #333',
            color: '#888', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px', borderRadius: 8,
            background: '#ff4444', border: 'none',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Delete</button>
        </div>
      </div>
    </>
  )
}

// ── Main Admin component ───────────────────────────────────────────
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode]   = useState('')
  const [passError, setPassError] = useState(false)

  const { products, loading, addProduct, removeProduct, updateProduct } = useProducts()

  const [formData, setFormData] = useState({
    name: '', category: 'parallets', price: '', description: ''
  })
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting]     = useState(false)
  const fileInputRef = useRef(null)

  const [toasts, setToasts]             = useState([])
  const [confirmProduct, setConfirmProduct] = useState(null)

  const showToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (passcode === PASSCODE) { setIsAuthenticated(true); setPassError(false) }
    else { setPassError(true); setPasscode('') }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5 MB.', 'error'); return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    let image_url = null

    if (imageFile) {
      const { url, error } = await uploadImage(imageFile)
      if (error) {
        showToast(`Image upload failed: ${error}`, 'error')
        setSubmitting(false)
        return
      }
      image_url = url
    }

    const result = await addProduct({
      name:         formData.name,
      category_slug: formData.category,
      price:        parseFloat(formData.price),
      emoji:        '📦',
      description:  formData.description,
      color:        'linear-gradient(135deg, #1a1a2e, #16213e)',
      badge:        null, rating: 5.0, reviews: 0,
      features:     ['Premium Quality', 'Admin Added'],
      image_url,
    })

    setSubmitting(false)
    if (result.success) {
      showToast(`"${formData.name}" added to store!`)
      setFormData({ name: '', category: 'parallets', price: '', description: '' })
      handleRemoveImage()
    } else {
      showToast(result.error || 'Failed to add product.', 'error')
    }
  }

  const handleToggleSale = async (product) => {
    const isSale = product.badge === 'Sale'
    const updates = {
      badge:          isSale ? null : 'Sale',
      original_price: isSale ? null : product.price,
      price:          isSale ? (product.originalPrice || product.price) : (product.price * 0.8).toFixed(2),
    }
    const result = await updateProduct(product.id, updates)
    if (result.success) showToast(isSale ? `Sale removed from "${product.name}"` : `"${product.name}" put on sale!`)
    else showToast(result.error || 'Update failed.', 'error')
  }

  const handleDeleteConfirmed = async () => {
    const product = confirmProduct
    setConfirmProduct(null)
    const result = await removeProduct(product.id)
    if (result.success) showToast(`"${product.name}" deleted.`)
    else showToast(result.error || 'Delete failed.', 'error')
  }

  // ── Passcode gate ─────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="admin-page">
        <div className="glow-orb" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="passcode-container">
          <div className="passcode-box">
            <h2>Access Restricted</h2>
            <p>Enter the admin passcode to continue.</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                className={`passcode-input ${passError ? 'error' : ''}`}
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="••••••••"
                autoFocus
                id="admin-passcode-input"
              />
              {passError && <p style={{ color: '#ff6b6b', fontSize: 13, marginTop: 8 }}>⚠️ Incorrect passcode.</p>}
              <button type="submit" className="submit-btn" id="admin-unlock-btn">Unlock Dashboard</button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────
  return (
    <main className="admin-page">
      <div className="glow-orb" style={{ top: '-10%', left: '-10%' }} />

      <AdminToast toasts={toasts} />
      <ConfirmDialog
        product={confirmProduct}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmProduct(null)}
      />

      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Admin <span>Command Center</span></h1>
          <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>Lock Session</button>
        </header>

        <div className="admin-grid">
          {/* ── Add Product Panel ───────────────────────────────── */}
          <aside className="add-product-panel">
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct}>

              {/* Image upload */}
              <div className="form-group">
                <label>Product Image <span style={{ color: '#555', fontWeight: 400 }}>(optional)</span></label>
                {imagePreview ? (
                  <div className="admin-img-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" className="admin-img-remove" onClick={handleRemoveImage}>✕ Remove</button>
                  </div>
                ) : (
                  <label className="admin-img-upload" htmlFor="admin-img-input">
                    <span className="admin-img-upload-icon">📷</span>
                    <span>Click to upload</span>
                    <span style={{ fontSize: 11, color: '#555' }}>JPG, PNG, WEBP · max 5 MB</span>
                    <input
                      id="admin-img-input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              <div className="form-group">
                <label>Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Pro Grips" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="parallets">Parallets</option>
                  <option value="apparel">Apparel</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input required type="number" step="0.01" min="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="29.99" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required rows="3" name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief product description..." />
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Uploading & Deploying...' : 'Deploy Product'}
              </button>
            </form>
          </aside>

          {/* ── Products Table ──────────────────────────────────── */}
          <section className="products-list-panel">
            <div className="products-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#666', padding: 32 }}>Loading products...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#666', padding: 32 }}>No products found.</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-emoji" style={{ overflow: 'hidden', borderRadius: 6 }}>
                            {p.imageUrl
                              ? <img src={p.imageUrl} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', display: 'block' }} />
                              : p.emoji}
                          </div>
                          <div>
                            <div className="product-name">
                              {p.name} {p.badge === 'Sale' && <span className="badge-sale">SALE</span>}
                            </div>
                            <div className="product-cat">{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        ${p.price.toFixed(2)}
                        {p.originalPrice && (
                          <span style={{ textDecoration: 'line-through', color: '#555', marginLeft: 8, fontSize: '0.8rem' }}>
                            ${p.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td>{p.stock ?? '∞'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn btn-sale" onClick={() => handleToggleSale(p)}>
                            {p.badge === 'Sale' ? 'Remove Sale' : 'Put on Sale'}
                          </button>
                          <button className="action-btn btn-delete" onClick={() => setConfirmProduct(p)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
