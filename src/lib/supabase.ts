import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types/database'

// 클라이언트 컴포넌트용 Supabase 클라이언트
export const createSupabaseClient = () => 
  createClientComponentClient<Database>()

// 서버 컴포넌트용 Supabase 클라이언트  
export const createSupabaseServerClient = () => 
  createServerComponentClient<Database>({ cookies })

// 공용 Supabase 클라이언트 (브라우저 전용)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 클라이언트 생성 헬퍼 (이전 버전 호환성을 위해 추가)
export const getSupabaseClient = () => createSupabaseClient()

// 인증 요구 함수 (독립적으로 export)
export const requireAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    throw new Error('로그인이 필요합니다.')
  }
  return session.user
}

// Auth 헬퍼 함수들
export const authHelpers = {
  // 현재 사용자 가져오기
  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  },

  // 인증 요구 (authHelpers 내부용)
  async requireAuth() {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }
    return user
  },

  // 로그인
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (data.user && !error) {
      // 로그인 성공 시 사용자 설정 확인 및 초기화
      await this.ensureUserSettings(data.user.id)
    }
    
    return { data, error }
  },

  // 회원가입
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (data.user && !error) {
      // 회원가입 성공 시 사용자 설정 초기화
      await this.initializeUserSettings(data.user.id)
    }
    
    return { data, error }
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 사용자 설정 초기화
  async initializeUserSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          default_hourly_rate: 0,
          working_hours_start: '09:00',
          working_hours_end: '18:00',
          notification_enabled: true,
          theme: 'light',
          language: 'ko',
          timezone: 'Asia/Seoul'
        })
        .select()
        .single()

      if (error && error.code !== '23505') { // 중복 키 에러가 아닌 경우만 throw
        throw error
      }

      return { data, error }
    } catch (err) {
      console.error('사용자 설정 초기화 실패:', err)
      return { data: null, error: err }
    }
  },

  // 사용자 설정 확인 및 필요시 생성
  async ensureUserSettings(userId: string) {
    try {
      // 먼저 기존 설정이 있는지 확인
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('user_id', userId)
        .single()

      // 설정이 없으면 초기화
      if (!existingSettings) {
        return await this.initializeUserSettings(userId)
      }

      return { data: existingSettings, error: null }
    } catch (err) {
      console.error('사용자 설정 확인 실패:', err)
      return { data: null, error: err }
    }
  },

  // 사용자 설정 가져오기
  async getUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    return { data, error }
  },

  // 사용자 설정 업데이트
  async updateUserSettings(userId: string, settings: Partial<Database['public']['Tables']['user_settings']['Update']>) {
    const { data, error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  },

  // 비밀번호 재설정 요청
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    })
    return { data, error }
  },

  // 비밀번호 업데이트
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  },

  // 이메일 업데이트
  async updateEmail(newEmail: string) {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail
    })
    return { data, error }
  },

  // 세션 새로고침
  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    return { data, error }
  },

  // 사용자 메타데이터 업데이트
  async updateUserMetadata(metadata: Record<string, any>) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    })
    return { data, error }
  }
}

// 유틸리티 함수들
export const supabaseUtils = {
  // 파일 업로드
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    return { data, error }
  },

  // 파일 다운로드 URL 가져오기
  async getFileUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },

  // 파일 삭제
  async deleteFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
    return { data, error }
  },

  // 실시간 구독 헬퍼
  subscribeToTable(table: string, callback: (payload: any) => void, filter?: { column: string; value: any }) {
    let channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
        },
        callback
      )
      .subscribe()

    return channel
  },

  // 구독 해제 헬퍼
  unsubscribe(channel: any) {
    return supabase.removeChannel(channel)
  }
}

// 타입 가드 함수들
export const typeGuards = {
  isAuthError(error: any): error is { message: string; status?: number } {
    return error && typeof error.message === 'string'
  },

  isSupabaseError(error: any): error is { message: string; details?: string; hint?: string; code?: string } {
    return error && typeof error.message === 'string' && 'code' in error
  }
}

// Export 기본값 (호환성을 위해)
export default {
  createSupabaseClient,
  createSupabaseServerClient,
  getSupabaseClient,
  requireAuth,
  supabase,
  authHelpers,
  supabaseUtils,
  typeGuards
}