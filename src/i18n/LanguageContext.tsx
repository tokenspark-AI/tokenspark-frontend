import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslation, defaultLanguage, TranslationKey, languages, Language } from '@/i18n/translations';

interface LanguageContextType {
  currentLang: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
  languages: Language[];
  currentLanguage: Language;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('tokenspark_lang') || defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem('tokenspark_lang', currentLang);
    // Set document direction for RTL languages
    const lang = languages.find(l => l.code === currentLang);
    document.documentElement.dir = lang?.code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const setLanguage = (lang: string) => {
    setCurrentLang(lang);
  };

  const t = (key: TranslationKey): string => {
    return getTranslation(currentLang, key);
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, languages, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
