/**
 * @file validation.test.ts
 * @description Unit tests for validation and sanitization utility.
 */

import { sanitizeSearchQuery, isValidQuantity } from '../src/utils/validation';

export function runValidationTests(): boolean {
  let passed = true;

  // Test 1: sanitizeSearchQuery
  const xssInput = '<script>alert("xss")</script>Monstera';
  const clean = sanitizeSearchQuery(xssInput);
  if (clean.includes('<') || clean.includes('>')) {
    console.error('Test Failed: sanitizeSearchQuery allowed markup brackets');
    passed = false;
  }

  // Test 2: isValidQuantity
  if (!isValidQuantity(1) || !isValidQuantity(10)) {
    console.error('Test Failed: isValidQuantity rejected valid quantities');
    passed = false;
  }
  if (isValidQuantity(0) || isValidQuantity(-5) || isValidQuantity(100) || isValidQuantity(1.5)) {
    console.error('Test Failed: isValidQuantity accepted invalid quantities');
    passed = false;
  }

  return passed;
}
