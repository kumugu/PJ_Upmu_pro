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
    <div className="relative animate-fade-in">
      {/* 배경 글로우 효과 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-lg"></div>
      
      {/* 메인 폼 카드 */}
      <div className="relative backdrop-blur-xl bg-white/10 dark:bg-synerque-dark/80 border border-white/20 dark:border-synerque-base/50 rounded-3xl p-8 shadow-2xl">
        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {type === 'login' ? '로그인' : '회원가입'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {type === 'login' ? '계정에 로그인하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm text-center backdrop-blur-sm animate-slide-up">
            {error}
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
              이메일 주소
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="
                  w-full px-4 py-3 rounded-xl 
                  bg-white/20 dark:bg-synerque-base/50 
                  border border-white/30 dark:border-synerque-base
                  backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                  transition-all duration-200
                  placeholder-gray-400 dark:placeholder-gray-500
                  text-gray-900 dark:text-white
                "
                placeholder="your@email.com"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="
                  w-full px-4 py-3 rounded-xl 
                  bg-white/20 dark:bg-synerque-base/50 
                  border border-white/30 dark:border-synerque-base
                  backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                  transition-all duration-200
                  placeholder-gray-400 dark:placeholder-gray-500
                  text-gray-900 dark:text-white
                "
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className={`
              w-full mt-8 py-3 px-6 rounded-xl font-semibold text-white
              bg-gradient-to-r from-blue-500 to-purple-500
              hover:from-blue-600 hover:to-purple-600
              shadow-lg hover:shadow-xl
              transition-all duration-300
              transform hover:scale-[1.02] active:scale-[0.98]
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                처리중...
              </div>
            ) : (
              type === 'login' ? '로그인' : '회원가입'
            )}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="mt-8 text-center">
          {type === 'login' && onSignupClick && (
            <p className="text-gray-600 dark:text-gray-300">
              아직 계정이 없나요?{' '}
              <button
                type="button"
                onClick={onSignupClick}
                className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline"
              >
                회원가입
              </button>
            </p>
          )}
          {type === 'signup' && onLoginClick && (
            <p className="text-gray-600 dark:text-gray-300">
              이미 계정이 있나요?{' '}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline"
              >
                로그인
              </button>
            </p>
          )}
        </div>

        {/* 소셜 로그인 옵션 (선택사항) */}
        <div className="mt-8 pt-6 border-t border-white/20 dark:border-synerque-base/50">
          <div className="flex items-center justify-center gap-4">
            <button className="w-12 h-12 bg-white/10 hover:bg-white/20 dark:bg-synerque-base/50 dark:hover:bg-synerque-hover rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button className="w-12 h-12 bg-white/10 hover:bg-white/20 dark:bg-synerque-base/50 dark:hover:bg-synerque-hover rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            소셜 계정으로 빠른 로그인
          </p>
        </div>
      </div>
    </div>
  )
}