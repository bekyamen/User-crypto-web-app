'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type Coin = 'BTC' | 'ETH' | 'USDT'

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
  fee: number
  minWithdrawalUSD: number
}

const NETWORKS: Record<Coin, NetworkInfo[]> = {
  BTC: [{ value: 'BTC', label: 'Bitcoin Network', fee: 0.0005, minWithdrawalUSD: 10 }],
  ETH: [{ value: 'ERC20', label: 'Ethereum (ERC20)', fee: 0.005, minWithdrawalUSD: 10 }],
  USDT: [
    { value: 'TRC20', label: 'TRON (TRC20)', fee: 1, minWithdrawalUSD: 10 },
    { value: 'ERC20', label: 'Ethereum (ERC20)', fee: 5, minWithdrawalUSD: 10 },
  ],
}

export default function WithdrawPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  const [authChecked, setAuthChecked] = useState(false)
  const [balance, setBalance] = useState(0)
  const [selectedCoin, setSelectedCoin] = useState<Coin>('BTC')
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS.BTC[0])
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')

  const [priceBTC, setPriceBTC] = useState<number | null>(null)
  const [priceETH, setPriceETH] = useState<number | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(true)

  const [history, setHistory] = useState<WithdrawHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        router.replace('/login?redirect=/assets/withdraw')
      } else {
        setAuthChecked(true)
      }
    }
  }, [token, isLoading, router])

  /* ---------------- FETCH BALANCE ---------------- */
  useEffect(() => {
    if (!token) return
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setBalance(Number(data.data.balance))
      } catch (err) { console.error(err) }
    }
    fetchBalance()
  }, [token])

  /* ---------------- FETCH PRICES ---------------- */
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoadingPrice(true)
        const res = await fetch('/api/prices')
        const data = await res.json()
        setPriceBTC(data.btc)
        setPriceETH(data.eth)
      } catch (err) { console.error(err) }
      finally { setLoadingPrice(false) }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  /* ---------------- FETCH HISTORY ---------------- */
  const fetchHistory = async () => {
    if (!token) return
    try {
      setLoadingHistory(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/withdraw/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setHistory(data.data || [])
    } catch (err) {
      setError('Failed to load history')
    } finally { setLoadingHistory(false) }
  }
  useEffect(() => { fetchHistory() }, [token])

  /* ---------------- NETWORK UPDATE ---------------- */
  useEffect(() => {
    setSelectedNetwork(NETWORKS[selectedCoin][0])
  }, [selectedCoin])

  /* ---------------- EXCHANGE CALCULATION ---------------- */
  const receiveAmount = useMemo(() => {
    const amt = Number(amount)
    if (!amt || amt <= 0) return 0
    if (selectedCoin === 'USDT') return Math.max(amt - selectedNetwork.fee, 0)
    if (selectedCoin === 'BTC' && priceBTC) return Math.max(amt / priceBTC - selectedNetwork.fee, 0)
    if (selectedCoin === 'ETH' && priceETH) return Math.max(amt / priceETH - selectedNetwork.fee, 0)
    return 0
  }, [amount, selectedCoin, priceBTC, priceETH, selectedNetwork])

  /* ---------------- WITHDRAW ---------------- */
  const handleWithdraw = async () => {
    if (!token) return
    const amt = Number(amount)
    if (!address) return setError('Enter wallet address')
    if (!amt || amt <= 0) return setError('Enter valid amount')
    if (amt > balance) return setError('Insufficient balance')
    if (amt < selectedNetwork.minWithdrawalUSD) return setError(`Minimum withdrawal is $${selectedNetwork.minWithdrawalUSD}`)

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const body = {
        coin: selectedCoin,
        network: selectedNetwork.value,
        address,
        amount: selectedCoin === 'USDT' ? amt : receiveAmount,
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setSuccess('Withdrawal submitted successfully')
      setBalance(prev => prev - amt)
      setAddress('')
      setAmount('')
      fetchHistory()
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed')
    } finally { setLoading(false) }
  }

  if (!authChecked) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold">Withdraw Crypto</h1>

        {/* Balance */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-slate-400 text-sm">Available Balance</p>
          <p className="text-3xl font-bold mt-1">${balance.toFixed(2)}</p>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-yellow-200 text-sm space-y-1">
          <p>• Minimum withdrawal: 10 USD</p>
          <p>• Double-check address and network</p>
          <p>• Withdrawals are irreversible and processing time: 24-48 hours</p>
          <p>• Identity verification is required for withdrawals</p>
        </div>

        {/* Coin Select */}
        <select
          value={selectedCoin}
          onChange={e => setSelectedCoin(e.target.value as Coin)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
        >
          <option value="BTC">BTC - Bitcoin</option>
          <option value="ETH">ETH - Ethereum</option>
          <option value="USDT">USDT - Tether</option>
        </select>

        {/* Network */}
        <select
          value={selectedNetwork.value}
          onChange={e => {
            const net = NETWORKS[selectedCoin].find(n => n.value === e.target.value)
            if (net) setSelectedNetwork(net)
          }}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 mt-2"
        >
          {NETWORKS[selectedCoin].map(net => (
            <option key={net.value} value={net.value}>
              {net.label} • Fee: {net.fee}
            </option>
          ))}
        </select>

        {/* Address */}
        <input
          type="text"
          placeholder="Wallet address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 mt-2"
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 mt-2"
        />

        {/* Conversion */}
        {amount && (
          <p className="text-xs text-slate-400">
            {loadingPrice
              ? 'Fetching live exchange rate...'
              : selectedCoin === 'USDT'
              ? `You will receive: ${receiveAmount.toFixed(8)} USDT (after fee)`
              : `${amount} USDT ≈ ${receiveAmount.toFixed(8)} ${selectedCoin}`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex gap-2">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex gap-2">
            <CheckCircle size={18} />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Withdraw */}
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 mt-2"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? 'Processing...' : 'Withdraw'}
        </button>

        {/* History */}
        <div className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Withdrawal History</h2>
          {loadingHistory ? (
            <p className="text-slate-400">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-slate-400">No withdrawals yet</p>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-3"
              >
                <p className="font-semibold">
                  {item.amount} {item.coin} ({item.network})
                </p>
                <p className="text-xs text-slate-400 break-all">{item.address}</p>
                <p className="text-xs text-slate-400">Status: {item.status}</p>
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}