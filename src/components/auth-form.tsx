'use client'
import React, { useState } from 'react'

interface AuthFormProps {
  type: 'login' | 'signup'
  onSubmit: (email: string, password: string) => Promise<void>
  error?: string
  onSignupClick?: () => void
  onLoginClick?: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  error,
  onSignupClick,
  onLoginClick,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(email, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 bg-white rounded shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6">
        {type === 'login' ? '로그인' : '회원가입'}
      </h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <label className="block mb-2">
        이메일
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mt-1 w-full border rounded px-3 py-2"
          autoComplete="email"
        />
      </label>

      <label className="block mb-4">
        비밀번호
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="mt-1 w-full border rounded px-3 py-2"
          autoComplete="current-password"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading
          ? '처리중...'
          : type === 'login'
          ? '로그인'
          : '회원가입'}
      </button>

      {type === 'login' && onSignupClick && (
        <p className="mt-4 text-center text-sm">
          아직 계정이 없나요?{' '}
          <button
            type="button"
            onClick={onSignupClick}
            className="text-blue-600 underline"
          >
            회원가입
          </button>
        </p>
      )}

      {type === 'signup' && onLoginClick && (
        <p className="mt-4 text-center text-sm">
          이미 계정이 있나요?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-blue-600 underline"
          >
            로그인
          </button>
        </p>
      )}
    </form>
  )
}
