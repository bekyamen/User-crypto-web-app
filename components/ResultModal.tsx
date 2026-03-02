'use client'

import React from 'react'
import { X } from 'lucide-react'
import { type TradeResult } from '@/lib/api-two'

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: TradeResult
  assetPrice: number
  deliverySeconds: number
  expectedPercent: number
}

export function ResultModal({
  isOpen,
  onClose,
  result,
  deliverySeconds,
  expectedPercent,
}: ResultModalProps) {
  if (!isOpen) return null

  const isProfit = result.profitLossAmount > 0
  const profitColor = isProfit ? 'text-emerald-400' : 'text-red-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-blue-900 bg-gradient-to-b from-[#0b1d33] to-[#050b18] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-blue-900 bg-[#050b18] p-5">
          <h2 className="text-xl font-bold text-white">Trade Result</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 p-6">
          <div className={`text-2xl font-bold ${profitColor}`}>
            {isProfit ? 'You Won!' : 'You Lost'}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
            <div>Trade Type:</div>
            <div className="font-semibold text-white">{result.type.toUpperCase()}</div>

            <div>Amount:</div>
            <div className="font-semibold text-white">{result.amount.toLocaleString()} USDT</div>

            <div>Fee:</div>
            <div className="font-semibold text-white">{result.profitLossPercent ?? expectedPercent}%</div>

            <div>Delivery Time:</div>
            <div className="font-semibold text-white">{deliverySeconds} s</div>

            <div>Profit:</div>
            <div className={`font-semibold ${profitColor}`}>
              {result.profitLossAmount.toLocaleString()} USDT
            </div>

            <div>Buy Time:</div>
            <div className="font-semibold text-white">
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/40 mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}