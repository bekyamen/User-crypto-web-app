'use client'

import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from 'react'
import { ArrowDown, ArrowUp, Zap, Settings, Eye, EyeOff, ChevronRight, Bell, LogOut } from 'lucide-react'
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function AssetsPage() {

  const pathname = usePathname()
  
  const linkClass = (path: string) =>
    `transition ${
      pathname === path
        ? "text-blue-400 font-semibold"
        : "text-slate-400 hover:text-white"
    }`

  const { data: session } = useSession()

  const fullName = session?.user?.name || ""
  const firstName = fullName.split(" ")[0] || "User"
  const email = session?.user?.email || ""
  const avatarLetter = firstName.charAt(0).toUpperCase()

  const router = useRouter()
  const [showBalance, setShowBalance] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notificationRef = useRef<HTMLDivElement>(null)

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700/50 sticky top-0 z-40 bg-gradient-to-b from-slate-950 to-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            </div>

            <nav className="flex items-center gap-4 sm:gap-8 text-sm flex-1 ml-8">
              <Link href="/home" className={linkClass("/home")}>
                Home
              </Link>
            
              <Link href="/your-trading" className={linkClass("/your-trading")}>
                Trade
              </Link>
            
              <Link href="/market-report" className={linkClass("/market-report")}>
                Market
              </Link>
            
              <Link href="/news" className={linkClass("/news")}>
                News
              </Link>
            
              <Link href="/assets" className={linkClass("/assets")}>
                Assets
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/settings")}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-white"
              >
                <Settings size={20} />
              </button>

              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-white relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                    <div className="p-2 text-white font-semibold border-b border-slate-700">Notifications</div>
                    <ul className="divide-y divide-slate-700 max-h-64 overflow-y-auto">
                      <li className="p-2 hover:bg-slate-700 cursor-pointer">no Notification</li>
                      
                    </ul>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Assets</h1>
          <p className="text-slate-400">Manage your wallet, deposits, and withdrawals</p>
        </div>

        {/* User Profile Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">{avatarLetter}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg">{firstName}</h2>
              <p className="text-slate-400 text-sm">{email}</p>
            </div>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-slate-400 text-sm mb-2">PORTFOLIO</p>
                <p className="text-slate-400 text-xs mb-4">Total Assets</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="text-5xl font-bold text-white">{showBalance ? '0.00' : '••••'}</h3>
                  <span className="text-slate-400">USD</span>
                </div>
                <p className="text-slate-400 text-xs">≈ 0.00000000 BTC</p>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition"
              >
                {showBalance ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
              </button>
            </div>

            {/* P&L */}
            <div className="mb-6 pb-6 border-b border-slate-700/50">
              <p className="text-slate-400 text-xs mb-2">Today's P&L</p>
              <div className="flex items-baseline gap-2">
                <span className="text-green-400 font-semibold">+0.04 USD</span>
                <span className="text-green-400 text-sm">(+0.02%)</span>
              </div>
            </div>

            {/* Available Balances */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-slate-400 text-xs mb-2">Available</p>
                <p className="text-white font-bold text-lg">0.00 USD</p>
                <p className="text-slate-400 text-xs mt-1">Can trade & withdraw</p>
              </div>
              <div>
                <p className="text-white text-xs mb-2">In Use</p>
                <p className="text-white font-bold text-lg">0.00 USD</p>
                <p className="text-slate-400 text-xs mt-1">USD liquidity from deposits</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <Link href="/assets/deposit" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800/50 transition group">
                <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
                  <ArrowDown className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                </div>
                <span className="text-slate-400 text-xs text-center">Deposit</span>
              </Link>

              <Link href="/assets/withdraw" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800/50 transition group">
                <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
                  <ArrowUp className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                </div>
                <span className="text-slate-400 text-xs text-center">Withdraw</span>
              </Link>

              <Link href="/assets/transfer" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800/50 transition group">
                <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
                  <Zap className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                </div>
                <span className="text-slate-400 text-xs text-center">Transfer</span>
              </Link>

              <Link href="/assets/convert" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800/50 transition group">
                <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-hover:text-blue-400"><path d="M3.5 2v6h6"></path><path d="M20.5 22v-6h-6"></path><path d="M20.236 3.456a9 9 0 0 0-12.864 0c-3.606 3.606-3.584 9.432 0 13.036 3.584 3.605 9.252 3.624 12.864 0"></path></svg>
                </div>
                <span className="text-slate-400 text-xs text-center">Convert</span>
              </Link>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            {/* Account Settings Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6 hover:border-slate-600 transition cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition">Account Settings</h3>
                  <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition" />
              </div>
            </div>

            {/* Security */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6 hover:border-slate-600 transition cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition">Security</h3>
                  <p className="text-slate-400 text-sm mt-1">Enable two-factor authentication</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition" />
              </div>
            </div>

            {/* Verification */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6 hover:border-slate-600 transition cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition">Verification</h3>
                  <p className="text-slate-400 text-sm mt-1">Complete KYC verification</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="space-y-6">
          {/* Funding Account */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Funding</h3>
              <button className="text-blue-400 hover:text-blue-300 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6">
              <p className="text-white font-semibold mb-2">0.00 USD</p>
              <p className="text-slate-400 text-sm">Deposit and withdraw from external sources</p>
            </div>
          </div>

          {/* Unified Trading */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Unified Trading</h3>
              <button className="text-blue-400 hover:text-blue-300 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6">
              <p className="text-white font-semibold mb-2">0.00 USD</p>
              <p className="text-slate-400 text-sm">Trade cryptocurrencies with unified account</p>
            </div>
          </div>

          {/* Invested Products */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Invested Products</h3>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6 flex items-center justify-between">
              <div className="w-2 h-16 bg-gradient-to-b from-blue-500 to-slate-600 rounded-full"></div>
              <p className="text-slate-400 text-sm flex-1 ml-4">No invested products at the moment</p>
            </div>
          </div>

          {/* Earn */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Earn</h3>
              <button className="text-blue-400 hover:text-blue-300 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700/50 p-6">
              <p className="text-white font-semibold mb-2">0.00 USD</p>
              <p className="text-slate-400 text-sm">Earn passive income from your holdings</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
