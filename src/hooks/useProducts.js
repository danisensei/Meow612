import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Static fallback — used when Supabase is not configured, empty, or unreachable
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Daniyal Parallels',
    category: 'parallets',
    price: 123.00,
    originalPrice: 149.99,
    emoji: '🪵',
    color: '#1a1918',
    badge: 'BEST SELLER',
    rating: 5.0,
    reviews: 48,
    description: 'Professional Wood Finish. Engineered for maximum stability, palm comfort, and elite planche training.',
    features: ['High-grade solid beech wood', 'Anti-slip rubber feet base', 'Supports up to 350kg load'],
    stock: 12,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6r85watuZn0mjdTjtu8gV6sJYsRiXDmnOiTRj9tsavciJaF27w-i0YOZIYi2Cm33L6daQg8OethgHelr1qfs78gT_2DbNPA-KuqUhUEc74C7lD-eqgITWdjA2YKH_B8AWfnJksaExpDpE_IBqVJfvAvOEJ_N6QUtXXK2v55TTX_o4-wdqEgIROt-27OxBKQn0ajTPrQArfI7ikprgmV4X1OpDTf6yyk6hUdc16TjP0_eynnKUXNZ7IjiaN8mbulXvA8PqyaitjZg'
  },
  {
    id: 2,
    name: 'Steel Pro Parallettes',
    category: 'parallets',
    price: 89.99,
    originalPrice: 109.99,
    emoji: '🏋️',
    color: '#131313',
    badge: 'PRO GRADE',
    rating: 4.9,
    reviews: 32,
    description: 'Heavy duty powder-coated steel parallettes built for indoor and outdoor intense sessions.',
    features: ['Powder-coated grip surface', 'Ultra wide stability base', 'Portable lightweight design'],
    stock: 20,
    imageUrl: null
  },
  {
    id: 3,
    name: 'Meow612 Elite Oversized Hoodie',
    category: 'apparel',
    price: 65.00,
    originalPrice: 79.99,
    emoji: '👕',
    color: '#201f1f',
    badge: 'NEW',
    rating: 4.8,
    reviews: 19,
    description: 'Premium heavyweight cotton oversized hoodie designed for maximum freedom of movement during warmups.',
    features: ['450GSM organic heavy cotton', 'Embroidered MEOW612 chest emblem', 'Relaxed drop-shoulder fit'],
    stock: 15,
    imageUrl: null
  },
  {
    id: 4,
    name: 'Liquid Chalk Formula (200ml)',
    category: 'accessories',
    price: 18.50,
    originalPrice: null,
    emoji: '🧪',
    color: '#1c1b1b',
    badge: null,
    rating: 5.0,
    reviews: 64,
    description: 'Fast-drying, long-lasting grip formula. Zero mess, maximum friction for strict calisthenics skills.',
    features: ['Dries in under 10 seconds', 'Sweat-resistant ultra grip', 'Dust-free clean application'],
    stock: 50,
    imageUrl: null
  },
  {
    id: 5,
    name: 'Heavy Resistance Band Set',
    category: 'accessories',
    price: 34.99,
    originalPrice: 44.99,
    emoji: '🎗️',
    color: '#181818',
    badge: 'SALE',
    rating: 4.9,
    reviews: 27,
    description: 'Set of 4 natural latex bands for planche assistance, front lever progressions, and mobility work.',
    features: ['100% Eco natural latex', 'Color coded resistance levels (15-125 lbs)', 'Carrying bag included'],
    stock: 30,
    imageUrl: null
  }
]

const FALLBACK_CATEGORIES = ['all', 'parallets', 'apparel', 'accessories']

export function useProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['all'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      if (!supabase) {
        if (!cancelled) {
          setProducts(FALLBACK_PRODUCTS)
          setCategories(FALLBACK_CATEGORIES)
          setLoading(false)
        }
        return
      }

      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*').order('id', { ascending: true }),
          supabase.from('categories').select('slug').order('id', { ascending: true }),
        ])

        if (cancelled) return

        if (productsRes.error || !productsRes.data || productsRes.data.length === 0) {
          setProducts(FALLBACK_PRODUCTS)
          setCategories(FALLBACK_CATEGORIES)
          setLoading(false)
          return
        }

        const normalised = productsRes.data.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category_slug ?? p.category ?? 'parallets',
          price: Number(p.price),
          originalPrice: p.original_price ? Number(p.original_price) : null,
          emoji: p.emoji ?? '🏋️',
          color: p.color ?? '#111111',
          badge: p.badge,
          rating: Number(p.rating ?? 5.0),
          reviews: p.reviews ?? 10,
          description: p.description,
          features: p.features ?? [],
          stock: p.stock ?? 10,
          imageUrl: p.image_url ?? null,
        }))

        const catsFromRes = (categoriesRes.data ?? []).map((c) => c.slug)
        const cats = ['all', ...new Set([...catsFromRes, 'parallets', 'apparel', 'accessories'])]

        setProducts(normalised)
        setCategories(cats)
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setProducts(FALLBACK_PRODUCTS)
          setCategories(FALLBACK_CATEGORIES)
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [refetchTrigger])

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  const addProduct = async (productData) => {
    if (!supabase) return { success: false, error: 'Supabase not connected.' }
    const { error } = await supabase.from('products').insert([productData])
    if (error) { console.error('[addProduct]', error); return { success: false, error: error.message } }
    refetch()
    return { success: true }
  }

  const removeProduct = async (id) => {
    if (!supabase) return { success: false, error: 'Supabase not connected.' }
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { console.error('[removeProduct]', error); return { success: false, error: error.message } }
    refetch()
    return { success: true }
  }

  const updateProduct = async (id, updates) => {
    if (!supabase) return { success: false, error: 'Supabase not connected.' }
    const { error } = await supabase.from('products').update(updates).eq('id', id)
    if (error) { console.error('[updateProduct]', error); return { success: false, error: error.message } }
    refetch()
    return { success: true }
  }

  const uploadProductImage = async (file) => {
    if (!supabase) return null
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      alert('Failed to upload image. Check storage policies.')
      return null
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
      
    return data.publicUrl
  }

  return { products, categories, loading, error, addProduct, removeProduct, updateProduct, refetch, uploadProductImage }
}
