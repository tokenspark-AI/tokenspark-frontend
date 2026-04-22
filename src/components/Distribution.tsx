import { Users, TrendingUp, Shield, Percent, Wallet, Building2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useI18n } from '@/i18n'

interface PartnerTierProps {
  icon: React.ReactNode
  titleKey: string
  descKey: string
  commissionKey: string
  color: 'purple' | 'blue' | 'slate'
}

function PartnerTier({ icon, titleKey, descKey, commissionKey, color }: PartnerTierProps) {
  const { t } = useI18n()

  const colorMap = {
    purple: 'border-purple-500/20 bg-purple-500/5',
    blue: 'border-blue-500/20 bg-blue-500/5',
    slate: 'border-border/50 bg-card',
  }

  const iconColorMap = {
    purple: 'bg-purple-500/10 text-purple-400',
    blue: 'bg-blue-500/10 text-blue-400',
    slate: 'bg-primary/10 text-primary',
  }

  return (
    <Card className={`border ${colorMap[color]}`}>
      <CardContent className="p-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconColorMap[color]}`}>
          {icon}
        </div>
        <h4 className="text-base font-semibold mb-2">{t(titleKey)}</h4>
        <p className="text-sm text-muted-foreground mb-4">{t(descKey)}</p>
        <div className="pt-3 border-t border-border/30">
          <span className="text-xs font-medium text-primary">{t(commissionKey)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

const tiers: PartnerTierProps[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    titleKey: 'distribution.level1.title',
    descKey: 'distribution.level1.desc',
    commissionKey: 'distribution.level1.commission',
    color: 'purple',
  },
  {
    icon: <Users className="w-5 h-5" />,
    titleKey: 'distribution.level2.title',
    descKey: 'distribution.level2.desc',
    commissionKey: 'distribution.level2.commission',
    color: 'blue',
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    titleKey: 'distribution.enterprise.title',
    descKey: 'distribution.enterprise.desc',
    commissionKey: 'distribution.enterprise.commission',
    color: 'slate',
  },
]

const features = [
  {
    icon: <Percent className="w-4 h-4" />,
    titleKey: 'distribution.features.commission.title',
    descKey: 'distribution.features.commission.desc',
  },
  {
    icon: <Wallet className="w-4 h-4" />,
    titleKey: 'distribution.features.ledger.title',
    descKey: 'distribution.features.ledger.desc',
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    titleKey: 'distribution.features.settlement.title',
    descKey: 'distribution.features.settlement.desc',
  },
]

export default function Distribution() {
  const { t } = useI18n()
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {t('distribution.title')} <span className="gradient-text-spark">{t('distribution.titleAccent')}</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t('distribution.subtitle')}
          </p>
        </div>

        {/* Partner Tiers */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {tiers.map((tier) => (
            <PartnerTier key={tier.titleKey} {...tier} />
          ))}
        </div>

        {/* Flow Chart */}
        <div className="max-w-4xl mx-auto mb-12 p-6 lg:p-8 rounded-xl border border-border/50 bg-card/30">
          <h3 className="text-center font-semibold mb-6">{t('distribution.flow.title')}</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-sm">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium">{t('distribution.flow.steps.0')}</p>
            </div>
            <span className="text-muted-foreground text-2xl">→</span>
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium">{t('distribution.flow.steps.1')}</p>
            </div>
            <span className="text-muted-foreground text-2xl">→</span>
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium">{t('distribution.flow.steps.2')}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10 text-left">
          {features.map((feature) => (
            <div key={feature.titleKey} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-medium text-sm">{t(feature.titleKey)}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t(feature.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="spark" size="lg">
            {t('distribution.becomePartner')}
          </Button>
          <Button variant="hero" size="lg">
            {t('distribution.learnMore')}
          </Button>
        </div>
      </div>
    </section>
  )
}
