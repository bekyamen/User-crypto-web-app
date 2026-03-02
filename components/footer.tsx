import Link from 'next/link'
import { Mail } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-slate-900/70 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <Image
                src="/footerlogo.jpg"
                alt="Bit Trading Logo"
                width={200}
                height={260}
                className="rounded-lg"
                priority
              />
             
            </Link>
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
              {['Trade', 'Market', 'News', 'Help Center'].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              {['Deposit', 'Withdraw', 'Identity Verification', 'Trade History'].map((service) => (
                <li key={service}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {service}
                  </Link>
                </li>
              ))}
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
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear}-{currentYear + 1}{' '}
            <span className="text-blue-400 font-semibold">BitorynFX Trading</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            {['Terms of Service', 'Privacy Policy', 'Support'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}