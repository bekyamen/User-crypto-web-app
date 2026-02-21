'use client'

import { useEffect, useState } from 'react'
import { Copy, Upload } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface WalletData {
  coin: string
  address: string
  qrImage: string
}

export default function DepositPage() {
  const { token } = useAuth()

  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT'>('BTC')
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Deposit form state
  // Deposit form state
const [amount, setAmount] = useState<string>('') // <-- empty string
  const [transactionHash, setTransactionHash] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch wallet + QR from backend
  const fetchWallet = async (coin: string) => {
    if (!token) return
    try {
      setLoadingWallet(true)
      setError(null)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/deposit/wallet/${coin}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch wallet')
      setWalletData(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet fetch failed')
      setWalletData(null)
    } finally {
      setLoadingWallet(false)
    }
  }

  useEffect(() => {
    fetchWallet(selectedCrypto)
  }, [selectedCrypto, token])

  const handleCopy = async () => {
    if (!walletData?.address) return
    await navigator.clipboard.writeText(walletData.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDepositSubmit = async () => {
    if (!token) return
    if (!amount || !transactionHash || !proofFile) {
      setError('Please fill all deposit fields and upload proof')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      const formData = new FormData()
      formData.append('coin', selectedCrypto)
      formData.append('amount', amount.toString())
      formData.append('transactionHash', transactionHash)
      formData.append('proofImage', proofFile)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/deposit/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Deposit failed')
      setSuccess('Deposit request submitted successfully!')
      setAmount('')
      setTransactionHash('')
      setProofFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold">Deposit Crypto</h1>
        <p className="text-slate-400 text-sm">
          Select a cryptocurrency to deposit. Scan the QR code or copy the address.
        </p>

        {/* Crypto Selector */}
        <div>
          <label className="text-sm text-slate-400">Select Crypto</label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value as any)}
            className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          >
            <option value="BTC">BTC - Bitcoin</option>
            <option value="ETH">ETH - Ethereum</option>
            <option value="USDT">USDT - Tether</option>
          </select>
        </div>

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {/* QR Image */}
        <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center mt-4">
          {loadingWallet ? (
            <p className="text-gray-400 text-lg">Loading QR Code...</p>
          ) : walletData?.qrImage ? (
            <img
              src={walletData.qrImage}
              alt={`${walletData.coin} QR Code`}
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-gray-400">No QR code available</p>
          )}
        </div>

        {/* Wallet Address */}
        {walletData?.address && (
          <div className="mt-4">
            <label className="text-sm text-slate-400">{walletData.coin} Address</label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={walletData.address}
                readOnly
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm"
              />
              <button
                onClick={handleCopy}
                className="px-4 bg-slate-700 rounded-lg"
              >
                {copied ? 'Copied' : <Copy size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Deposit Form */}
        <div className="mt-6 space-y-4">
          <label className="text-sm text-slate-400">Amount</label>
          <input
  type="number"
  placeholder="Enter deposit amount" // <-- helps user see they can type
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm"
/>

          <label className="text-sm text-slate-400">Deposit Adress</label>
          <input
            type="text"
            value={ transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm"
          />

          <label className="text-sm text-slate-400 flex items-center gap-2">
            Proof Image <Upload size={16} />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm"
          />

          <button
            onClick={handleDepositSubmit}
            disabled={submitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {submitting ? 'Submitting...' : 'Submit Deposit'}
          </button>
        </div>
      </div>
    </div>
  )
}
