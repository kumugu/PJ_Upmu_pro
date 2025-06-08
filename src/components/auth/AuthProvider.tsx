'use client'
import { useAuth } from '@/src/lib/hooks/useAuth'
import { AuthLoading } from './AuthLoading'
import { usePathname } from 'next/navigation'

interface AuthProviderProps {
  children: React.ReactNode
}

const publicRoutes = ['/auth/login', '/auth/signup', '/']

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  const isPublicRoute = publicRoutes.includes(pathname)

  if (loading) {
    return <AuthLoading />
  }

  // 공개 라우트이거나 사용자가 인증된 경우
  if (isPublicRoute || user) {
    return <>{children}</>
  }

  // 인증되지 않은 사용자는 로딩 표시
  // useAuth 훅에서 자동으로 로그인 페이지로 리다이렉트됨
  return <AuthLoading />
}