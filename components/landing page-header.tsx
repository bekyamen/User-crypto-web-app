'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import { ChevronDown, LogOut, Menu, X } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tradeOpen, setTradeOpen] = useState(false)
  const [financeOpen, setFinanceOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/newlogo-removebg-preview.png"
              alt="Bit Trading Logo"
              width={160}
              height={160}
              className="rounded-lg"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/market-report" className="text-slate-300 hover:text-white transition">
              Markets
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition">
                Trade <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/demo" className="block px-4 py-2 hover:bg-slate-700/50 rounded-t-xl">Crypto Trading</Link>
                <Link href="/demo" className="block px-4 py-2 hover:bg-slate-700/50">Forex Trading</Link>
                <Link href="/demo" className="block px-4 py-2 hover:bg-slate-700/50 rounded-b-xl">Gold Trading</Link>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition">
                Finance <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/assets/deposit" className="block px-4 py-2 hover:bg-slate-700/50 rounded-t-xl">Deposit</Link>
                <Link href="/assets/withdraw" className="block px-4 py-2 hover:bg-slate-700/50">Withdraw</Link>
                <Link href="/assets" className="block px-4 py-2 hover:bg-slate-700/50 rounded-b-xl">Assets</Link>
              </div>
            </div>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-transparent">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-4 pb-6 space-y-4 bg-slate-900 border-t border-slate-800">

          <Link href="/market-report" className="block py-2 text-slate-300 hover:text-white">
            Markets
          </Link>

          {/* Trade Dropdown */}
          <div>
            <button
              onClick={() => setTradeOpen(!tradeOpen)}
              className="flex justify-between w-full py-2 text-slate-300 hover:text-white"
            >
              Trade
              <ChevronDown className={`w-4 h-4 transition-transform ${tradeOpen ? "rotate-180" : ""}`} />
            </button>

            {tradeOpen && (
              <div className="ml-4 mt-2 space-y-2 text-sm text-slate-400">
                <Link href="/demo" className="block hover:text-white">Crypto Trading</Link>
                <Link href="/demo" className="block hover:text-white">Forex Trading</Link>
                <Link href="/demo" className="block hover:text-white">Gold Trading</Link>
              </div>
            )}
          </div>

          {/* Finance Dropdown */}
          <div>
            <button
              onClick={() => setFinanceOpen(!financeOpen)}
              className="flex justify-between w-full py-2 text-slate-300 hover:text-white"
            >
              Finance
              <ChevronDown className={`w-4 h-4 transition-transform ${financeOpen ? "rotate-180" : ""}`} />
            </button>

            {financeOpen && (
              <div className="ml-4 mt-2 space-y-2 text-sm text-slate-400">
                <Link href="/assets/deposit" className="block hover:text-white">Deposit</Link>
                <Link href="/assets/withdraw" className="block hover:text-white">Withdraw</Link>
                <Link href="/assets" className="block hover:text-white">Assets</Link>
              </div>
            )}
          </div>

          {/* Auth Mobile */}
          <div className="pt-4 border-t border-slate-800">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="w-full text-slate-300 hover:text-white">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}