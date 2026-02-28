'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ArrowDownUp, Info, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Listbox } from '@headlessui/react'

interface Crypto {
  name: string
  symbol: string
  icon: string
  balance: number
}

export default function ConvertPage() {
  // Crypto list
  const cryptoList: Crypto[] = [
    { name: 'Tether', symbol: 'USDT', icon: '₮', balance: 1000 },
    { name: 'Bitcoin', symbol: 'BTC', icon: '₿', balance: 0.5 },
    { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', balance: 5 },
    { name: 'BNB', symbol: 'BNB', icon: '⬥', balance: 10 },
  ]

  const [fromCrypto, setFromCrypto] = useState<Crypto>(cryptoList[0])
  const [toCrypto, setToCrypto] = useState<Crypto>(cryptoList[1])
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const CONVERSION_FEE = 0.001 // 0.1%

  // Fetch real-time rates from CoinGecko
  const fetchRates = async () => {
    try {
      const symbols = cryptoList.map(c => c.symbol.toLowerCase()).join(',')
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin&vs_currencies=usd`
      )
      const data = await res.json()
      // Map symbol to USD
      setExchangeRates({
        USDT: data.tether.usd,
        BTC: data.bitcoin.usd,
        ETH: data.ethereum.usd,
        BNB: data.binancecoin.usd,
      })
    } catch (err) {
      console.error('Failed to fetch rates', err)
    }
  }

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate conversion with fee
  useEffect(() => {
    if (!fromAmount || isNaN(Number(fromAmount))) {
      setToAmount('')
      return
    }
    if (!exchangeRates[fromCrypto.symbol] || !exchangeRates[toCrypto.symbol]) return

    const usdValue = Number(fromAmount) * exchangeRates[fromCrypto.symbol]
    const toValue = usdValue / exchangeRates[toCrypto.symbol]
    const afterFee = toValue * (1 - CONVERSION_FEE)
    setToAmount(afterFee.toFixed(8))
  }, [fromAmount, fromCrypto, toCrypto, exchangeRates])

  // Swap function
  const handleSwap = () => {
    const temp = fromCrypto
    setFromCrypto(toCrypto)
    setToCrypto(temp)
    setFromAmount('')
    setToAmount('')
  }

  // Confirm conversion
  const handleConfirmConversion = () => {
    if (!fromAmount || Number(fromAmount) < 1) {
      setError('Minimum conversion amount is $1.00')
      return
    }
    if (fromCrypto.symbol === toCrypto.symbol) {
      setError('From and To crypto must be different')
      return
    }
    setError(null)
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(`Converted ${fromAmount} ${fromCrypto.symbol} to ${toAmount} ${toCrypto.symbol} successfully!`)
      setFromAmount('')
      setToAmount('')
      setTimeout(() => setSuccess(null), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
     

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* From */}
        <div className="space-y-2">
          <label className="text-slate-400 text-sm">From</label>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-2">
            <Listbox value={fromCrypto} onChange={setFromCrypto}>
              <div className="relative">
                <Listbox.Button className="w-full flex items-center justify-between bg-slate-900/50 text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{fromCrypto.icon}</span>
                    <span>{fromCrypto.symbol}</span>
                  </div>
                  <ChevronLeft className="rotate-90" size={16} />
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg max-h-60 overflow-auto">
                  {cryptoList.map(c => (
                    <Listbox.Option
                      key={c.symbol}
                      value={c}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 text-sm ${active ? 'bg-slate-700' : ''}`
                      }
                    >
                      {c.symbol} - {c.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-slate-900/50 text-white text-2xl font-semibold px-4 py-2 rounded-lg"
              value={fromAmount}
              onChange={e => setFromAmount(e.target.value)}
            />
            <p className="text-slate-400 text-xs">
              Balance: {fromCrypto.balance} {fromCrypto.symbol}
            </p>
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center bg-slate-900/50 text-blue-500 hover:bg-blue-500/10"
          >
            <ArrowDownUp size={24} />
          </button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-slate-400 text-sm">To</label>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-2">
            <Listbox value={toCrypto} onChange={setToCrypto}>
              <div className="relative">
                <Listbox.Button className="w-full flex items-center justify-between bg-slate-900/50 text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{toCrypto.icon}</span>
                    <span>{toCrypto.symbol}</span>
                  </div>
                  <ChevronLeft className="rotate-90" size={16} />
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg max-h-60 overflow-auto">
                  {cryptoList.map(c => (
                    <Listbox.Option
                      key={c.symbol}
                      value={c}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 text-sm ${active ? 'bg-slate-700' : ''}`
                      }
                    >
                      {c.symbol} - {c.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            <p className="text-white text-2xl font-semibold">{toAmount || '0.00'}</p>
            <p className="text-slate-400 text-xs">
              1 {fromCrypto.symbol} ≈ {(Number(toAmount) / Number(fromAmount) || 0).toFixed(6)} {toCrypto.symbol}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3 text-sm">
          <p className="text-slate-300">• Conversions use real-time market rates</p>
          <p className="text-slate-300">• Small conversion fee may apply (0.1%)</p>
          <p className="text-slate-300">• Minimum conversion amount: $1.00 USD</p>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-2">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex gap-2">
            <CheckCircle size={20} className="text-green-400" />
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirmConversion}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg"
        >
          {loading ? 'Processing...' : 'Confirm Conversion'}
        </button>
      </main>
    </div>
  )
}