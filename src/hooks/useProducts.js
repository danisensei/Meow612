import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'


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
          setProducts([])
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

        if (productsRes.error) {
          setProducts([])
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
          setProducts([])
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
