import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Hook for managing product reviews.
 * @param {number|null} productId - If provided, fetches only reviews for that product.
 *                                  If null/undefined, fetches ALL reviews (community feed).
 */
export function useReviews(productId = null) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (productId) {
        query = query.eq('product_id', productId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        console.error('[useReviews] fetch error:', fetchError)
        setError(fetchError.message)
      } else {
        setReviews(data ?? [])
      }
    } catch (err) {
      console.error('[useReviews] unexpected error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  /**
   * Upload an array of image files to the review-images bucket.
   * Returns an array of public URLs.
   */
  const uploadReviewImages = async (files) => {
    if (!supabase || !files || files.length === 0) return []

    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        console.error('[useReviews] image upload error:', uploadError)
        continue
      }

      const { data } = supabase.storage
        .from('review-images')
        .getPublicUrl(fileName)

      if (data?.publicUrl) {
        urls.push(data.publicUrl)
      }
    }

    return urls
  }

  /**
   * Submit a new review.
   * @param {{ productId: number, reviewerName: string, rating: number, body: string, images: File[] }} reviewData
   */
  const submitReview = async ({ productId: pid, reviewerName, rating, body, images = [] }) => {
    setSubmitting(true)
    setError(null)

    try {
      // Upload images first (if any)
      const imageUrls = await uploadReviewImages(images)

      if (!supabase) {
        // Offline fallback — store locally so it appears without persistence
        const localReview = {
          id: Date.now(),
          product_id: pid,
          reviewer_name: reviewerName || 'Anonymous',
          rating,
          body,
          image_urls: imageUrls,
          created_at: new Date().toISOString(),
        }
        setReviews(prev => [localReview, ...prev])
        return { success: true }
      }

      const { data, error: insertError } = await supabase
        .from('reviews')
        .insert([{
          product_id: pid,
          reviewer_name: reviewerName || 'Anonymous',
          rating,
          body,
          image_urls: imageUrls,
        }])
        .select()
        .single()

      if (insertError) {
        console.error('[useReviews] insert error:', insertError)
        setError(insertError.message)
        return { success: false, error: insertError.message }
      }

      // Prepend the new review to the list
      setReviews(prev => [data, ...prev])
      return { success: true }
    } catch (err) {
      console.error('[useReviews] submitReview error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  const deleteReview = async (id) => {
    if (!supabase) {
      setReviews(prev => prev.filter(r => r.id !== id))
      return { success: true }
    }

    try {
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error('[useReviews] delete error:', deleteError)
        return { success: false, error: deleteError.message }
      }

      setReviews(prev => prev.filter(r => r.id !== id))
      return { success: true }
    } catch (err) {
      console.error('[useReviews] deleteReview error:', err)
      return { success: false, error: err.message }
    }
  }

  return { reviews, loading, submitting, error, submitReview, deleteReview, refetch: fetchReviews }
}
