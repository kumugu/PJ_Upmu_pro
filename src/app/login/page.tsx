'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/src/lib/supabase/client"
import { AuthForm } from "@/src/components/auth-form"

export default function LoginPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('로그인 실패: ' + error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-synerque-dark via-synerque-base to-gray-900 flex items-center justify-center p-4">
      {/* 배경 그라데이션 및 패턴 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1)_0%,transparent_50%)]"></div>
      
      {/* 플로팅 요소들 */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <AuthForm
          type="login"
          onSubmit={handleSubmit}
          error={error}
          onSignupClick={() => router.push('/signup')}
        />
      </div>
    </div>
  )
}