'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { Bell, Settings, LogOut, Menu, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

interface Notification {
  id: string
  message: string
}

interface HeaderProps {
  notifications?: Notification[]
}

export default function Header({ notifications = [] }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const notificationRef = useRef<HTMLDivElement>(null)

  const handleSignOut = () => {
    router.push('/login')
  }

  const linkClass = (href: string) =>
    pathname === href
      ? 'text-white font-semibold'
      : 'text-slate-400 hover:text-white'

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="border-b border-slate-700/50 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/newlogo-removebg-preview.png"
              alt="Logo"
              width={120}
              height={40}
              className="rounded-lg"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm flex-1 ml-6">
            <Link href="/home" className={linkClass('/home')}>Home</Link>
            <Link href="/trade" className={linkClass('/trade')}>Trade</Link>
            <Link href="/market-report" className={linkClass('/market-report')}>Market</Link>
            <Link href="/news" className={linkClass('/news')}>News</Link>
            <Link href="/assets" className={linkClass('/assets')}>Assets</Link>
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push('/settings')}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-white"
            >
              <Settings size={18} />
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-white relative"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition text-red-500 hover:text-red-400"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition text-slate-300"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 bg-slate-950 border-t border-slate-800 space-y-4">

          <Link href="/home" className="block text-slate-300 hover:text-white">Home</Link>
          <Link href="/trade" className="block text-slate-300 hover:text-white">Trade</Link>
          <Link href="/market-report" className="block text-slate-300 hover:text-white">Market</Link>
          <Link href="/news" className="block text-slate-300 hover:text-white">News</Link>
          <Link href="/assets" className="block text-slate-300 hover:text-white">Assets</Link>

          <div className="border-t border-slate-800 pt-4 flex gap-4">
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-500 hover:text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}