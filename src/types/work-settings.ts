// 업무 설정 관련 타입 정의
import { Database } from './database'

// 업무 카테고리 타입
export interface WorkCategory {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  icon?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// 업무 유형 타입
export interface WorkType {
  id: string
  category_id: string
  user_id: string
  name: string
  description?: string
  estimated_duration: number // 분 단위
  default_notification_enabled: boolean
  default_notification_times: number[] // 분 단위 배열
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: WorkCategory
}

// 체크리스트 항목 타입
export interface ChecklistItem {
  id: string
  title: string
  description?: string
  is_required: boolean
  estimated_minutes: number
  sort_order: number
  icon?: string
}

// 체크리스트 템플릿 타입
export interface ChecklistTemplate {
  id: string
  work_type_id: string
  user_id: string
  name: string
  description?: string
  items: ChecklistItem[]
  total_estimated_time: number
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  work_type?: WorkType
}

// 폼 데이터 타입
export interface CategoryFormData {
  name: string
  description?: string
  color: string
  icon?: string
}

export interface WorkTypeFormData {
  name: string
  description?: string
  category_id: string
  estimated_duration: number
  default_notification_enabled: boolean
  default_notification_times: number[]
}

export interface ChecklistItemFormData {
  title: string
  description?: string
  is_required: boolean
  estimated_minutes: number
  icon?: string
}

export interface TemplateFormData {
  name: string
  description?: string
  work_type_id: string
  items: ChecklistItemFormData[]
}

// 드래그 앤 드롭 타입
export interface DragDropItem {
  id: string
  content: ChecklistItem
  index: number
}

export interface DragDropResult {
  source: {
    index: number
    droppableId: string
  }
  destination?: {
    index: number
    droppableId: string
  }
  draggableId: string
}

// 기본 템플릿 타입
export interface DefaultTemplate {
  categoryName: string
  categoryColor: string
  categoryIcon: string
  workTypes: {
    name: string
    description: string
    estimatedDuration: number
    templates: {
      name: string
      description: string
      items: ChecklistItemFormData[]
    }[]
  }[]
}

// 색상 팔레트
export const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9'
] as const

// 아이콘 목록
export const ICON_LIST = [
  'work', 'meeting', 'call', 'email', 'document',
  'presentation', 'analysis', 'planning', 'review',
  'development', 'design', 'testing', 'deployment'
] as const

export type ColorPalette = typeof COLOR_PALETTE[number]
export type IconType = typeof ICON_LIST[number]