'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  fundsPassword: string
}

export function useAuth() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(status === 'loading')
  const [error, setError] = useState<string | null>(null)

  // Sync session
  useEffect(() => {
    if (session?.user) {
      setUser({
  id: session.user.id as string,
  name: session.user.name ?? '',
  email: session.user.email ?? '',
  role: (session.user.role as 'USER' | 'ADMIN') ?? 'USER',
})

      setToken(session.accessToken || null)
    } else {
      setUser(null)
      setToken(null)
    }
    setIsLoading(false)
  }, [session])

  // ✅ Register → Redirect to login
  const register = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      await authApi.register(data)

      router.push('/login') // Redirect to login page
      return { success: true }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Registration failed'

      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (!res?.error) {
      router.push('/demo') // after login go to demo
      return { success: true }
    } else {
      setError('Invalid email or password')
      return { success: false, error: 'Invalid credentials' }
    }
  }

  // ✅ Logout
  const logout = () => {
    signOut({ redirect: true, callbackUrl: '/login' })
  }

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
