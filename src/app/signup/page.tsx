'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from "@/src/lib/supabase/client"
import { AuthForm } from '@/src/components/auth-form'

export default function SignupPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('회원가입 실패: ' + error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <AuthForm 
        type="signup"
        onSubmit={handleSubmit}
        error={error}
        onLoginClick={() => router.push('/login')}
      />
    </div>
  )
}
