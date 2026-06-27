import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import './Admin.css'

const PASSCODE = 'meow2026'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)
  
  const { products, loading, addProduct, removeProduct, updateProduct } = useProducts()

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'parallets',
    price: '',
    emoji: '🔥',
    description: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    if (passcode === PASSCODE) {
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setPasscode('')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    // Construct the product object
    const newProduct = {
      name: formData.name,
      category_slug: formData.category, // Assuming backend uses category_slug
      price: parseFloat(formData.price),
      emoji: formData.emoji,
      description: formData.description,
      color: 'linear-gradient(135deg, #1a1a2e, #16213e)', // Default aesthetic color
      badge: null,
      rating: 5.0,
      reviews: 0,
      features: ['Premium Quality', 'Admin Added']
    }

    const success = await addProduct(newProduct)
    if (success) {
      setFormData({
        name: '', category: 'parallets', price: '', emoji: '🔥', description: ''
      })
    }
  }

  const handleToggleSale = async (product) => {
    const isSale = product.badge === 'Sale'
    const updates = {
      badge: isSale ? null : 'Sale',
      original_price: isSale ? null : product.price,
      price: isSale ? product.originalPrice || product.price : (product.price * 0.8).toFixed(2) // 20% off
    }
    await updateProduct(product.id, updates)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await removeProduct(id)
    }
  }

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
                className={`passcode-input ${error ? 'error' : ''}`}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                autoFocus
              />
              <button type="submit" className="submit-btn">Unlock Dashboard</button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <div className="glow-orb" style={{ top: '-10%', left: '-10%' }} />
      
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Admin <span>Command Center</span></h1>
          <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>Lock Session</button>
        </header>

        <div className="admin-grid">
          {/* Add Product Sidebar */}
          <aside className="add-product-panel">
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
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
                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="29.99" />
              </div>
              <div className="form-group">
                <label>Emoji</label>
                <input required type="text" name="emoji" value={formData.emoji} onChange={handleInputChange} placeholder="🔥" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required rows="3" name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief product description..."></textarea>
              </div>
              <button type="submit" className="submit-btn">Deploy Product</button>
            </form>
          </aside>

          {/* Product List */}
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
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>Loading products...</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-emoji">{p.emoji}</div>
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
                        {p.originalPrice && <span style={{textDecoration: 'line-through', color: '#666', marginLeft: '8px', fontSize: '0.8rem'}}>${p.originalPrice.toFixed(2)}</span>}
                      </td>
                      <td>{p.stock ?? '∞'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn btn-sale" 
                            onClick={() => handleToggleSale(p)}
                          >
                            {p.badge === 'Sale' ? 'Remove Sale' : 'Put on Sale'}
                          </button>
                          <button 
                            className="action-btn btn-delete" 
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && !loading && (
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
