import { ArrowRight, Brain, Bot } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useI18n } from '@/i18n'

interface HeroSectionProps {
  activeModel: string
  setActiveModel: (model: string) => void
}

export default function HeroSection({ activeModel, setActiveModel }: HeroSectionProps) {
  const { t } = useI18n()

  const handleRun = () => {
    if (activeModel.trim()) {
      console.log('Running model:', activeModel)
    }
  }

  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Dual Engine Badges */}
          <div className="inline-flex items-center gap-3 mb-8 animate-slide-up">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-300">{t('hero.badgeModel')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-sm">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-300">{t('hero.badgeAgent')}</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-slide-up">
            {t('hero.title1')}{' '}
            <span className="gradient-text">{t('hero.title2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('hero.subtitle')}
          </p>

          {/* Search/Run Input */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex-1 relative">
              <Input
                placeholder={t('hero.placeholder')}
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                className="pl-4 bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary/50"
              />
            </div>
            <Button variant="spark" onClick={handleRun} className="sm:w-auto whitespace-nowrap">
              {t('hero.run')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="/images/hero-ai-infrastructure.png"
              alt="TokenSpark AI Economy Infrastructure"
              className="w-full max-w-5xl mx-auto rounded-xl border border-border/50 shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
