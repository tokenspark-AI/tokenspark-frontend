import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from './ui/button'
import { useI18n, type SupportedLocale } from '@/i18n'

const navLinks = ['platform', 'pricing', 'docs', 'partners'] as const

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { locale, t, changeLocale, locales } = useI18n()

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#" className="text-lg font-bold tracking-tight">
            {t('brand.name')}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((key) => (
              <a
                key={key}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t(`nav.${key}`)}
              </a>
            ))}
          </div>

          {/* Right side: Language + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{locales[locale]?.native}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-border/50 bg-card shadow-lg overflow-hidden z-50">
                  {(Object.keys(locales) as SupportedLocale[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        changeLocale(key)
                        setLangOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                        key === locale ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {locales[key].native}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="spark" size="sm">
              {t('nav.getStarted')}
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            {navLinks.map((key) => (
              <a
                key={key}
                href="#"
                className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {t(`nav.${key}`)}
              </a>
            ))}

            {/* Mobile Language Selector */}
            <div className="flex gap-2 mt-3 pb-3 border-b border-border/50">
              {(Object.keys(locales) as SupportedLocale[]).map((key) => (
                <button
                  key={key}
                  onClick={() => changeLocale(key)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    key === locale
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {locales[key].native}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Button variant="spark" size="sm" className="w-full">
                {t('nav.getStarted')}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
