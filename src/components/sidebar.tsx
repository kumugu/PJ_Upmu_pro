'use client'
import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <nav>
        <ul>
          <li>
            <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              대시보드
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="block py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              설정
            </Link>
          </li>
          {/* 추가 메뉴 */}
        </ul>
      </nav>
    </aside>
  )
}
