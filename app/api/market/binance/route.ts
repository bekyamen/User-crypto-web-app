
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      cache: 'no-store'
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch Binance data' }, { status: 500 })
    }

    const data = await res.json()

    // Filter only USDT pairs
    const usdtPairs = data.filter((coin: any) =>
      coin.symbol.endsWith('USDT')
    )

    return NextResponse.json(usdtPairs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
