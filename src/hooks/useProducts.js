import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Static fallback — used when Supabase is not configured or unreachable
const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Pro Wooden Parallets', category: 'parallets', price: 89.99, originalPrice: 119.99, emoji: '🪵', color: 'linear-gradient(135deg, #2d1b0e, #4a2f1a)', badge: 'Best Seller', rating: 4.9, reviews: 247, description: 'Premium birch wood parallets with non-slip rubber base.', features: ['Birch hardwood', '1200lb load rated', 'Non-slip grip', 'Portable'] },
  { id: 2, name: 'Elite Steel Parallets', category: 'parallets', price: 129.99, originalPrice: 159.99, emoji: '🔩', color: 'linear-gradient(135deg, #1a1a2e, #16213e)', badge: 'New', rating: 4.8, reviews: 98, description: 'Heavy-duty powder-coated steel parallets with adjustable height.', features: ['Powder-coated steel', 'Height adjustable', '2000lb load rated', 'Rust-resistant'] },
  { id: 3, name: 'Mini Travel Parallets', category: 'parallets', price: 54.99, originalPrice: null, emoji: '✈️', color: 'linear-gradient(135deg, #0d2137, #1a3a5c)', badge: null, rating: 4.7, reviews: 134, description: 'Compact folding parallets for athletes on the go.', features: ['Foldable design', 'Aluminum alloy', '400lb rated', 'Carry bag included'] },
  { id: 4, name: 'Meow612 Tee', category: 'apparel', price: 34.99, originalPrice: null, emoji: '👕', color: 'linear-gradient(135deg, #111827, #1f2937)', badge: null, rating: 4.6, reviews: 312, description: 'Ultra-soft cotton blend tee with our signature logo.', features: ['95% cotton', 'Moisture-wicking', 'Pre-shrunk', 'Unisex fit'] },
  { id: 5, name: 'Beast Mode Hoodie', category: 'apparel', price: 64.99, originalPrice: 79.99, emoji: '🥷', color: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)', badge: 'Sale', rating: 4.9, reviews: 189, description: 'Premium heavyweight hoodie for outdoor training.', features: ['400g fleece', 'Kangaroo pocket', 'Drawstring hood', 'Embroidered logo'] },
  { id: 6, name: 'Gymnastic Chalk Block', category: 'accessories', price: 14.99, originalPrice: null, emoji: '🧊', color: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)', badge: null, rating: 4.8, reviews: 541, description: 'Professional magnesium carbonate chalk for maximum grip.', features: ['Pure MgCO3', '4-pack included', 'Long-lasting', 'Competition grade'] },
  { id: 7, name: 'Resistance Band Set', category: 'accessories', price: 29.99, originalPrice: 39.99, emoji: '🎯', color: 'linear-gradient(135deg, #0a2e1a, #1a4f2e)', badge: 'Sale', rating: 4.7, reviews: 276, description: 'Complete set of 5 resistance bands for calisthenics progressions.', features: ['5 resistance levels', 'Natural latex', 'Carry bag', 'Exercise guide'] },
  { id: 8, name: 'Pull-Up Grips', category: 'accessories', price: 19.99, originalPrice: null, emoji: '🤸', color: 'linear-gradient(135deg, #2e1a0a, #4f3a1a)', badge: null, rating: 4.5, reviews: 198, description: 'Pro-grade leather pull-up grips to protect your palms.', features: ['Genuine leather', 'Velcro wrist wrap', '3 sizes available', 'Wrist support'] },
]
const FALLBACK_CATEGORIES = ['all', 'parallets', 'apparel', 'accessories']

export function useProducts() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState(['all'])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      // No Supabase client — use fallback immediately
      if (!supabase) {
        if (!cancelled) {
          setProducts(FALLBACK_PRODUCTS)
          setCategories(FALLBACK_CATEGORIES)
          setLoading(false)
        }
        return
      }

      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: true }),
        supabase.from('categories').select('slug').order('id', { ascending: true }),
      ])

      if (cancelled) return

      if (productsRes.error || categoriesRes.error) {
        // Supabase failed — fall back to static data silently
        console.warn('[useProducts] Supabase error, using fallback data.')
        setProducts(FALLBACK_PRODUCTS)
        setCategories(FALLBACK_CATEGORIES)
        setLoading(false)
        return
      }

      const normalised = (productsRes.data ?? []).map((p) => ({
        id:            p.id,
        name:          p.name,
        category:      p.category_slug,
        price:         Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : null,
        emoji:         p.emoji,
        color:         p.color,
        badge:         p.badge,
        rating:        Number(p.rating),
        reviews:       p.reviews,
        description:   p.description,
        features:      p.features ?? [],
        stock:         p.stock,
      }))

      const cats = ['all', ...(categoriesRes.data ?? []).map((c) => c.slug)]

      setProducts(normalised)
      setCategories(cats)
      setLoading(false)
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  return { products, categories, loading, error }
}
