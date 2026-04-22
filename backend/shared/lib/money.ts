/**
 * Money handling utilities.
 * ALL monetary values are stored as integers (cents/smallest unit).
 * NEVER use floating point for money.
 */

export type Currency = 'USD' | 'CNY' | 'EUR' | 'USDT';

export interface Money {
  amount: number; // in cents/smallest unit
  currency: Currency;
}

/**
 * Convert dollars to cents (integer)
 */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars (float, for display only)
 */
export function toDollars(cents: number): number {
  return cents / 100;
}

/**
 * Format money for display
 */
export function formatMoney(amount: number, currency: Currency = 'USD'): string {
  const dollars = toDollars(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars);
}

/**
 * Calculate cost based on token count and price per million
 */
export function calculateTokenCost(
  tokenCount: number,
  pricePerMillion: number // in cents
): number {
  return Math.ceil((tokenCount / 1_000_000) * pricePerMillion);
}

/**
 * Add two money amounts (must be same currency)
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
  return { amount: a.amount + b.amount, currency: a.currency };
}

/**
 * Subtract two money amounts
 */
export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
  return { amount: a.amount - b.amount, currency: a.currency };
}

/**
 * Calculate percentage of a money amount
 */
export function percentageOf(amount: number, percent: number): number {
  return Math.floor(amount * percent);
}
