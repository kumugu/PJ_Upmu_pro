'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 초기 세션 확인
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getInitialSession()

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)

        if (event === 'SIGNED_IN' && session?.user) {
          // 사용자 설정 초기화 시도
          const { data: settings } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', session.user.id)
            .single()

          if (!settings) {
            // 사용자 설정이 없으면 생성
            await supabase.from('user_settings').insert({
              user_id: session.user.id,
              default_hourly_rate: 0,
              working_hours_start: '09:00',
              working_hours_end: '18:00',
              notification_enabled: true,
              theme: 'light',
              language: 'ko',
              timezone: 'Asia/Seoul'
            })
          }

          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          router.push('/auth/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  return {
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  }
}