import { Brain, Bot, Wallet, Network } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { useI18n } from '@/i18n'

interface ProductCardProps {
  icon: React.ReactNode
  titleKey: string
  descKey: string
  accent?: 'purple' | 'blue' | 'default'
}

function ProductCard({ icon, titleKey, descKey, accent = 'default' }: ProductCardProps) {
  const { t } = useI18n()

  const accentClasses = {
    purple: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
    default: 'bg-primary/10 text-primary group-hover:bg-primary/20',
  }

  return (
    <Card className="group cursor-pointer">
      <CardContent className="p-6 lg:p-8">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${accentClasses[accent]}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
          {t(titleKey)}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(descKey)}
        </p>
      </CardContent>
    </Card>
  )
}

const products = [
  {
    icon: <Brain className="w-5 h-5" />,
    titleKey: 'coreProducts.modelMarket.title',
    descKey: 'coreProducts.modelMarket.desc',
    accent: 'purple' as const,
  },
  {
    icon: <Bot className="w-5 h-5" />,
    titleKey: 'coreProducts.agentMarket.title',
    descKey: 'coreProducts.agentMarket.desc',
    accent: 'blue' as const,
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    titleKey: 'coreProducts.billing.title',
    descKey: 'coreProducts.billing.desc',
    accent: 'default' as const,
  },
  {
    icon: <Network className="w-5 h-5" />,
    titleKey: 'coreProducts.distribution.title',
    descKey: 'coreProducts.distribution.desc',
    accent: 'default' as const,
  },
]

export default function CoreProducts() {
  const { t } = useI18n()

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {t('coreProducts.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('coreProducts.subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.titleKey} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
