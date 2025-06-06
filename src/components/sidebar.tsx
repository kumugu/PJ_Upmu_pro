'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

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
  const pathname = usePathname()

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-synerque-dark rounded-xl shadow-lg hover:bg-synerque-base transition-colors"
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
        fixed inset-y-0 left-0 z-50 
        ${isCollapsed ? 'w-20' : 'w-72'} 
        bg-synerque-dark border-r border-synerque-base
        transition-all duration-300 ease-in-out
        transform lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* 로고 헤더 */}
          <div className="p-6 border-b border-synerque-base/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">W</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-white font-bold text-xl">WorkSpace</h1>
                  <p className="text-gray-400 text-sm">업무 관리 시스템</p>
                </div>
              )}
            </div>
            
            {/* 토글 버튼 */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block absolute -right-3 top-8 w-6 h-6 bg-synerque-base rounded-full flex items-center justify-center text-white hover:bg-synerque-hover transition-colors"
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
                  onClick={() => setIsMobileOpen(false)}
                />
              )
            })}
          </nav>

          {/* 사용자 프로필 */}
          <div className="p-4 border-t border-synerque-base/50">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">👤</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">사용자</p>
                  <p className="text-gray-400 text-xs">온라인</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function NavItem({ item, isActive, isCollapsed, onClick }: {
  item: typeof menuItems[0]
  isActive: boolean
  isCollapsed: boolean
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

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
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg' 
            : 'text-gray-300 hover:text-white hover:bg-synerque-hover'
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
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-synerque-dark text-white text-sm rounded-md shadow-xl z-50 animate-fade-in">
          {item.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-synerque-dark rotate-45 -mr-1" />
        </div>
      )}
    </div>
  )
}