'use client'
import React from "react"

// 예시: Sidebar 컴포넌트 (간단 Tailwind 적용)
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg hidden lg:block z-20">
      <div className="p-6 font-bold text-xl">업무 관리</div>
      <nav className="mt-8 flex flex-col gap-2">
        <a href="/dashboard" className="px-6 py-2 hover:bg-blue-50 rounded">대시보드</a>
        <a href="/dashboard/schedule" className="px-6 py-2 hover:bg-blue-50 rounded">업무 스케줄</a>
        <a href="/dashboard/work" className="px-6 py-2 hover:bg-blue-50 rounded">업무 시작</a>
        <a href="/dashboard/history" className="px-6 py-2 hover:bg-blue-50 rounded">업무 내역</a>
        <a href="/dashboard/salary" className="px-6 py-2 hover:bg-blue-50 rounded">급여 내역</a>
        <a href="/dashboard/settings" className="px-6 py-2 hover:bg-blue-50 rounded">설정</a>
        <a href="/logout" className="px-6 py-2 text-red-500 hover:bg-red-50 rounded">로그아웃</a>
      </nav>
    </aside>
  )
}

// 예시: DashboardHeader 컴포넌트 (간단 Tailwind 적용)
export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">대시보드</h1>
      {/* 필요시 사용자 정보/버튼 등 추가 */}
    </header>
  )
}

// useTheme 훅 예시 (다크모드 토글)
export function useTheme() {
  // 실제로는 context나 localStorage 연동 필요
  return { theme: 'light' }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
