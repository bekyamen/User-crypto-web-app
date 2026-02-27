'use client'

import { useState, useEffect, useCallback } from 'react'
import { CryptoDashboard } from '@/components/crypto-chart'
import ForexDashboard from '@/components/forex-chart'
import GoldDashboard from '@/components/gold-chart'
import { ReallTradeModal } from '@/components/trade-modal-for reall'
import { useAuth } from '@/hooks/useAuth'
import type { TradeResult, Asset } from '@/lib/api-two'

interface TradeWithSymbol extends TradeResult {
  assetSymbol: string
}

interface TradingDashboardProps {
  tab: 'crypto' | 'forex' | 'gold'
}

export function ReallTradingDashboard({ tab }: TradingDashboardProps) {
  const { user, isAuthenticated, token } = useAuth()

  /* ================= LOCAL ACTIVE TAB ================= */
  const [activeTab, setActiveTab] = useState<'crypto' | 'forex' | 'gold'>(tab)

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  /* ================= STATE ================= */
  const [userTrades, setUserTrades] = useState<TradeWithSymbol[]>([])
  const [availableBalance, setAvailableBalance] = useState<number>(0)

  const [selectedPair, setSelectedPair] = useState('BTC/USDT')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'buy' | 'sell'>('buy')

  /* ================= AUTO CHANGE PAIR BASED ON TAB ================= */
  useEffect(() => {
    if (activeTab === 'crypto') setSelectedPair('BTC/USDT')
    if (activeTab === 'forex') setSelectedPair('EUR/USD')
    if (activeTab === 'gold') setSelectedPair('XAU/USD')
  }, [activeTab])

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = await res.json()

      if (data.success && data.data?.balance !== undefined) {
        setAvailableBalance(data.data.balance)
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }, [token])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  /* ================= FETCH USER TRADES ================= */
  const fetchUserTrades = useCallback(async () => {
    if (!token || !user?.id) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trade-sim/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = await res.json()

      if (data.success) {
        setUserTrades(data.data.trades || [])
      }
    } catch (err) {
      console.error('Failed to fetch trades:', err)
    }
  }, [token, user?.id])

  useEffect(() => {
    fetchUserTrades()
  }, [fetchUserTrades])

  /* ================= TRADE COMPLETE ================= */
  const handleTradeComplete = async () => {
    await fetchBalance()
    await fetchUserTrades()
  }

  /* ================= ASSET FOR MODAL ================= */
  const assetForModal: Asset = {
    symbol: selectedPair.split('/')[0],
    name: selectedPair.split('/')[0],
    price: 0,
    assetClass: activeTab,
  }

  return (
    <>
      {/* ================= TAB SWITCHER ================= */}
      <div className="flex gap-3 mb-6">
        {(['crypto', 'forex', 'gold'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-md font-semibold capitalize ${
              activeTab === t
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ================= CHART ================= */}
      <div className="mb-6">
        {activeTab === 'crypto' && <CryptoDashboard />}
        {activeTab === 'forex' && <ForexDashboard />}
        {activeTab === 'gold' && <GoldDashboard />}
      </div>

      {/* ================= TRADE SECTION ================= */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Trade Panel */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">
            Trade {selectedPair}
          </h3>

          <div className="flex gap-2">
            {(['buy', 'sell'] as const).map(type => (
              <button
                key={type}
                disabled={!isAuthenticated || !user}
                onClick={() => {
                  setModalType(type)
                  setModalOpen(true)
                }}
                className={`flex-1 py-2 rounded font-semibold text-white ${
                  type === 'buy'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm text-white">
            Available Balance:{' '}
            <span className="text-green-400 font-semibold">
              {availableBalance.toFixed(2)} USDT
            </span>
          </div>
        </div>

        {/* User Trades */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">
            Your Recent Trades
          </h3>

          {userTrades.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No trades yet.
            </p>
          ) : (
            userTrades.slice(0, 10).map(t => (
              <div
                key={t.tradeId}
                className="flex justify-between text-xs mb-1"
              >
                <span className="text-white">{t.assetSymbol}</span>

                <span
                  className={
                    t.outcome === 'WIN'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {t.profitLossAmount !== null
                    ? t.profitLossAmount.toFixed(2)
                    : '—'}
                </span>

                <span className="text-slate-400">
                  {new Date(t.completedAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= TRADE MODAL ================= */}
      {modalOpen && (
        <ReallTradeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          asset={assetForModal}
          availableBalance={availableBalance}
          onTradeComplete={handleTradeComplete}
        />
      )}
    </>
  )
}