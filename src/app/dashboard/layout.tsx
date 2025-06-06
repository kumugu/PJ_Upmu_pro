'use client'

import { useTheme } from "next-themes"
import { Sidebar } from "@/src/components/sidebar"
import { ThemeToggleButton } from "@/src/components/theme/toggle/button"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[oklch(var(--background))] text-[oklch(var(--foreground))]">
      <Sidebar />
      <div className="lg:pl-72 transition-all duration-300">
        {/* 헤더 */}
        <header className="sticky top-0 z-30 backdrop-blur-xl border-b px-6 py-4 bg-[oklch(var(--background))]/80 border-[oklch(var(--border))]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[oklch(var(--foreground))]">
                WorkSpace 대시보드
              </h1>
              <p className="text-sm text-[oklch(var(--muted-foreground))]">
                업무 관리 시스템
              </p>
            </div>
            <ThemeToggleButton />
          </div>
        </header>

        {/* 메인 */}
        <main className="p-6 min-h-screen bg-[oklch(var(--background))] text-[oklch(var(--foreground))]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
