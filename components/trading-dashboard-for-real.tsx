'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { CryptoChart } from '@/components/crypto-chart'
import { ForexChart } from '@/components/forex-chart'
import { GoldChart } from '@/components/gold-chart'
import { ReallTradeModal } from './trade-modal-for reall'
import { useAuth } from '@/hooks/useAuth'
import type { TradeResult, Asset } from '@/lib/api-two'

interface Market {
  symbol: string
  name: string
  price: number
  change: number
}

interface TradeWithSymbol extends TradeResult {
  assetSymbol: string
}

interface TradingDashboardProps {
  tab: 'crypto' | 'forex' | 'gold'
}

export function ReallTradingDashboard({ tab }: TradingDashboardProps) {
  const { user, isAuthenticated, token } = useAuth()
  const [userTrades, setUserTrades] = useState<TradeWithSymbol[]>([])

  const [availableBalance, setavailableBalance] = useState<number>(0)
  const [totalTrades, setTotalTrades] = useState<number>(0)

  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [markets, setMarkets] = useState<Market[]>([])
  const [bids, setBids] = useState<[string, string][]>([])
  const [asks, setAsks] = useState<[string, string][]>([])
  const [trades, setTrades] = useState<{ price: number; amount: number }[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'buy' | 'sell'>('buy')
  const [searchQuery, setSearchQuery] = useState('')

  /* ================= FETCH USER BALANCE ================= */
  const fetchBalance = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success && data.data?.balance !== undefined) {
        setavailableBalance(data.data.balance)
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }, [token])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  /* ================= FETCH USER TRADES ================= */

  /* ================= FETCH USER TRADES ================= */
const fetchUserTrades = useCallback(async () => {
  if (!token || !user?.id) return

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/trades/user/${user.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const data = await res.json()

    if (data.success) {
      setUserTrades(data.data.trades || [])
      setTotalTrades(data.data.totalTrades || 0)
    }
  } catch (err) {
    console.error('Failed to fetch trades:', err)
  }
}, [token, user?.id])

  

  /* ================= FETCH MARKETS ================= */
  useEffect(() => {
    if (tab !== 'crypto') return
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr')
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data) as any[]
      const marketList: Market[] = data
        .filter(t => t.s.endsWith('USDT'))
        .map(t => ({
          symbol: t.s.slice(0, -4) + '/USDT',
          name: t.s.slice(0, -4),
          price: parseFloat(t.c),
          change: parseFloat(t.P),
        }))
      setMarkets(marketList)
    }
    return () => ws.close()
  }, [tab])

  /* ================= ORDER BOOK ================= */
  useEffect(() => {
    if (!selectedPair) return
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedPair.replace('/', '').toLowerCase()}@depth20@100ms`)
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      setBids(data.bids)
      setAsks(data.asks)
    }
    return () => ws.close()
  }, [selectedPair])

  /* ================= RECENT TRADES ================= */
  useEffect(() => {
    if (!selectedPair) return
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedPair.replace('/', '').toLowerCase()}@trade`)
    ws.onmessage = (msg) => {
      const t = JSON.parse(msg.data)
      setTrades(prev => [{ price: parseFloat(t.p), amount: parseFloat(t.q) }, ...prev].slice(0, 20))
    }
    return () => ws.close()
  }, [selectedPair])

  /* ================= FILTER MARKETS ================= */
  const filteredMarkets = useMemo(() => {
    return markets.filter(
      m =>
        m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [markets, searchQuery])

  const currentPrice = markets.find(m => m.symbol === selectedPair)?.price ?? 0
  const currentChange = markets.find(m => m.symbol === selectedPair)?.change ?? 0

  /* ================= HANDLE TRADE COMPLETE ================= */


  
  
  /* ================= HANDLE TRADE COMPLETE ================= */
const handleTradeComplete = async () => {
  setTotalTrades(prev => prev + 1)

  await fetchBalance()
  await fetchUserTrades()
}




  /* ================= ASSET FOR MODAL ================= */
  const assetForModal: Asset = {
    symbol: selectedPair.split('/')[0],
    name: selectedPair.split('/')[0],
    price: currentPrice,
    assetClass: tab,
  }

  return (
    <>
      {/* ================= TOP BALANCE HEADER ================= */}
      

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT MARKETS */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 sticky top-24">
            <input
              type="text"
              placeholder="Search pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white mb-4"
            />
            <div className="space-y-2 max-h-[80vh] overflow-y-auto">
              {filteredMarkets.map(m => (
                <button
                  key={m.symbol}
                  onClick={() => setSelectedPair(m.symbol)}
                  className={`w-full px-3 py-2 rounded ${selectedPair === m.symbol ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-slate-800'}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-white text-sm font-medium">{m.name}</div>
                      <div className="text-slate-400 text-xs">{m.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">{m.price.toFixed(2)}</div>
                      <div className={`text-xs ${m.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER CHART */}
        <div className="lg:col-span-2">
          {tab === 'crypto' && <CryptoChart pair={selectedPair} price={currentPrice} change24h={currentChange} />}
          {tab === 'forex' && <ForexChart pair={selectedPair} price={currentPrice} change24h={currentChange} />}
          {tab === 'gold' && <GoldChart pair={selectedPair} price={currentPrice} change24h={currentChange} />}
        </div>

        {/* RIGHT TRADE PANEL */}
        <div className="space-y-6">
          {/* Order Book */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4">Order Book</h3>
            <div className="flex gap-2 max-h-[60vh] overflow-y-auto">
              <div className="flex-1">
                {bids.map(([p, a], i) => (
                  <div key={i} className="flex justify-between text-xs text-red-400">
                    <span>{parseFloat(p).toFixed(2)}</span>
                    <span>{parseFloat(a).toFixed(6)}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                {asks.map(([p, a], i) => (
                  <div key={i} className="flex justify-between text-xs text-green-400">
                    <span>{parseFloat(p).toFixed(2)}</span>
                    <span>{parseFloat(a).toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Panel */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4">Trade {selectedPair}</h3>
            <div className="flex gap-2">
              {(['buy', 'sell'] as const).map(type => (
                <button
                  key={type}
                  disabled={!isAuthenticated || !user}
                  onClick={() => {
                    setModalType(type)
                    setModalOpen(true)
                  }}
                  className={`flex-1 py-2 rounded font-semibold text-white ${type === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-white">
              Available Balance:{' '}
              <span className="text-green-400 font-semibold">{availableBalance.toFixed(2)} USDT</span>
            </div>
          </div>

          {/* User Recent Trades */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-6">
            <h3 className="text-white font-semibold mb-4">Your Recent Trades</h3>
            {userTrades.length === 0 ? (
              <p className="text-slate-400 text-sm">No trades yet.</p>
            ) : (
              userTrades.slice(0, 10).map((t) => (
                <div key={t.tradeId} className="flex justify-between text-xs mb-1">
                  <span className="text-white">{t.assetSymbol}</span>
                  <span className={t.outcome === 'WIN' ? 'text-green-400' : 'text-red-400'}>
                    {t.profitLossAmount.toFixed(2)}
                  </span>
                  <span className="text-slate-400">{new Date(t.completedAt).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
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
