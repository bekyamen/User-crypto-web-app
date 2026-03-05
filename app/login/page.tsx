// app/login/page.jsx
import { Suspense } from 'react'
import LoginFormClient from '@/components/LoginFormClient'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Loading login form...</div>
      </div>
    }>
      <LoginFormClient />
    </Suspense>
  )
}