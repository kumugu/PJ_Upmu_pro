import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '../types/database'

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

// Auth 헬퍼 함수들
export const authHelpers = {
  // 현재 사용자 세션 가져오기
  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  },

  // 로그인
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // 회원가입
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 사용자 설정 초기화
  async initializeUserSettings(userId: string) {
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

    return { data, error }
  }
}