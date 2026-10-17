/**
 * @file formatters.ts
 * @description Currency and numeral formatting utilities for English and Bengali.
 */

import { Language } from '../types';
import { CURRENCY } from '../config/constants';

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts English numerals to Bengali digits if language is 'bn'.
 * @param num Number or string to format
 * @param lang Active language
 * @returns Formatted numeral string
 */
export function formatNumeral(num: number | string, lang: Language): string {
  const str = String(num);
  if (lang !== 'bn') return str;
  return str.replace(/\d/g, (d) => BENGALI_DIGITS[d] || d);
}

/**
 * Formats a numeric price into localized currency string.
 * @param amount Price amount in BDT
 * @param lang Active language
 * @returns Localized currency string
 */
export function formatPrice(amount: number, lang: Language): string {
  const formattedNum = formatNumeral(amount.toLocaleString('en-US'), lang);
  const symbol = lang === 'bn' ? CURRENCY.symbolBn : CURRENCY.symbolEn;
  return `${symbol}${formattedNum}`;
}

/**
 * Calculates or retrieves the total sold units count for a product.
 * Returns deterministic realistic count if soldCount is not explicitly set.
 */
export function getProductSoldCount(product: { soldCount?: number; reviewsCount?: number; id?: string }): number {
  if (product.soldCount && product.soldCount > 0) return product.soldCount;
  const reviews = product.reviewsCount ?? 12;
  let seed = 28;
  if (product.id) {
    seed += product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 35;
  }
  return Math.max(25, reviews * 4 + seed);
}
