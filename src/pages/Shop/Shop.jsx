import { useState, useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard/ProductCard'
import './Shop.css'

const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function Shop() {
  const { products, categories, loading, error } = useProducts()
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('default')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = [...products]

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }

    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price)
      case 'price-desc': return list.sort((a, b) => b.price - a.price)
      case 'rating': return list.sort((a, b) => b.rating - a.rating)
      default: return list
    }
  }, [activeCategory, sort, search])

  return (
    <main className="shop-page">
      {/* Page Header */}
      <div className="shop-hero">
        <div className="glow-orb shop-hero__orb" />
        <div className="container">
          <div className="shop-hero__content">
            <div className="section-label">🛒 The Collection</div>
            <h1 className="section-title">Shop All <span>Gear</span></h1>
            <p className="section-subtitle">
              Everything you need to build strength, master skills, and look the part.
            </p>
          </div>
        </div>
      </div>

      <div className="container shop-body">
        {/* Filters */}
        <div className="shop-filters">
          <div className="shop-filters__categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                id={`filter-${cat}`}
              >
                {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="shop-filters__right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
                id="search-input"
              />
            </div>

            <select
              className="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
              id="sort-select"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="shop-results-count">
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'all' && ` in ${activeCategory}`}
          </p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="shop-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-skeleton" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="db-error">⚠️ Could not load products. Check your Supabase credentials.</p>
        )}

        {/* Grid */}
        {!loading && !error && (
          filtered.length > 0 ? (
            <div className="shop-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="shop-empty">
              <div className="shop-empty__icon">🔍</div>
              <h3>No products found</h3>
              <p>Try a different search term or category.</p>
              <button className="btn-outline" onClick={() => { setSearch(''); setActiveCategory('all') }}>
                Clear Filters
              </button>
            </div>
          )
        )}
      </div>
    </main>
  )
}
