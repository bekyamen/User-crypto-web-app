'use client'

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from 'react'
import { Settings, Bell, LogOut } from 'lucide-react'
import Header from '@/components/Header'
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
      {/* Trading Tabs */}
         <div className="flex items-center gap-6 border-t border-slate-700/50 pt-2 md:pt-4 lg:pt-6 px-4 md:px-6 lg:px-8">
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


