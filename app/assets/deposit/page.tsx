'use client'

import { useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type CoinType = 'BTC' | 'ETH' | 'USDT'
type NetworkType = 'BTC' | 'ERC20' | 'TRC20'

interface WalletData {
  coin: CoinType
  network: NetworkType
  address: string
  qrImage: string
  minDepositUsd?: number
}

export default function DepositPage() {
  const { token } = useAuth()

  const [selectedCrypto, setSelectedCrypto] = useState<CoinType>('BTC')
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('BTC')

  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [amount, setAmount] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  /* ---------------- NETWORK OPTIONS ---------------- */

  const getNetworks = (coin: CoinType): NetworkType[] => {
    if (coin === 'BTC') return ['BTC']
    if (coin === 'ETH') return ['ERC20']
    if (coin === 'USDT') return ['ERC20', 'TRC20']
    return ['BTC']
  }

  /* ---------------- FETCH WALLET ---------------- */

  const fetchWallet = async (coin: CoinType, network: NetworkType) => {
    if (!token) return

    try {
      setLoadingWallet(true)
      setError(null)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/deposit/wallet/${coin}/${network}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setWalletData(data.data)
    } catch (err) {
      setWalletData(null)
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet')
    } finally {
      setLoadingWallet(false)
    }
  }

  useEffect(() => {
    fetchWallet(selectedCrypto, selectedNetwork)
  }, [selectedCrypto, selectedNetwork, token])

  /* ---------------- COPY ADDRESS ---------------- */

  const handleCopy = async () => {
    if (!walletData?.address) return
    await navigator.clipboard.writeText(walletData.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ---------------- SUBMIT DEPOSIT ---------------- */

  const handleDepositSubmit = async () => {
    if (!token) return

    if (!amount || !transactionHash || !proofFile) {
      setError('Please fill all fields and upload proof image')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      const formData = new FormData()
      formData.append('coin', selectedCrypto)
      formData.append('network', selectedNetwork)
      formData.append('amount', amount)
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
      if (!res.ok) throw new Error(data.message)

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

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold">Deposit Crypto</h1>

        {/* Select Coin */}
        <div>
          <label className="text-sm text-slate-400">Select Crypto</label>
          <select
            value={selectedCrypto}
            onChange={(e) => {
              const coin = e.target.value as CoinType
              setSelectedCrypto(coin)
              const networks = getNetworks(coin)
              setSelectedNetwork(networks[0])
            }}
            className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          >
            <option value="BTC">BTC - Bitcoin</option>
            <option value="ETH">ETH - Ethereum</option>
            <option value="USDT">USDT - Tether</option>
          </select>
        </div>

        {/* Select Network */}
        <div>
          <label className="text-sm text-slate-400">Select Network</label>
          <select
            value={selectedNetwork}
            onChange={(e) =>
              setSelectedNetwork(e.target.value as NetworkType)
            }
            className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          >
            {getNetworks(selectedCrypto).map((net) => (
              <option key={net} value={net}>
                {net}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {/* QR Code */}
        <div className="w-full h-80 bg-white rounded-lg flex items-center justify-center">
          {loadingWallet ? (
            <p className="text-gray-500">Loading QR Code...</p>
          ) : walletData?.qrImage ? (
            <img
              src={walletData.qrImage}
              alt="QR Code"
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <p className="text-gray-500">No QR code available</p>
          )}
        </div>

        {/* Address */}
        {walletData?.address && (
          <div>
            <label className="text-sm text-slate-400">
              {walletData.coin} ({walletData.network}) Address
            </label>

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

        {/* 🔥 Dynamic Warning Section */}
        {walletData && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm space-y-2 text-slate-300">
            <p>• Send only {walletData.coin} to this address</p>
            <p>• Network: {walletData.network}</p>
            <p>
              • Minimum deposit:{' '}
              {walletData.minDepositUsd ?? 10} USD
            </p>
          </div>
        )}

        {/* Deposit Form */}
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter deposit amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Transaction Hash"
            value={transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProofFile(e.target.files?.[0] || null)
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
          />

          <button
            onClick={handleDepositSubmit}
            disabled={submitting}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold"
          >
            {submitting ? 'Submitting...' : 'Submit Deposit'}
          </button>
        </div>
      </div>
    </div>
  )
}