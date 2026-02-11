import Link from 'next/link'
import { Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                Bit Trading
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Professional trading platform for cryptocurrencies, forex, and commodities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                  <span>Trade</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                  <span>Market</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                  <span>News</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                  <span>Help Center</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  Deposit
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  Withdraw
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  Identity Verification
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  Trade History
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Get the latest trading insights and market updates delivered to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear}-{currentYear + 1}{' '}
            <span className="text-blue-400 font-semibold">Bit trading</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-slate-400 hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
