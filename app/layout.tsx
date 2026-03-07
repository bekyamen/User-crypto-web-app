import React from "react"
import type { Metadata } from 'next'
import Script from "next/script"
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
      url: '/iconlogo.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      url: '/iconlogo.png',
      sizes: '64x64',
      type: 'image/png',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme Loader */}
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

        <Providers>
          <HeaderWrapper />
          <main>{children}</main>
        </Providers>

        <Analytics />

        {/* Smartsupp Live Chat */}
        <Script id="smartsupp-chat" strategy="afterInteractive">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '4802880d6fd3fc3e78183535f42c045d9e53f7d4';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];
              c=d.createElement('script');
              c.type='text/javascript';
              c.charset='utf-8';
              c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';
              s.parentNode.insertBefore(c,s);
            })(document);
          `}
        </Script>

      </body>
    </html>
  )
}