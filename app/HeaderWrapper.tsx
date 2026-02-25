'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function HeaderWrapper() {
  const pathname = usePathname()

  // Hide header on home page
  if (pathname === '/') return null
  if (pathname === '/login') return null
  return <Header />
}