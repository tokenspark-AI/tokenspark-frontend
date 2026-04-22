import { useState, useEffect, useCallback } from 'react';
import type { SupportedLocale } from '@/i18n';
import { getLocale, setLocale, detectLocale } from '@/i18n';

/**
 * Hook for reactive locale management
 * Replaces the old window.location.reload() approach
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    try {
      return getLocale();
    } catch {
      return detectLocale();
    }
  });

  const changeLocale = useCallback((newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  // Listen for storage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('tokenspark_locale');
      if (stored) {
        setLocaleState(stored as SupportedLocale);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    locale,
    changeLocale,
  };
}
