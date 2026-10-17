/**
 * @file formatters.test.ts
 * @description Unit tests for bilingual numeral and currency formatting.
 */

import { formatNumeral, formatPrice } from '../src/utils/formatters';

export function runFormatterTests(): boolean {
  let passed = true;

  // Test 1: formatNumeral English
  if (formatNumeral(123, 'en') !== '123') {
    console.error('Test Failed: formatNumeral English output mismatch');
    passed = false;
  }

  // Test 2: formatNumeral Bengali
  if (formatNumeral(123, 'bn') !== '১২৩') {
    console.error('Test Failed: formatNumeral Bengali output mismatch');
    passed = false;
  }

  // Test 3: formatPrice
  const priceBn = formatPrice(350, 'bn');
  if (!priceBn.includes('৳') || !priceBn.includes('৩৫০')) {
    console.error('Test Failed: formatPrice Bengali output mismatch', priceBn);
    passed = false;
  }

  return passed;
}
