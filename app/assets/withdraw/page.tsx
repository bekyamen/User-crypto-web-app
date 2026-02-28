'use client'

import { useEffect, useState, useMemo } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'

interface WithdrawHistoryItem {
  id: string
  coin: string
  network: string
  address: string
  amount: number
  status: string
  createdAt: string
}

interface NetworkInfo {
  value: string
  label: string
  description: string
  fee: number
}

const networks: Record<string, NetworkInfo[]> = {
  BTC: [
    {
      value: 'BTC',
      label: 'Bitcoin',
      description: 'Bitcoin Network • Fee: 0.0005 BTC',
      fee: 0.0005,
    },
  ],
  ETH: [
    {
      value: 'ERC20',
      label: 'Ethereum (ERC20)',
      description: 'Ethereum Network • Fee: 0.005 ETH',
      fee: 0.005,
    },
  ],
  USDT: [
    {
      value: 'TRC20',
      label: 'TRON (TRC20)',
      description: 'TRON Network • Fee: 1 USDT',
      fee: 1,
    },
    {
      value: 'ERC20',
      label: 'Ethereum (ERC20)',
      description: 'Ethereum Network • Fee: 5 USDT',
      fee: 5,
    },
  ],
}

export default function WithdrawPage() {
  const { token } = useAuth()
  const { data: session } = useSession()

  const [balance, setBalance] = useState<number>(0)
  const [selectedCoin, setSelectedCoin] = useState<'BTC' | 'ETH' | 'USDT'>('BTC')
  const [selectedNetwork, setSelectedNetwork] = useState(networks['BTC'][0])
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [history, setHistory] = useState<WithdrawHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const [priceBTC, setPriceBTC] = useState<number | null>(null)
  const [priceETH, setPriceETH] = useState<number | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(true)

  // =============================
  // Fetch Balance
  // =============================
  useEffect(() => {
    const fetchBalance = async () => {
      if (!session?.user) return
      try {
        const accessToken = (session as any)?.accessToken
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        const data = await res.json()
        if (data.success && data.data?.balance !== undefined) {
          setBalance(Number(data.data.balance))
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchBalance()
  }, [session])

  // =============================
  // Fetch Withdrawal History
  // =============================
  const fetchHistory = async () => {
    if (!token) return
    try {
      setLoadingHistory(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/withdraw/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setHistory(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [token])

  // =============================
  // Fetch Prices
  // =============================
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoadingPrice(true)
        const res = await fetch('/api/prices')
        const data = await res.json()
        if (data.btc) setPriceBTC(data.btc)
        if (data.eth) setPriceETH(data.eth)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingPrice(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  // =============================
  // Conversion Logic
  // =============================
  const netReceive = useMemo(() => {
    const amt = Number(amount)
    if (!amt || amt <= 0) return 0

    if (selectedCoin === 'USDT') {
      return Math.max(amt - selectedNetwork.fee, 0)
    }

    if (selectedCoin === 'BTC' && priceBTC) {
      return Math.max(amt / priceBTC - selectedNetwork.fee, 0)
    }

    if (selectedCoin === 'ETH' && priceETH) {
      return Math.max(amt / priceETH - selectedNetwork.fee, 0)
    }

    return 0
  }, [amount, selectedCoin, selectedNetwork, priceBTC, priceETH])

  // =============================
  // Handle Withdraw
  // =============================
  const handleWithdraw = async () => {
    if (!token) return

    const amt = Number(amount)

    if (!address || !amt || amt <= 0) {
      setError('Please enter valid details')
      return
    }

    if (amt > balance) {
      setError('Insufficient balance')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/withdraw`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coin: selectedCoin,
            network: selectedNetwork.value,
            address,
            amount: amt,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setSuccess('Withdrawal request submitted successfully!')
      setBalance((prev) => prev - amt)
      setAddress('')
      setAmount('')
      fetchHistory()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSelectedNetwork(networks[selectedCoin][0])
  }, [selectedCoin])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold">Withdraw Crypto</h1>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-slate-400 text-sm">Available Balance</p>
          <p className="text-3xl font-bold mt-1">${balance.toFixed(2)}</p>
        </div>

        <select
          value={selectedCoin}
          onChange={(e) =>
            setSelectedCoin(e.target.value as 'BTC' | 'ETH' | 'USDT')
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
        >
          <option value="BTC">BTC - Bitcoin</option>
          <option value="ETH">ETH - Ethereum</option>
          <option value="USDT">USDT - Tether</option>
        </select>

        <input
          type="text"
          placeholder="Withdrawal address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
        />

        <input
          type="number"
          placeholder="Amount (USDT)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
        />

        {amount && (
          <p className="text-xs text-slate-400">
            {loadingPrice
              ? 'Fetching live rate...'
              : `You will receive: ${netReceive.toFixed(8)} ${selectedCoin} (after fee)`}
          </p>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex gap-2">
            <AlertCircle size={18} className="text-red-400" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex gap-2">
            <CheckCircle size={18} className="text-green-400" />
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold"
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>

        {/* ================= Withdrawal History ================= */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Withdrawal History</h2>

          {loadingHistory ? (
            <p className="text-slate-400">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-slate-400">No withdrawals yet.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-3"
              >
                <p className="font-semibold">
                  {item.amount} {item.coin} ({item.network})
                </p>
                <p className="text-xs text-slate-400 break-all">
                  {item.address}
                </p>
                <p className="text-xs text-slate-400">
                  Status: {item.status}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}