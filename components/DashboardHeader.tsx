'use client'

interface DashboardHeaderProps {
  userBalance: number
  totalTrades: number
}

export function DashboardHeader({
  userBalance,
  totalTrades,
}: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between shadow-lg shadow-green-900/10">
      
      <div>
        <div className="text-slate-400 text-sm uppercase tracking-wide">
          Demo Balance
        </div>

        <div className="text-4xl font-bold text-green-400 mt-2">
          {userBalance.toFixed(2)} USDT
        </div>

        <div className="text-slate-500 text-sm mt-1">
          Practice trading with virtual funds
        </div>
      </div>

      <div className="flex gap-4 mt-4 lg:mt-0">

        <div className="bg-purple-900/40 border border-purple-700 px-4 py-3 rounded-lg text-center">
          <div className="text-xs text-purple-300">Trading Mode</div>
          <div className="text-purple-400 font-semibold">Practice</div>
        </div>

        <div className="bg-emerald-900/40 border border-emerald-700 px-4 py-3 rounded-lg text-center">
          <div className="text-xs text-emerald-300">Total Trades</div>
          <div className="text-emerald-400 font-semibold">
            {totalTrades}
          </div>
        </div>

      </div>
    </div>
  )
}