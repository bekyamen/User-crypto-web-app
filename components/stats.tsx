import { Users, DollarSign, CheckCircle, Globe } from 'lucide-react'

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '2M+',
      label: 'Active Traders',
      color: 'text-blue-400'
    },
    {
      icon: DollarSign,
      value: '$50B+',
      label: 'Trading Volume',
      color: 'text-orange-400'
    },
    {
      icon: CheckCircle,
      value: '99.9%',
      label: 'Uptime',
      color: 'text-green-400'
    },
    {
      icon: Globe,
      value: '150+',
      label: 'Countries',
      color: 'text-purple-400'
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="border border-slate-700 rounded-lg p-6 bg-slate-900/50 hover:bg-slate-900/70 transition"
              >
                <Icon className={`w-8 h-8 ${stat.color} mb-4`} />
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
