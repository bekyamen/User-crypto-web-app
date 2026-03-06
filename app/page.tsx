import { Header } from '@/components/landing page-header'
import { MarketTicker } from '@/components/market-ticker'
import { Hero } from '@/components/hero'
import { StatsSection } from '@/components/stats'
import { FeaturesSection } from '@/components/features'
import { WhyChooseUsSection } from '@/components/why-choose-us'
import { TestimonialsSection } from '@/components/testimonials'
import { SecuritySection } from '@/components/security'
import { Footer } from '@/components/footer'
import { SupportChatbot } from '@/components/support-chatbot'
import { CryptoTable } from '@/components/crypto-table'
import { TopGainersSection } from '@/components/top-gainers'
import { NewListingsSection } from '@/components/new-listings'
import FloatingChat from '@/components/FloatingChat'
import { Container } from '@/components/container'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

      <MarketTicker />
      <Header />

      <main>

        {/* HERO */}
        <Container>
          <Hero />
        </Container>


        {/* MARKET DATA */}
        <section className="py-16">
          <Container>

            {/* Header */}
            <div className="mb-12 text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
                <span className="text-sm text-blue-400 font-medium">
                  Live Market Data
                </span>
              </div>

              <h2 className="text-4xl font-bold mb-4">
                <span className="text-slate-100">Catch Your Next </span>
                <span className="text-orange-400">Trading Opportunity</span>
              </h2>

              <p className="text-slate-400 text-lg max-w-2xl">
                Real-time market data and insights to help you make informed trading decisions
              </p>
            </div>

            {/* Crypto Table */}
            <div className="mb-12">
              <CryptoTable />
            </div>

            {/* Gainers + Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <TopGainersSection />
              <NewListingsSection />
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link href="#market">
                <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold px-8 py-6">
                  View Full Market Overview
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

          </Container>
        </section>


        {/* OTHER SECTIONS */}
        <Container>
          <StatsSection />
        </Container>

        <Container>
          <WhyChooseUsSection />
        </Container>

        <Container>
          <FeaturesSection />
        </Container>

        <Container>
          <TestimonialsSection />
        </Container>

        <Container>
          <SecuritySection />
        </Container>

      </main>

      <Footer />
      <SupportChatbot />
      <FloatingChat />

    </div>
  )
}