'use client'

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from 'react'
import { Settings, Bell, LogOut } from 'lucide-react'

import { ReallTradingDashboard } from '@/components/trading-dashboard-for-real'
import { ReallTradeModal } from '@/components/trade-modal-for reall'
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

export default function ReallPage() {
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
      

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <ReallTradingDashboard
          tab={activeTab}
          onTrade={(type, _userId, symbol, name, price, assetClass) =>
            handleOpenTrade(type, user.id, symbol, name, price, assetClass)
          }
        />
      </main>

      {/* Trade Modal */}
      <ReallTradeModal
        isOpen={tradeModal.isOpen}
        onClose={handleCloseTrade}
        type={tradeModal.type}
        asset={tradeModal.asset}
      />
    </div>
  )
}


