'use client'
import React from "react"
import { Sidebar } from "@/src/components/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-synerque-dark dark:to-synerque-base">
            <Sidebar />
            
            {/* 메인 콘텐츠 영역 */}
            <div className="lg:pl-72 transition-all duration-300">
                {/* 헤더 */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-synerque-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-synerque-base px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                대시보드
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                업무 현황을 한눈에 확인하세요
                            </p>
                        </div>
                        
                        {/* 헤더 액션 */}
                        <div className="flex items-center gap-4">
                            {/* 알림 버튼 */}
                            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-synerque-hover rounded-xl transition-colors">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5h5m-5-5V7a4 4 0 00-8 0v10h8z" />
                                </svg>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            </button>
                            
                            {/* 프로필 버튼 */}
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-sm">👤</span>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* 메인 콘텐츠 */}
                <main className="p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}