import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Static fallback — used when Supabase is not configured or unreachable
const FALLBACK_PRODUCTS = []
const FALLBACK_CATEGORIES = ['all', 'parallets', 'apparel', 'accessories']

export function useProducts() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState(['all'])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

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
  }, [refetchTrigger])

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  const addProduct = async (productData) => {
    if (!supabase) {
      alert("Supabase not connected. Changes won't persist.")
      return false
    }
    const { error } = await supabase.from('products').insert([productData])
    if (error) {
      console.error("Error adding product:", error)
      alert("Failed to add product. Check Supabase RLS policies.")
      return false
    }
    refetch()
    return true
  }

  const removeProduct = async (id) => {
    if (!supabase) {
      alert("Supabase not connected. Changes won't persist.")
      return false
    }
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error("Error removing product:", error)
      alert("Failed to remove product. Check Supabase RLS policies.")
      return false
    }
    refetch()
    return true
  }

  const updateProduct = async (id, updates) => {
    if (!supabase) {
      alert("Supabase not connected. Changes won't persist.")
      return false
    }
    const { error } = await supabase.from('products').update(updates).eq('id', id)
    if (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Check Supabase RLS policies.")
      return false
    }
    refetch()
    return true
  }

  return { products, categories, loading, error, addProduct, removeProduct, updateProduct, refetch }
}
