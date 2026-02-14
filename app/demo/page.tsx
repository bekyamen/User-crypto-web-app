'use client'

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from 'react'
import { Settings, Bell, LogOut } from 'lucide-react'

import { TradingDashboard } from '@/components/trading-dashboard'
import { TradeModal } from '@/components/trade-modal'
import { useAuth } from '@/hooks/useAuth'

export interface TradeModalData {
  isOpen: boolean
  type: 'buy' | 'sell'
  asset: {
    symbol: string
    name: string
    price: number
    assetClass: 'crypto' | 'forex' | 'gold'
  }
}

export default function DemoPage() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const linkClass = (path: string) =>
    `transition ${
      pathname === path
        ? "text-blue-400 font-semibold"
        : "text-slate-400 hover:text-white"
    }`

  const [activeTab, setActiveTab] = useState<'crypto' | 'forex' | 'gold'>('crypto')
  const [tradeModal, setTradeModal] = useState<TradeModalData>({
    isOpen: false,
    type: 'buy',
    asset: { symbol: 'BTC', name: 'Bitcoin', price: 0, assetClass: 'crypto' }
  })

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState<{ id: string; message: string }[]>([
    { id: '1', message: 'No notification' },
  ])
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Sign Out
  const handleSignOut = () => {
    router.push('/login')
  }

  const handleOpenTrade = (
    type: 'buy' | 'sell',
    userId: string,
    symbol: string,
    name: string,
    price: number,
    assetClass: 'crypto' | 'forex' | 'gold'
  ) => {
    if (!user) {
      alert('You must be logged in to place a trade.')
      return
    }

    setTradeModal({
      isOpen: true,
      type,
      asset: { symbol, name, price, assetClass }
    })
  }

  const handleCloseTrade = () => {
    setTradeModal({ ...tradeModal, isOpen: false })
  }

  if (isLoading) return <div className="text-white text-center py-20">Loading...</div>
  if (!user) return (
    <div className="text-center text-white py-20">
      You must be logged in to access the trading dashboard.
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
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
              <Link href="/demo" className={linkClass("/demo")}>Trade</Link>
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
                    e.stopPropagation() // prevent document click from immediately closing
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

          {/* Trading Tabs */}
          <div className="flex items-center gap-6 border-t border-slate-700/50 pt-0">
            {['crypto', 'forex', 'gold'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'crypto' | 'forex' | 'gold')}
                className={`px-4 py-3 text-sm font-medium transition relative ${
                  activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab === 'crypto' && '₿'}
                  {tab === 'forex' && '💱'}
                  {tab === 'gold' && '🏆'}
                  <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <TradingDashboard
          tab={activeTab}
          onTrade={(type, _userId, symbol, name, price, assetClass) =>
            handleOpenTrade(type, user.id, symbol, name, price, assetClass)
          }
        />
      </main>

      {/* Trade Modal */}
      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={handleCloseTrade}
        type={tradeModal.type}
        asset={tradeModal.asset}
      />
    </div>
  )
}



