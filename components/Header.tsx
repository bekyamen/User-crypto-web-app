'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { Bell, Settings, LogOut } from 'lucide-react'
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
  const pathname = usePathname() // <-- current path
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeTab, setActiveTab] = useState<'crypto' | 'forex' | 'gold'>('crypto')
  const notificationRef = useRef<HTMLDivElement>(null)

  const handleSignOut = () => {
    console.log('Sign out clicked')
  }

  // use pathname instead of router.asPath
  const linkClass = (href: string) =>
    pathname === href ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'

  return (
    <header className="border-b border-slate-700/50 sticky top-0 z-40 bg-gradient-to-b from-slate-950 to-slate-900/80 backdrop-blur">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Bit Trading Logo"
              width={120}
              height={120}
              className="rounded-lg"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-8 text-sm flex-1 ml-8">
            <Link href="/home" className={linkClass("/home")}>Home</Link>
            <Link href="/trade" className={linkClass("/trade")}>Trade</Link>
            <Link href="/market-report" className={linkClass("/market-report")}>Market</Link>
            <Link href="/news" className={linkClass("/news")}>News</Link>
            <Link href="/assets" className={linkClass("/assets")}>Assets</Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/settings")}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-white"
            >
              <Settings size={20} />
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNotifications(!showNotifications)
                }}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-white relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 text-white font-semibold border-b border-slate-700">Notifications</div>
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <li key={n.id} className="px-4 py-2 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                          {n.message}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-4 text-center text-slate-400">No notifications</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition text-red-500 hover:text-red-400"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        
      </div>
    </header>
  )
}