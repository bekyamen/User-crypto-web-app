// app/api/market/prices/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids') || 'bitcoin,ethereum'
    const vs_currencies = searchParams.get('vs_currencies') || 'usd'
    const include_24hr_change = searchParams.get('include_24hr_change') || 'true'
    const include_24hr_vol = searchParams.get('include_24hr_vol') || 'true'
    const include_market_cap = searchParams.get('include_market_cap') || 'true'

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currencies}&include_24hr_change=${include_24hr_change}&include_24hr_vol=${include_24hr_vol}&include_market_cap=${include_market_cap}`

    const res = await fetch(url)
    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
