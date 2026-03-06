import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import HeaderWrapper from './HeaderWrapper'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'BitorynFX Trading',
  description:
    'Professional trading platform for cryptocurrencies, forex, and commodities with institutional-grade tools and lightning-fast execution.',
  icons: [
    {
      url: '/iconlogo.png',  // small square PNG, e.g., 32x32
      sizes: '32x32',
      type: 'image/png',
    },
    {
      url: '/iconlogo.png',  // optional higher res for retina
      sizes: '64x64',
      type: 'image/png',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || 
                  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>

      <body className="font-sans antialiased text-white">
        {/* ✅ MOVE Providers ABOVE EVERYTHING */}
        <Providers>
          <HeaderWrapper />
          <main>{children}</main>
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}