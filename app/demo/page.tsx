'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { TradingDashboard } from '@/components/trading-dashboard'
import { TradeModal } from '@/components/trade-modal'

export default function DemoPage() {
  const router = useRouter()
  const { user, token, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'crypto' | 'forex' | 'gold'>('crypto')
  const [tradeModal, setTradeModal] = useState({
    isOpen: false,
    type: 'buy' as 'buy' | 'sell',
    asset: { symbol: 'BTC', name: 'Bitcoin', price: 0, assetClass: 'crypto' } 
  })

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [isLoading, user, router])

  if (isLoading || !user || !token) return null // prevent flicker

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">


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

      <TradingDashboard tab={activeTab} user={user} token={token} />

      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal({ ...tradeModal, isOpen: false })}
        type={tradeModal.type}
        asset={tradeModal.asset}
      />
    </div>
  )
}