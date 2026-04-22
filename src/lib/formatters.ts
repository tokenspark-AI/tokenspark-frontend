import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { zhCN, ja, ko, ru, enUS, es, fr, de, it, pt, ptBR, ar, hi, bn, th, vi, id, ms, tr, pl, nl, sv, da, fi, nb, uk, cs, ro, zhTW } from 'date-fns/locale';

// Date locale map
const dateLocales: Record<string, any> = {
  zh: zhCN,
  'zh-TW': zhTW,
  ja,
  ko,
  ru,
  en: enUS,
  es,
  fr,
  de,
  it,
  pt,
  'pt-BR': ptBR,
  ar,
  hi,
  bn,
  th,
  vi,
  id,
  ms,
  // tl not available in date-fns
  tr,
  pl,
  nl,
  sv,
  da,
  fi,
  no: nb,
  uk,
  cs,
  ro,
};

/**
 * Format currency amount
 * @param cents - Amount in cents
 * @param currency - Currency code (default: USD)
 * @returns Formatted string
 */
export function formatCurrency(cents: number, currency: string = 'USD'): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(dollars);
}

/**
 * Format CNY amount
 */
export function formatCNY(cents: number): string {
  const yuan = cents / 100;
  return `¥${yuan.toFixed(2)}`;
}

/**
 * Format token count with K/M suffix
 */
export function formatTokens(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Format large numbers with K/M/B suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format percentage change with sign and color
 */
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Format date string
 */
export function formatDate(date: string | Date, locale: string = 'zh'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const dateLocale = dateLocales[locale] || enUS;
  return format(dateObj, 'yyyy-MM-dd HH:mm:ss', { locale: dateLocale });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelative(date: string | Date, locale: string = 'zh'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const dateLocale = dateLocales[locale] || enUS;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: dateLocale });
}

/**
 * Format duration in ms to human readable
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format success rate percentage
 */
export function formatSuccessRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

/**
 * Mask API key for display
 */
export function maskApiKey(key: string, prefix: string = ''): string {
  if (!key) return '';
  const displayPrefix = prefix || key.slice(0, 12);
  return `${displayPrefix}••••••••••••`;
}

/**
 * Calculate cost per million tokens
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  inputPricePerMillion: number,
  outputPricePerMillion: number
): number {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;
  return Math.round(inputCost + outputCost);
}
