'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'
import { WorkCategory, CategoryFormData } from '../types/work-settings'
import { useAuth } from './useAuth'

export function useWorkCategories() {
  const [categories, setCategories] = useState<WorkCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // 카테고리 목록 조회
  const fetchCategories = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('work_categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 생성
  const createCategory = async (formData: CategoryFormData) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      const nextSortOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.sort_order)) + 1 
        : 0

      const { data, error } = await supabase
        .from('work_categories')
        .insert({
          ...formData,
          user_id: user.id,
          sort_order: nextSortOrder,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      
      setCategories(prev => [...prev, data])
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '카테고리 생성에 실패했습니다.')
    }
  }

  // 카테고리 수정
  const updateCategory = async (id: string, formData: Partial<CategoryFormData>) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      const { data, error } = await supabase
        .from('work_categories')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setCategories(prev => 
        prev.map(category => 
          category.id === id ? data : category
        )
      )
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '카테고리 수정에 실패했습니다.')
    }
  }

  // 카테고리 삭제 (소프트 삭제)
  const deleteCategory = async (id: string) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      const { error } = await supabase
        .from('work_categories')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '카테고리 삭제에 실패했습니다.')
    }
  }

  // 카테고리 순서 변경
  const reorderCategories = async (reorderedCategories: WorkCategory[]) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      const updates = reorderedCategories.map((category, index) => ({
        id: category.id,
        sort_order: index,
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('work_categories')
        .upsert(updates)

      if (error) throw error

      setCategories(reorderedCategories)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '카테고리 순서 변경에 실패했습니다.')
    }
  }

  // 특정 카테고리 조회
  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id)
  }

  useEffect(() => {
    fetchCategories()
  }, [user])

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getCategoryById,
    refetch: fetchCategories
  }
}