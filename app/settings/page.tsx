'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Clock, Copy, Share2, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import IdentityVerificationPage from './identity-verification/page'
import SpotHistoryPage from './spot-history/page'
import SecurityPage from './security/page'



type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | null

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function SettingsPage() {
  const { token } = useAuth()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'identity', label: 'Identity Verification', icon: '🔐' },
    { id: 'history', label: 'Spot History', icon: '📝' },
    { id: 'security', label: 'Security', icon: '🛡️' },
  ]

  const [totalWithdraw, setTotalWithdraw] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [balance, setBalance] = useState(0) // make balance stateful
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null)
  const [level2Completed, setLevel2Completed] = useState(false)
  const [securityScore, setSecurityScore] = useState(25)
  const [copiedCode, setCopiedCode] = useState(false)
  const [fetching, setFetching] = useState(true)
 
  const statCards = [
  {
  label: 'Total Deposits',
  value: `$${totalDeposits.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  icon: '⬇️',
},
 
{
  label: 'Total Withdrawals',
  value: `$${totalWithdraw.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  icon: '⬆️',
},

 
]

 const fetchVerification = async () => {
  if (!token) {
    setFetching(false)
    return
  }

  try {
    // =========================
    // LEVEL 1
    // =========================
    const res = await fetch(`${API_BASE_URL}/identity-verification/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    const data = await res.json().catch(() => null)

    if (res.ok) {
      setVerificationStatus(data.verification?.status || null)
    } else {
      setVerificationStatus(null)
    }

    // =========================
    // LEVEL 2 (NO STATUS, JUST EXISTS)
    // =========================
    const res2 = await fetch(`${API_BASE_URL}/identity-verification/level2/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (res2.ok) {
      const data2 = await res2.json()
      setLevel2Completed(!!data2.verification)
    } else {
      setLevel2Completed(false)
    }

  } catch (err) {
    console.error('Fetch verification error:', err)
    setVerificationStatus(null)
    setLevel2Completed(false)
  } finally {
    setFetching(false)
  }
}

  useEffect(() => {
    fetchVerification()
  }, [token])

  




  useEffect(() => {
  if (!token) return

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (data.success && data.data?.balance !== undefined) {
        setBalance(Number(data.data.balance))
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err)
      setBalance(0)
    }
  }

  fetchBalance()
fetchTotalDeposits()
fetchTotalWithdraw()
}, [token])



const fetchTotalDeposits = async () => {
  if (!token) return

  try {
    const res = await fetch(`${API_BASE_URL}/user/deposit/total`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    const data = await res.json()

    if (res.ok && data.success) {
      setTotalDeposits(Number(data.data?.totalDeposits || 0))
    } else {
      setTotalDeposits(0)
    }
  } catch (err) {
    console.error('Failed to fetch total deposits:', err)
    setTotalDeposits(0)
  }
}

const fetchTotalWithdraw = async () => {
  if (!token) return

  try {
    const res = await fetch(`${API_BASE_URL}/withdraw/total`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    const data = await res.json()

    if (res.ok && data.success) {
      setTotalWithdraw(Number(data.data?.totalWithdraw || 0))
    } else {
      setTotalWithdraw(0)
    }
  } catch (err) {
    console.error('Failed to fetch total withdraw:', err)
    setTotalWithdraw(0)
  }
}

  useEffect(() => {
  if (verificationStatus === 'APPROVED' && level2Completed) {
    setSecurityScore(100)
  } 
  else if (verificationStatus === 'APPROVED') {
    setSecurityScore(80)
  } 
  else if (verificationStatus === 'PENDING') {
    setSecurityScore(50)
  } 
  else if (verificationStatus === 'REJECTED') {
    setSecurityScore(30)
  } 
  else {
    setSecurityScore(25)
  }
}, [verificationStatus, level2Completed])

  const handleCopyCode = () => {
    navigator.clipboard.writeText('F1A7F06N')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // ===== Tab Content Renderer =====
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Stats Cards */}
            <div className="">
              {statCards.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Portfolio + Security */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Portfolio Performance */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📊</span>
                  <h2 className="text-lg font-semibold">Portfolio Performance</h2>
                </div>
                <div className="space-y-6">
                 <div>
  <p className="text-slate-400 text-sm mb-2">Total Balance</p>
  <p className="text-3xl font-bold">
    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </p>
  <p className="text-slate-400 text-xs">Available Funds</p>
</div>
                </div>
              </div>

              {/* Security Status */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🛡️</span>
                  <h2 className="text-lg font-semibold">Security Status</h2>
                </div>
                <div className="space-y-4">
                  {fetching ? (
                    <p className="text-slate-400 text-sm">Loading verification...</p>
                  ) : (
                    <>
                      <div className="flex justify-between mb-2">
                        <p className="text-slate-400 text-sm">Security Score</p>
                        <p className="font-semibold">{securityScore}%</p>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            securityScore >= 80
                              ? 'bg-green-500'
                              : securityScore >= 50
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${securityScore}%` }}
                        ></div>
                      </div>

                      {/* Status Items */}
                      <div className="space-y-3 pt-4 border-t border-slate-700/50">
                        {/* Email */}
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <CheckCircle size={18} className="text-green-400" />
                            <span>Email Verified</span>
                          </div>
                          <CheckCircle size={18} className="text-green-400" />
                        </div>

                        {/* Identity */}
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            {verificationStatus === 'APPROVED' ? (
                              <CheckCircle size={18} className="text-green-400" />
                            ) : verificationStatus === 'PENDING' ? (
                              <AlertCircle size={18} className="text-yellow-400" />
                            ) : (
                              <AlertCircle size={18} className="text-slate-400" />
                            )}
                            <span>Identity Verified</span>
                          </div>
                          <span
                            className={`font-semibold ${
                              verificationStatus === 'APPROVED'
                                ? 'text-green-400'
                                : verificationStatus === 'PENDING'
                                ? 'text-yellow-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {verificationStatus || 'NOT SUBMITTED'}
                          </span>
                        </div>

                        {/* 2FA */}
                        <div className="flex justify-between items-center">
  <div className="flex gap-2 items-center">
    {level2Completed ? (
      <CheckCircle size={18} className="text-green-400" />
    ) : (
      <AlertCircle size={18} className="text-slate-400" />
    )}
    <span>Final Verification</span>
  </div>
  <span
    className={`font-semibold ${
      level2Completed ? 'text-green-400' : 'text-slate-400'
    }`}
  >
    {level2Completed ? 'COMPLETED' : 'NOT COMPLETED'}
  </span>
</div>

                        <div className="pt-4 border-t border-slate-700/50 text-xs text-slate-400">
                          <p className="flex items-center gap-2">
                            <Clock size={14} /> Last login: Jan 31, 2026
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔔</span>
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-400">No notifications</p>
              </div>
            </div>

            {/* Referral Program */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔗</span>
                <h2 className="text-lg font-semibold">Referral Program</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Your Referral Code</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-900/50 border border-slate-600/50 rounded-lg px-4 py-2 flex items-center">
                      <span className="text-blue-400 font-mono font-bold">F1A7F06N</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Copy size={16} />
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Share2 size={16} />
                    </button>
                  </div>
                  {copiedCode && <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>}
                </div>
              </div>
            </div>
          </>
        )
      case 'identity':
        return (
          <IdentityVerificationPage />
        )
      case 'history':
        return (
          <SpotHistoryPage />
        )
      case 'security':
        return (
          <SecurityPage />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-slate-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
} 