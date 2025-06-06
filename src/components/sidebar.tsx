'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'

const menuItems = [
  { id: 'dashboard', label: '대시보드', icon: '🏠', href: '/dashboard' },
  { id: 'schedule', label: '업무 스케줄', icon: '📅', href: '/dashboard/schedule' },
  { id: 'work', label: '업무 시작', icon: '▶️', href: '/dashboard/work' },
  { id: 'history', label: '업무 내역', icon: '📊', href: '/dashboard/history' },
  { id: 'salary', label: '급여 내역', icon: '💰', href: '/dashboard/salary' },
  { id: 'settings', label: '설정', icon: '⚙️', href: '/dashboard/settings' },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 마운트되기 전에는 기본 스타일로 렌더링
  const isDark = mounted ? theme === 'dark' : false

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
      >
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 오버레이 */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 h-screen 
        ${isCollapsed ? 'w-20' : 'w-72'} 
        ${isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'}
        border-r shadow-lg
        transition-all duration-300 ease-in-out
        transform lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* 로고 헤더 */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} relative`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">W</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    WorkSpace
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    업무 관리 시스템
                  </p>
                </div>
              )}
            </div>
            
            {/* 토글 버튼 */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden lg:block absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>
          
          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                  theme={mounted ? theme : undefined}
                  onClick={() => setIsMobileOpen(false)}
                />
              )
            })}
          </nav>

          {/* 사용자 프로필 */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">👤</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    사용자
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    온라인
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function NavItem({ item, isActive, isCollapsed, theme, onClick }: {
  item: typeof menuItems[0]
  isActive: boolean
  isCollapsed: boolean
  theme: string | undefined
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const isDark = theme === 'dark'

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.href}
        onClick={onClick}
        className={`
          group flex items-center gap-4 px-4 py-3 rounded-xl
          transition-all duration-200 ease-in-out
          ${isActive 
            ? (isDark 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg' 
                : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 shadow-md')
            : (isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
          }
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        <span className={`text-xl transition-transform ${isHovered ? 'scale-110' : ''}`}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <span className="font-medium">{item.label}</span>
        )}
        {isActive && !isCollapsed && (
          <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        )}
      </Link>
      
      {/* 호버 툴팁 (축소 상태일 때만) */}
      {isCollapsed && isHovered && (
        <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 text-sm rounded-md shadow-xl z-50 whitespace-nowrap ${
          isDark 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-800 text-white'
        }`}>
          {item.label}
          <div className={`absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 -mr-1 ${
            isDark 
              ? 'bg-gray-900' 
              : 'bg-gray-800'
          }`} />
        </div>
      )}
    </div>
  )
}