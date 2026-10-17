/**
 * @file validation.ts
 * @description Input sanitization, Bangladeshi phone validation, and checkout form rules.
 */

import { loggerService } from '../services/loggerService';

export function sanitizeSearchQuery(input: string): string {
  try {
    if (!input || typeof input !== 'string') return '';
    return input.trim().replace(/[<>'"&]/g, '').slice(0, 100);
  } catch (err) {
    loggerService.error('Failed to sanitize search input', err, 'Validation');
    return '';
  }
}

export function isValidQuantity(qty: number): boolean {
  return Number.isInteger(qty) && qty > 0 && qty <= 99;
}

/**
 * Validates Bangladeshi mobile phone numbers (+8801XXXXXXXXX or 01XXXXXXXXX).
 */
export function isValidBdPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(?:\+?880|0)?1[3-9]\d{8}$/.test(cleaned);
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isNonEmpty(val: string | undefined): boolean {
  return typeof val === 'string' && val.trim().length > 0;
}
