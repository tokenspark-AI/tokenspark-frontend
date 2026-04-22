import { Cpu, Zap, Route, Clock } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { useI18n } from '@/i18n'

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <Card className="group cursor-pointer">
      <CardContent className="p-6 lg:p-8">
        <div className="w-10 h-10 rounded-lg bg-spark/10 flex items-center justify-center mb-4 text-spark group-hover:bg-spark/20 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-spark transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

const features = [
  {
    icon: <Cpu className="w-5 h-5" />,
    titleKey: 'agentSpark.runtime.title',
    descKey: 'agentSpark.runtime.desc',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    titleKey: 'agentSpark.routing.title',
    descKey: 'agentSpark.routing.desc',
  },
  {
    icon: <Route className="w-5 h-5" />,
    titleKey: 'agentSpark.fallback.title',
    descKey: 'agentSpark.fallback.desc',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    titleKey: 'agentSpark.monitoring.title',
    descKey: 'agentSpark.monitoring.desc',
  },
]

export default function AgentSpark() {
  const { t } = useI18n()
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-spark/30 bg-spark/5 mb-4">
            <span className="text-xs font-medium text-spark">{t('agentSpark.badge')}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {t('agentSpark.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('agentSpark.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Feature
              key={feature.titleKey}
              icon={feature.icon}
              title={t(feature.titleKey)}
              description={t(feature.descKey)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
