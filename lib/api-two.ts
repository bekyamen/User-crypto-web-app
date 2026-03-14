const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

/* ================= ASSET ================= */

export interface Asset {
  symbol: string
  name: string
  price: number
  assetClass: 'crypto' | 'forex' | 'gold'
}

/* ================= TRADE RESULT ================= */

export interface TradeResult {
  tradeId: string
  userId: string
  type: 'buy' | 'sell'
  asset: Asset
  amount: number
  expirationTime: number
  outcome: 'WIN' | 'LOSS'
  returnedAmount: number
  profitLossAmount: number
  profitLossPercent: number
  timestamp: string
  completedAt: string
  newBalance: number
  isDemo: boolean
}

/* ================= EXECUTE TRADE ================= */

export interface ExecuteTradeRequest {
  userId: string
  type: 'buy' | 'sell'
  asset: Asset
  amount: number
  expirationTime: number
  isDemo: boolean
  
}

export async function executeTrade(
  payload: ExecuteTradeRequest
): Promise<TradeResult> {
  const response = await fetch(`${API_BASE_URL}/trade-sim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Trade failed: ${text}`)
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message)
  }

  return data.data
}



