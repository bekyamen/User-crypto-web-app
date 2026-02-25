'use client'

import { useState, useEffect } from 'react'
import {
  TrendingDown,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpLeft,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type BaseTransaction = {
  id: string
  coin: string
  amount: number
  status: string
  createdAt: string
  network?: string
  address?: string
  fee?: number
  usdValue?: number
  reviewNote?: string | null
}

type Trade = {
  tradeId: string
  userId: string
  type: 'BUY' | 'SELL'
  asset: string
  amount: number
  expirationTime: number | null
  outcome: 'WIN' | 'LOSS'
  returnedAmount: number
  profitLossAmount: number
  profitLossPercent: number
  timestamp: string
  completedAt: string
}

export default function SpotHistoryPage() {
  const { token, user } = useAuth()

  const [activeTab, setActiveTab] = useState<
    'withdrawals' | 'deposits' | 'trades' | 'buy' | 'sell'
  >('withdrawals')

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const filters = [
    { id: 'withdrawals', label: 'Withdrawals', icon: TrendingDown },
    { id: 'trades', label: 'Trades', icon: ArrowUpRight },
    { id: 'deposits', label: 'Deposits', icon: TrendingUp },
    
  ]

  // =============================
  // API ROUTE MAPPER
  // =============================
  const getEndpoint = () => {
    switch (activeTab) {
      case 'withdrawals':
        return '/withdraw/my'
      case 'deposits':
        return '/deposit/my'
      case 'buy':
        return '/buy/my'
      case 'sell':
        return '/sell/my'
      default:
        return '/withdraw/my'
    }
  }

  // =============================
  // FETCH DATA
  // =============================
  const fetchData = async () => {
    if (!token) return
    setLoading(true)

    try {
      // ===== TRADES TAB (trade-sim endpoint) =====
      if (activeTab === 'trades') {
        const res = await fetch(
          `http://localhost:5000/api/trade-sim/user/${user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const json = await res.json()
        if (!res.ok) throw new Error(json.message)

        setData(json.data?.trades || [])
        setTotalPages(1)
        setLoading(false)
        return
      }

      // ===== OTHER TABS =====
      const res = await fetch(
        `http://localhost:5000/api${getEndpoint()}?page=${currentPage}&limit=${rowsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      setData(json.data || [])
      setTotalPages(json.pagination?.pages || 1)
    } catch (err) {
      console.error(err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab, currentPage, rowsPerPage, token])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">

        <div>
          <h1 className="text-2xl font-bold">Spot History</h1>
          <p className="text-slate-400 text-sm">
            View and manage your transaction history
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  setCurrentPage(1)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  active
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              {/* ===== TABLE HEAD ===== */}
              <thead className="bg-slate-900 border-b border-slate-800">
                {activeTab === 'trades' ? (
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400">ASSET</th>
                    <th className="px-6 py-4 text-left text-slate-400">TYPE</th>
                    <th className="px-6 py-4 text-left text-slate-400">EXP</th>
                    <th className="px-6 py-4 text-left text-slate-400">AMOUNT</th>
                    <th className="px-6 py-4 text-left text-slate-400">PROFIT</th>
                    <th className="px-6 py-4 text-left text-slate-400">STATUS</th>
                    <th className="px-6 py-4 text-left text-slate-400">DATE</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400">COIN</th>
                    <th className="px-6 py-4 text-left text-slate-400">AMOUNT</th>
                    <th className="px-6 py-4 text-left text-slate-400">STATUS</th>
                    <th className="px-6 py-4 text-left text-slate-400">DATE</th>
                  </tr>
                )}
              </thead>

              {/* ===== TABLE BODY ===== */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      No history available
                    </td>
                  </tr>
                ) : activeTab === 'trades' ? (
                  data.map((trade: Trade) => (
                    <tr
                      key={trade.tradeId}
                      className="border-b border-slate-800 hover:bg-slate-900"
                    >
                      <td className="px-6 py-4">{trade.asset}</td>

                      <td className={`px-6 py-4 font-semibold ${
                        trade.type === 'BUY'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {trade.type}
                      </td>

                      <td className="px-6 py-4">
                        {trade.expirationTime
                          ? `${trade.expirationTime}s`
                          : 'Market'}
                      </td>

                      <td className="px-6 py-4">${trade.amount}</td>

                      <td className={`px-6 py-4 font-semibold ${
                        trade.profitLossPercent >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {trade.profitLossPercent >= 0 ? '+' : ''}
                        {trade.profitLossPercent}%
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          trade.outcome === 'WIN'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.outcome}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(trade.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  data.map((item: BaseTransaction) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-800 hover:bg-slate-900"
                    >
                      <td className="px-6 py-4">{item.coin}</td>
                      <td className="px-6 py-4">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          item.status === 'APPROVED'
                            ? 'bg-green-500/20 text-green-400'
                            : item.status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}