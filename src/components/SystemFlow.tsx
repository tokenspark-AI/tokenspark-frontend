import { Send, Route, Calculator, Wallet, Cpu, ArrowRight, CheckCircle } from 'lucide-react'
import { useI18n } from '@/i18n'

interface StepProps {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  isLast: boolean
}

function FlowStep({ number, icon, title, description, isLast }: StepProps) {
  return (
    <div className="flex gap-4 lg:gap-6">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold shrink-0">
          {number}
        </div>
        {!isLast && (
          <div className="w-px h-12 lg:h-16 bg-border/50" />
        )}
      </div>

      {/* Content */}
      <div className="pb-10 lg:pb-14">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 text-primary">{icon}</div>
          <h4 className="font-semibold">{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

const stepsConfig = [
  {
    icon: <Send className="w-4 h-4" />,
    titleKey: 'systemFlow.steps.0.title',
    descKey: 'systemFlow.steps.0.desc',
  },
  {
    icon: <Route className="w-4 h-4" />,
    titleKey: 'systemFlow.steps.1.title',
    descKey: 'systemFlow.steps.1.desc',
  },
  {
    icon: <Calculator className="w-4 h-4" />,
    titleKey: 'systemFlow.steps.2.title',
    descKey: 'systemFlow.steps.2.desc',
  },
  {
    icon: <Wallet className="w-4 h-4" />,
    titleKey: 'systemFlow.steps.3.title',
    descKey: 'systemFlow.steps.3.desc',
  },
  {
    icon: <Cpu className="w-4 h-4" />,
    titleKey: 'systemFlow.steps.4.title',
    descKey: 'systemFlow.steps.4.desc',
  },
  {
    icon: <ArrowRight className="w-4 h-4" />,
    titleKey: 'systemFlow.steps.5.title',
    descKey: 'systemFlow.steps.5.desc',
  },
  {
    icon: <CheckCircle className="w-4 h-4" />,
    titleKey: 'systemFlow.steps.6.title',
    descKey: 'systemFlow.steps.6.desc',
  },
]

export default function SystemFlow() {
  const { t } = useI18n()
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {t('systemFlow.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('systemFlow.subtitle')}
          </p>
        </div>

        {/* Flow Steps - Two Column on Desktop */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0">
          <div>
            {stepsConfig.slice(0, 4).map((step, i) => (
              <FlowStep
                key={step.titleKey}
                icon={step.icon}
                title={t(step.titleKey)}
                description={t(step.descKey)}
                number={i + 1}
                isLast={false}
              />
            ))}
          </div>
          <div>
            {stepsConfig.slice(4, 7).map((step, i) => (
              <FlowStep
                key={step.titleKey}
                icon={step.icon}
                title={t(step.titleKey)}
                description={t(step.descKey)}
                number={i + 4}
                isLast={i === 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
