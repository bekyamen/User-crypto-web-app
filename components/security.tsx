import { Lock, Shield, CheckCircle } from 'lucide-react'

const securityFeatures = [
  {
    icon: Lock,
    title: 'Bank-Level Security',
    description: 'Multi-layer encryption and cold storage for maximum protection of your assets',
    color: 'text-blue-400'
  },
  {
    icon: Shield,
    title: '2FA Protection',
    description: 'Two-factor authentication and advanced security protocols keep your account safe',
    color: 'text-blue-500'
  },
  {
    icon: CheckCircle,
    title: 'Regulated & Compliant',
    description: 'Fully compliant with international regulations and industry best practices',
    color: 'text-purple-400'
  }
]

export function SecuritySection() {
  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-blue-400">Security </span>
            <span className="text-slate-100">& Trust</span>
          </h2>
          <p className="text-slate-400">
            Your funds and data are protected with industry-leading security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 hover:bg-slate-900/70 transition"
              >
                <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
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
