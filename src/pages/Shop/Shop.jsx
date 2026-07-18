import { useState, useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard/ProductCard'
import './Shop.css'

const CATEGORY_LABELS = {
  all: 'All Gear',
  parallets: 'Parallets',
  apparel: 'Apparel',
  accessories: 'Accessories',
}

export default function Shop() {
  const { products, categories, loading } = useProducts()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let result = [...products]
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating)
    return result
  }, [products, activeCategory, search, sort])

  return (
    <main className="shop-page">
      <div className="shop-hero">
        <div className="shop-hero__glow" />
        <div className="container">
          <p className="section-label">Store</p>
          <h1 className="shop-hero__title">ALL <span>GEAR</span></h1>
          <p className="shop-hero__sub">Elite calisthenics equipment, apparel & accessories.</p>
        </div>
      </div>

      <div className="container shop-controls">
        {/* Search */}
        <div className="shop-search-wrap">
          <span className="shop-search-icon">🔍</span>
          <input
            type="text"
            className="shop-search"
            placeholder="Search gear..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="shop-search"
          />
          {search && (
            <button className="shop-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Sort */}
        <select
          className="shop-sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
          id="shop-sort"
        >
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="container">
        <div className="shop-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`shop-tab ${activeCategory === cat ? 'shop-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat] ?? cat}
              {activeCategory === cat && (
                <span className="shop-tab-count">
                  {cat === 'all' ? products.length : products.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container shop-grid-wrap">
        {loading && (
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="product-skeleton" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="shop-empty">
            <div className="shop-empty__icon">🔍</div>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters.</p>
            <button className="btn-outline" onClick={() => { setSearch(''); setActiveCategory('all') }}>
              Clear Filters
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="shop-result-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
