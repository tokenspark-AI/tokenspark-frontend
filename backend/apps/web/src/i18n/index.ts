/**
 * TokenSpark i18n — Internationalization Module
 *
 * Supported languages:
 * - zh: 简体中文 (Simplified Chinese)
 * - ja: 日本語 (Japanese)
 * - ko: 한국어 (Korean)
 * - ru: Русский (Russian)
 *
 * Brand name in Chinese: 词元闪耀 (TokenSpark)
 */

import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';

export type SupportedLocale = 'zh' | 'ja' | 'ko' | 'ru';

export const LOCALES: Record<SupportedLocale, { label: string; native: string; dir: 'ltr' | 'rtl' }> = {
  zh: { label: 'Chinese', native: '简体中文', dir: 'ltr' },
  ja: { label: 'Japanese', native: '日本語', dir: 'ltr' },
  ko: { label: 'Korean', native: '한국어', dir: 'ltr' },
  ru: { label: 'Russian', native: 'Русский', dir: 'ltr' },
};

const DEFAULT_LOCALE: SupportedLocale = 'zh';

type LocaleData = typeof zh;

const LOCALE_DATA: Record<SupportedLocale, LocaleData> = { zh, ja, ko, ru };

/**
 * Detect user's preferred language from browser or Accept-Language header
 */
export function detectLocale(): SupportedLocale {
  if (typeof window !== 'undefined') {
    const lang = navigator.language || navigator.languages?.[0] || '';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('zh')) return 'zh';
  }
  return DEFAULT_LOCALE;
}

/**
 * Get locale from URL, cookie, or detection
 */
export function getLocale(): SupportedLocale {
  // Check URL param
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const locale = params.get('lang') as SupportedLocale | null;
    if (locale && LOCALE_DATA[locale]) {
      return locale;
    }

    // Check localStorage
    const stored = localStorage.getItem('tokenspark_locale');
    if (stored && LOCALE_DATA[stored as SupportedLocale]) {
      return stored as SupportedLocale;
    }
  }

  return detectLocale();
}

/**
 * Set locale preference
 */
export function setLocale(locale: SupportedLocale): void {
  if (!LOCALE_DATA[locale]) return;

  if (typeof window !== 'undefined') {
    localStorage.setItem('tokenspark_locale', locale);
  }
}

/**
 * Deep merge utility for locale data fallback
 */
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Get translation value by dot-notation key
 */
export function t(key: string, locale?: SupportedLocale): string {
  const loc = locale || getLocale();
  const data = LOCALE_DATA[loc] || LOCALE_DATA[DEFAULT_LOCALE];

  const keys = key.split('.');
  let value: any = data;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to default locale
      const fallback = LOCALE_DATA[DEFAULT_LOCALE];
      let fb: any = fallback;
      for (const fk of keys) {
        if (fb && typeof fb === 'object' && fk in fb) {
          fb = fb[fk];
        } else {
          return key; // Return key as last resort
        }
      }
      return typeof fb === 'string' ? fb : key;
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale?: SupportedLocale): LocaleData {
  const loc = locale || getLocale();
  return LOCALE_DATA[loc] || LOCALE_DATA[DEFAULT_LOCALE];
}

/**
 * React Hook for i18n
 */
export function useI18n() {
  const locale = getLocale();

  const translate = (key: string): string => t(key, locale);

  const changeLocale = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    window.location.reload();
  };

  return {
    locale,
    t: translate,
    changeLocale,
    locales: LOCALES,
  };
}

export default {
  detectLocale,
  getLocale,
  setLocale,
  t,
  getTranslations,
  useI18n,
  LOCALES,
};
