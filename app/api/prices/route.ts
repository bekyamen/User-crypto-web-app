import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      { next: { revalidate: 30 } } // cache 30s
    )

    const data = await res.json()

    return NextResponse.json({
      btc: data.bitcoin.usd,
      eth: data.ethereum.usd
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}