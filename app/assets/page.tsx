'use client'

import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Zap,
  Settings,
  Eye,
  EyeOff,
  Bell,
  LogOut,
} from 'lucide-react'
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function AssetsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // -----------------------------
  // Hooks (always called first)
  // -----------------------------
  const [balance, setBalance] = useState<number>(0)
  const [showBalance, setShowBalance] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  // -----------------------------
  // PAGE PROTECTION
  // -----------------------------
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.replace("/login")
    }
  }, [session, status, router])

  // -----------------------------
  // Close notification dropdown on outside click
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // -----------------------------
  // Fetch user balance
  // -----------------------------
  useEffect(() => {
    const fetchBalance = async () => {
      if (!session?.user) return

      try {
        const token = (session as any)?.accessToken
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
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
  }, [session])

  // -----------------------------
  // Early return while loading or unauthenticated
  // -----------------------------
  if (status === "loading" || !session) return null

  // -----------------------------
  // Helper variables
  // -----------------------------
  const linkClass = (path: string) =>
    `transition ${
      pathname === path
        ? "text-blue-400 font-semibold"
        : "text-slate-400 hover:text-white"
    }`

  const fullName = session?.user?.name || ""
  const firstName = fullName.split(" ")[0] || "User"
  const email = session?.user?.email || ""
  const avatarLetter = firstName.charAt(0).toUpperCase()

  const handleSignOut = () => {
    signOut({ redirect: false })
    router.push('/login')
  }

  // -----------------------------
  // Render JSX
  // -----------------------------
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_70%)] text-white">
      <main className="max-w-7xl mx-auto px-7 py-10">

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Assets Overview
          </h1>
          <p className="text-slate-400 mt-2">
            Manage your portfolio, deposits, withdrawals and earnings
          </p>
        </div>

        {/* Profile + Portfolio */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          {/* User Card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-blue-500/40 transition">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                {avatarLetter}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{firstName}</h2>
                <p className="text-slate-400 text-sm">{email}</p>
              </div>
              <div className="ml-auto">
                <Link href="/settings" className="p-2 rounded-lg hover:bg-white/10 transition">
                  <Settings className="w-5 h-5 text-slate-400 hover:text-white transition" />
                </Link>
              </div>
            </div>
          </div>

          {/* Portfolio Card */}
          <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-300 uppercase tracking-wider">Total Portfolio Value</p>
                <div className="flex items-end gap-3 mt-4">
                  <h3 className="text-5xl font-extrabold tracking-tight">
                    {showBalance
                      ? balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "••••"}
                  </h3>
                  <span className="text-lg text-slate-300">USDT</span>
                </div>
              </div>

              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              {[
                { href: "/assets/deposit", icon: ArrowDown, label: "Deposit" },
                { href: "/assets/withdraw", icon: ArrowUp, label: "Withdraw" },
                { href: "/assets/transfer", icon: Zap, label: "Transfer" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-200"
                >
                  <item.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-slate-300">{item.label}</span>
                </Link>
              ))}

              <Link
                href="/assets/convert"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-200"
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-purple-400"
                >
                  <path d="M3.5 2v6h6"></path>
                  <path d="M20.5 22v-6h-6"></path>
                  <path d="M20.236 3.456a9 9 0 0 0-12.864 0c-3.606 3.606-3.584 9.432 0 13.036 3.584 3.605 9.252 3.624 12.864 0"></path>
                </svg>
                <span className="text-xs text-slate-300">Convert</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Funding Account", desc: "Deposit & Withdraw", value: "0.00 USD" },
            { title: "Unified Trading", desc: "Trade with unified wallet", value: "0.00 USD" },
            { title: "Earn", desc: "Passive income products", value: "0.00 USD" },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{card.desc}</p>
              <p className="text-2xl font-bold mt-4 text-blue-400">{card.value}</p>
            </div>
          ))}

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Invested Products</h3>
              <p className="text-slate-400 text-sm mt-1">No active investments</p>
            </div>
            <div className="w-3 h-16 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
          </div>
        </div>
      </main>
    </div>
  )
}