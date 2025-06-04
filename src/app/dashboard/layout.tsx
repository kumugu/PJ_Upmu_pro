'use client'
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useTheme } from "@/hooks/use-theme"
import React from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { theme } = useTheme()

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <Sidebar />

            <div className="lg:pl-72">
                <DashboardHeader />

                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}