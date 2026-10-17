/**
 * @file productService.test.ts
 * @description Unit tests for decoupled product service.
 */

import { productService } from '../src/services/productService';

export async function runProductServiceTests(): Promise<boolean> {
  let passed = true;

  const products = await productService.getProducts();
  if (!products || products.length === 0) {
    console.error('Test Failed: getProducts returned empty list');
    passed = false;
  }

  const plantCats = await productService.getCategories('plant');
  if (!plantCats.every((c) => c.type === 'plant')) {
    console.error('Test Failed: plant categories filter failed');
    passed = false;
  }

  const mango = await productService.getProductBySlug('mango-sapling');
  if (!mango || mango.nameEn !== 'Amrapali Mango Sapling') {
    console.error('Test Failed: getProductBySlug did not find mango-sapling');
    passed = false;
  }

  const filtered = await productService.filterAndSortProducts({
    type: 'plant',
    sortBy: 'price-asc',
  });
  if (filtered.length === 0 || filtered.some((p) => p.type !== 'plant')) {
    console.error('Test Failed: filterAndSortProducts failed');
    passed = false;
  }

  return passed;
}
