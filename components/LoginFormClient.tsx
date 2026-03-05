'use client'

import React, { useState, useEffect, Suspense } from 'react'  // Add Suspense here
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// Define the interface here
interface LoginResult {
  success: boolean
  error?: string
}

// Separate component that uses useSearchParams
function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/demo'

  const { login, isLoading, user, error: authError } = useAuth()

  const [email, setEmail] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('rememberMe') || ''
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(email !== '')
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirect)
    }
  }, [isLoading, user, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = await login(email, password)

    if (result.success) {
      if (remember) localStorage.setItem('rememberMe', email)
      else localStorage.removeItem('rememberMe')
      router.replace(redirect)
    } else {
      setError(result.error || 'Login failed')
    }
  }

  if (isLoading || user) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md p-10 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-3 text-center">Welcome Back</h1>
        <p className="text-slate-400 text-sm text-center mb-6">Sign in to your account</p>

        {(error || authError) && (
          <div className="mb-4 p-3 text-red-400 text-sm rounded-lg bg-red-500/10 border border-red-500/30">
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="text-blue-400 hover:text-blue-300"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-orange-500 hover:opacity-90 transition shadow-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="px-4 text-sm text-slate-400">Or continue with</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <button
          className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-3 text-white font-medium"
          onClick={() => alert('Google login placeholder')}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up here
            </Link>
          </p>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

// Main export with Suspense
export default function LoginFormClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Loading login form...</div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  )
}