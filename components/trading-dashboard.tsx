'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CryptoDashboard } from '@/components/crypto-chart'
import { ForexDashboard } from '@/components/forex-chart'
import { GoldDashboard } from '@/components/gold-chart'
import { TradeModal } from './trade-modal'
import type { TradeResult, Asset } from '@/lib/api-two'
import type { User } from '@/hooks/useAuth'

interface TradeWithSymbol extends TradeResult {
  assetSymbol: string
}

interface TradingDashboardProps {
  tab: 'crypto' | 'forex' | 'gold'
  user: User
  token: string
}

export function TradingDashboard({ tab, user, token }: TradingDashboardProps) {
  const [tradeType, setTradeType] = useState<'DEMO' | 'REAL'>('DEMO')
  const [userTrades, setUserTrades] = useState<TradeWithSymbol[]>([])
  const [userBalance, setUserBalance] = useState(0)
  const [totalTrades, setTotalTrades] = useState(0)
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'buy' | 'sell'>('buy')

  const isReady = !!user && !!token
  if (!isReady) return null

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        // Use DEMO or REAL balances independently
        setUserBalance(tradeType === 'DEMO' ? data.data.demoBalance : data.data.realBalance)
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }, [token, tradeType])

  useEffect(() => {
    if (isReady) fetchBalance()
  }, [fetchBalance, isReady])

  /* ================= FETCH USER TRADES ================= */
  const fetchUserTrades = useCallback(async () => {
    if (!token || !user?.id) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trade-sim/user/${user.id}?tradeType=${tradeType.toLowerCase()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      if (data.success) {
        const parsed = data.data.trades.map((t: TradeResult) => ({
          ...t,
          assetSymbol: t.asset.symbol,
        }))
        setUserTrades(parsed)
        setTotalTrades(data.data.totalTrades || parsed.length)
      }
    } catch (err) {
      console.error('Failed to fetch trades:', err)
    }
  }, [token, user?.id, tradeType])

  useEffect(() => {
    if (isReady) fetchUserTrades()
  }, [fetchUserTrades, isReady])

  /* ================= SELECT ASSET ================= */
  const assetForModal: Asset = {
    symbol: selectedPair.split('/')[0],
    name: selectedPair.split('/')[0],
    price: 0,
    assetClass: tab,
  }

  return (
    <>
      {/* ================= TOP BALANCE HEADER ================= */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between shadow-lg shadow-green-900/10">
        <div>
          <div className="text-slate-400 text-sm uppercase tracking-wide">
            {tradeType === 'DEMO' ? 'Demo Balance' : 'Real Balance'}
          </div>
          <div className="text-4xl font-bold text-green-400 mt-2">{userBalance.toFixed(2)}</div>
          <div className="text-slate-500 text-sm mt-1">
            {tradeType === 'DEMO'
              ? 'Practice trading with virtual funds'
              : 'Real trading with actual funds'}
          </div>
        </div>

        <div className="flex gap-4 mt-4 lg:mt-0">
          <div className="bg-purple-900/40 border border-purple-700 px-4 py-3 rounded-lg text-center">
            <div className="text-xs text-purple-300">Trading Mode</div>
            <div className="text-purple-400 font-semibold">
              {tradeType === 'DEMO' ? 'Practice' : 'Real Trading'}
            </div>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-700 px-4 py-3 rounded-lg text-center">
            <div className="text-xs text-emerald-300">Total Trades</div>
            <div className="text-emerald-400 font-semibold">{totalTrades}</div>
          </div>
        </div>
      </div>

      {/* ================= CHART SECTION ================= */}
      <div className="mb-6">
        {tab === 'crypto' && <CryptoDashboard />}
        {tab === 'forex' && <ForexDashboard />}
        {tab === 'gold' && <GoldDashboard />}
      </div>

      {/* ================= TRADE + RECENT TRADES ================= */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trade Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Trade</h3>
          <div className="flex gap-2">
            {(['buy', 'sell'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  setModalType(type)
                  setModalOpen(true)
                }}
                className={`flex-1 py-2 rounded font-semibold text-white ${
                  type === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm text-white">
            Available Balance:{' '}
            <span className="text-green-400 font-semibold">{userBalance.toFixed(2)} USDT</span>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Your Recent Trades</h3>
          {userTrades.length === 0 ? (
            <p className="text-slate-400 text-sm">No trades yet.</p>
          ) : (
            userTrades.slice(0, 10).map(t => (
              <div key={t.tradeId} className="flex justify-between text-xs mb-2">
                <span>{t.assetSymbol}</span>
                <span className={t.outcome === 'WIN' ? 'text-green-400' : 'text-red-400'}>
                  {t.profitLossAmount?.toFixed(2) ?? '—'}
                </span>
                <span className="text-slate-400">{new Date(t.completedAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= TRADE MODAL ================= */}
      {modalOpen && (
        <TradeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          asset={assetForModal}
          userBalance={userBalance}
          tradeType={tradeType}
          token={token}
          userId={user.id}
          onBalanceUpdate={(newBal) => setUserBalance(newBal)}
          onTradeComplete={fetchUserTrades}
        />
      )}
    </>
  )
}