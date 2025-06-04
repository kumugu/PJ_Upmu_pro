'use client'
import React from 'react'

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">대시보드</h1>
      {/* 사용자 프로필, 알림, 로그아웃 등 */}
    </header>
  )
}
