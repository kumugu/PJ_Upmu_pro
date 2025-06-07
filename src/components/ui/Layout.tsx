'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/src/hooks/useAuth'
import { Button } from './Button'
import { LogOut, Settings, Home, BarChart3, Clock, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const navigation = [
    { name: '대시보드', href: '/dashboard', icon: Home },
    { name: '업무 시작', href: '/work/start', icon: Clock },
    { name: '업무 설정', href: '/work/settings', icon: Settings },
    { name: '통계', href: '/stats', icon: BarChart3 },
  ]

  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* 로고 */}
          <div className="flex items-center px-6 py-4">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">업무관리</span>
            </div>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    pathname === item.href
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={clsx(
                      'mr-3 h-5 w-5',
                      pathname === item.href
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* 사용자 정보 */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">관리자</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="ml-3"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}