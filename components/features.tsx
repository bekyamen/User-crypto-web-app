import { Zap, Percent, TrendingUp, Smartphone } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-second order execution',
    color: 'text-blue-400'
  },
  {
    icon: Percent,
    title: 'Low Fees',
    description: 'Starting from 0.1% trading fees',
    color: 'text-orange-400'
  },
  {
    icon: TrendingUp,
    title: 'Advanced Charts',
    description: 'Professional trading tools',
    color: 'text-green-400'
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Trade anywhere, anytime',
    color: 'text-purple-400'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 hover:bg-slate-900/70 transition"
              >
                <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
