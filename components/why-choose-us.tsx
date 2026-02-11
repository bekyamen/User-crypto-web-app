import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function WhyChooseUsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-slate-100">Why Traders </span>
            <span className="text-orange-400">Choose Us</span>
          </h2>
          <p className="text-slate-400">
            Compare and see the difference
          </p>
        </div>

        <div className="mb-12">
          <Link href="#market">
            <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold px-8 py-6">
              View Full Market Overview
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Benefits */}
          <div className="space-y-6">
            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h3 className="text-xl font-bold text-white mb-2">
                Institutional-Grade Tools
              </h3>
              <p className="text-slate-400">
                Access the same professional trading tools used by major financial institutions worldwide.
              </p>
            </div>

            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h3 className="text-xl font-bold text-white mb-2">
                Lightning-Fast Execution
              </h3>
              <p className="text-slate-400">
                Execute trades in milliseconds with our high-speed trading infrastructure.
              </p>
            </div>

            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h3 className="text-xl font-bold text-white mb-2">
                24/7 Dedicated Support
              </h3>
              <p className="text-slate-400">
                Our expert support team is always available to help you succeed in your trading journey.
              </p>
            </div>
          </div>

          {/* Right side - Market Stats */}
          <div className="relative">
            <div className="sticky top-32 space-y-6">
              <div className="border-2 border-slate-700 rounded-lg p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
                <p className="text-blue-400 font-semibold mb-2">MARKET INSIGHT</p>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Real-Time Market Data
                </h3>
                <p className="text-slate-400 mb-6">
                  Get up-to-the-second market data, advanced analytics, and price alerts to help you make informed trading decisions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-slate-300">Live price feeds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-slate-300">Advanced charting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span className="text-slate-300">Price alerts & notifications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-slate-300">Market analysis tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
