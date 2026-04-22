import { Check, Sparkles } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useI18n } from '@/i18n'

interface PricingTier {
  model: string
  provider: string
  providerIcon: string
  inputPrice: string
  outputPrice: string
  context: string
  popular?: boolean
  category: 'flagship' | 'standard' | 'economy' | 'open'
}

const tiers: PricingTier[] = [
  // Flagship Models
  {
    model: 'GPT-4.1',
    provider: 'OpenAI',
    providerIcon: '🟢',
    inputPrice: '$2.00',
    outputPrice: '$8.00',
    context: '1M tokens',
    popular: true,
    category: 'flagship',
  },
  {
    model: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerIcon: '🟠',
    inputPrice: '$3.00',
    outputPrice: '$15.00',
    context: '200K tokens',
    category: 'flagship',
  },
  {
    model: 'Claude 3 Opus',
    provider: 'Anthropic',
    providerIcon: '🟠',
    inputPrice: '$15.00',
    outputPrice: '$75.00',
    context: '200K tokens',
    category: 'flagship',
  },
  {
    model: 'Gemini 2.0 Pro',
    provider: 'Google',
    providerIcon: '🔵',
    inputPrice: '$1.25',
    outputPrice: '$5.00',
    context: '1M tokens',
    category: 'flagship',
  },
  // Standard Models
  {
    model: 'GPT-4o',
    provider: 'OpenAI',
    providerIcon: '🟢',
    inputPrice: '$2.50',
    outputPrice: '$10.00',
    context: '128K tokens',
    category: 'standard',
  },
  {
    model: 'GPT-4o Mini',
    provider: 'OpenAI',
    providerIcon: '🟢',
    inputPrice: '$0.15',
    outputPrice: '$0.60',
    context: '128K tokens',
    category: 'standard',
  },
  {
    model: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    providerIcon: '🟠',
    inputPrice: '$0.80',
    outputPrice: '$4.00',
    context: '200K tokens',
    category: 'standard',
  },
  {
    model: 'Gemini 2.0 Flash',
    provider: 'Google',
    providerIcon: '🔵',
    inputPrice: '$0.10',
    outputPrice: '$0.40',
    context: '1M tokens',
    category: 'standard',
  },
  // Economy Models
  {
    model: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    providerIcon: '🟢',
    inputPrice: '$0.40',
    outputPrice: '$1.60',
    context: '1M tokens',
    category: 'economy',
  },
  {
    model: 'GPT-4.1 Nano',
    provider: 'OpenAI',
    providerIcon: '🟢',
    inputPrice: '$0.10',
    outputPrice: '$0.40',
    context: '1M tokens',
    category: 'economy',
  },
  {
    model: 'Gemini 2.0 Flash-Lite',
    provider: 'Google',
    providerIcon: '🔵',
    inputPrice: '$0.075',
    outputPrice: '$0.30',
    context: '1M tokens',
    category: 'economy',
  },
  // Open Source Models
  {
    model: 'Llama 3.1 405B',
    provider: 'Meta',
    providerIcon: '🦙',
    inputPrice: '$0.80',
    outputPrice: '$2.40',
    context: '128K tokens',
    category: 'open',
  },
  {
    model: 'Llama 3.3 70B',
    provider: 'Meta',
    providerIcon: '🦙',
    inputPrice: '$0.20',
    outputPrice: '$0.60',
    context: '128K tokens',
    category: 'open',
  },
  {
    model: 'Mistral Large 2',
    provider: 'Mistral AI',
    providerIcon: '🟣',
    inputPrice: '$2.00',
    outputPrice: '$6.00',
    context: '128K tokens',
    category: 'open',
  },
  {
    model: 'Mistral Medium',
    provider: 'Mistral AI',
    providerIcon: '🟣',
    inputPrice: '$0.50',
    outputPrice: '$1.50',
    context: '32K tokens',
    category: 'open',
  },
  {
    model: 'DeepSeek V3',
    provider: 'DeepSeek',
    providerIcon: '🔴',
    inputPrice: '$0.14',
    outputPrice: '$0.28',
    context: '128K tokens',
    category: 'open',
  },
  {
    model: 'Qwen 2.5 72B',
    provider: 'Alibaba',
    providerIcon: '🟡',
    inputPrice: '$0.20',
    outputPrice: '$0.60',
    context: '128K tokens',
    category: 'open',
  },
]

const categoryLabels: Record<PricingTier['category'], string> = {
  flagship: 'pricing.categories.flagship',
  standard: 'pricing.categories.standard',
  economy: 'pricing.categories.economy',
  open: 'pricing.categories.open',
}

export default function PricingSection() {
  const { t } = useI18n()

  // Group by category
  const groupedTiers = tiers.reduce<Record<string, PricingTier[]>>((acc, tier) => {
    if (!acc[tier.category]) acc[tier.category] = []
    acc[tier.category].push(tier)
    return acc
  }, {})

  const categoryOrder: PricingTier['category'][] = ['flagship', 'standard', 'economy', 'open']

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {t('pricing.title')} <span className="gradient-text">{t('pricing.titleAccent')}</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing by Category */}
        <div className="space-y-12 lg:space-y-16">
          {categoryOrder.map((category) => (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">
                  {t(categoryLabels[category])}
                </h3>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedTiers[category]?.map((tier) => (
                  <Card
                    key={tier.model}
                    className={`relative group hover:shadow-lg transition-shadow duration-300 ${
                      tier.popular
                        ? 'border-primary/50 shadow-lg shadow-primary/10'
                        : 'border-border/50'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {t('pricing.popular')}
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{tier.providerIcon}</span>
                          <h4 className="font-bold text-base">{tier.model}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">{tier.provider}</p>
                      </div>

                      <div className="space-y-2 mb-5">
                        <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                          <span className="text-xs text-muted-foreground">{t('pricing.input')}</span>
                          <span className="font-semibold text-sm">{tier.inputPrice}{t('pricing.perMillion')}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                          <span className="text-xs text-muted-foreground">{t('pricing.output')}</span>
                          <span className="font-semibold text-sm">{tier.outputPrice}{t('pricing.perMillion')}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-xs text-muted-foreground">{t('pricing.context')}</span>
                          <span className="font-semibold text-sm">{tier.context}</span>
                        </div>
                      </div>

                      <Button
                        variant={tier.popular ? 'spark' : 'outline'}
                        className="w-full h-9 text-sm"
                      >
                        {t('pricing.getStarted')}
                        <Check className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
