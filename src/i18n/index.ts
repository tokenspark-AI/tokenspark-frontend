/**
 * TokenSpark i18n — Internationalization Module
 *
 * Supported languages: 30 languages
 * Brand name in Chinese: 词元闪耀 (TokenSpark)
 */

import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ptBR from './locales/pt-BR.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import th from './locales/th.json';
import vi from './locales/vi.json';
import id from './locales/id.json';
import ms from './locales/ms.json';
import tl from './locales/tl.json';
import tr from './locales/tr.json';
import pl from './locales/pl.json';
import nl from './locales/nl.json';
import sv from './locales/sv.json';
import da from './locales/da.json';
import fi from './locales/fi.json';
import no from './locales/no.json';
import uk from './locales/uk.json';
import cs from './locales/cs.json';
import ro from './locales/ro.json';

export type SupportedLocale =
  | 'zh' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'ru'
  | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'pt-BR'
  | 'ar' | 'hi' | 'bn' | 'th' | 'vi' | 'id'
  | 'ms' | 'tl' | 'tr' | 'pl' | 'nl' | 'sv'
  | 'da' | 'fi' | 'no' | 'uk' | 'cs' | 'ro';

export const LOCALES: Record<SupportedLocale, { label: string; native: string; dir: 'ltr' | 'rtl' }> = {
  zh: { label: 'Chinese (Simplified)', native: '简体中文', dir: 'ltr' },
  'zh-TW': { label: 'Chinese (Traditional)', native: '繁體中文', dir: 'ltr' },
  en: { label: 'English', native: 'English', dir: 'ltr' },
  ja: { label: 'Japanese', native: '日本語', dir: 'ltr' },
  ko: { label: 'Korean', native: '한국어', dir: 'ltr' },
  ru: { label: 'Russian', native: 'Русский', dir: 'ltr' },
  es: { label: 'Spanish', native: 'Español', dir: 'ltr' },
  fr: { label: 'French', native: 'Français', dir: 'ltr' },
  de: { label: 'German', native: 'Deutsch', dir: 'ltr' },
  it: { label: 'Italian', native: 'Italiano', dir: 'ltr' },
  pt: { label: 'Portuguese (EU)', native: 'Português', dir: 'ltr' },
  'pt-BR': { label: 'Portuguese (BR)', native: 'Português (Brasil)', dir: 'ltr' },
  ar: { label: 'Arabic', native: 'العربية', dir: 'rtl' },
  hi: { label: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  bn: { label: 'Bengali', native: 'বাংলা', dir: 'ltr' },
  th: { label: 'Thai', native: 'ไทย', dir: 'ltr' },
  vi: { label: 'Vietnamese', native: 'Tiếng Việt', dir: 'ltr' },
  id: { label: 'Indonesian', native: 'Bahasa Indonesia', dir: 'ltr' },
  ms: { label: 'Malay', native: 'Bahasa Melayu', dir: 'ltr' },
  tl: { label: 'Filipino', native: 'Filipino', dir: 'ltr' },
  tr: { label: 'Turkish', native: 'Türkçe', dir: 'ltr' },
  pl: { label: 'Polish', native: 'Polski', dir: 'ltr' },
  nl: { label: 'Dutch', native: 'Nederlands', dir: 'ltr' },
  sv: { label: 'Swedish', native: 'Svenska', dir: 'ltr' },
  da: { label: 'Danish', native: 'Dansk', dir: 'ltr' },
  fi: { label: 'Finnish', native: 'Suomi', dir: 'ltr' },
  no: { label: 'Norwegian', native: 'Norsk', dir: 'ltr' },
  uk: { label: 'Ukrainian', native: 'Українська', dir: 'ltr' },
  cs: { label: 'Czech', native: 'Čeština', dir: 'ltr' },
  ro: { label: 'Romanian', native: 'Română', dir: 'ltr' },
};

const DEFAULT_LOCALE: SupportedLocale = 'zh';

type LocaleData = typeof zh;

const LOCALE_DATA: Record<SupportedLocale, LocaleData> = {
  zh, 'zh-TW': zhTW, en, ja, ko, ru,
  es, fr, de, it, pt, 'pt-BR': ptBR,
  ar, hi, bn, th, vi, id,
  ms, tl, tr, pl, nl, sv,
  da, fi, no, uk, cs, ro,
};

/**
 * Detect user's preferred language from browser
 */
export function detectLocale(): SupportedLocale {
  if (typeof window !== 'undefined') {
    const lang = navigator.language || navigator.languages?.[0] || '';
    const localeMap: Record<string, SupportedLocale> = {
      'zh-Hant': 'zh-TW', 'zh-TW': 'zh-TW', 'zh-HK': 'zh-TW', 'zh-MO': 'zh-TW',
      'ja': 'ja', 'ko': 'ko', 'ru': 'ru',
      'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it',
      'pt': 'pt', 'ar': 'ar', 'hi': 'hi', 'bn': 'bn',
      'th': 'th', 'vi': 'vi', 'id': 'id', 'ms': 'ms',
      'tl': 'tl', 'tr': 'tr', 'pl': 'pl', 'nl': 'nl',
      'sv': 'sv', 'da': 'da', 'fi': 'fi', 'nb': 'no', 'nn': 'no',
      'uk': 'uk', 'cs': 'cs', 'ro': 'ro',
    };
    for (const [prefix, locale] of Object.entries(localeMap)) {
      if (lang.startsWith(prefix)) return locale;
    }
    // pt-BR detection
    if (lang === 'pt-BR') return 'pt-BR';
  }
  return DEFAULT_LOCALE;
}

/**
 * Get locale from URL, localStorage, or detection
 */
export function getLocale(): SupportedLocale {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const locale = params.get('lang') as SupportedLocale | null;
    if (locale && LOCALE_DATA[locale]) return locale;

    const stored = localStorage.getItem('tokenspark_locale');
    if (stored && LOCALE_DATA[stored as SupportedLocale]) return stored as SupportedLocale;
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
      const fallback = LOCALE_DATA[DEFAULT_LOCALE];
      let fb: any = fallback;
      for (const fk of keys) {
        if (fb && typeof fb === 'object' && fk in fb) fb = fb[fk];
        else return key;
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

  return { locale, t: translate, changeLocale, locales: LOCALES };
}

export default {
  detectLocale, getLocale, setLocale, t, getTranslations, useI18n, LOCALES,
};
