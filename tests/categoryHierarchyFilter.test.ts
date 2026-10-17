/**
 * @file categoryHierarchyFilter.test.ts
 * @description Automated verification suite for Gardenvaly Category & Subcategory Filter,
 * checkbox selection, icons, and product catalog multi-slug filtering.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { HIERARCHICAL_CATEGORIES } from '../src/data/mockCategoryHierarchy';
import { productService } from '../src/services/productService';

console.log('🌿 Running Gardenvaly Category & Subcategory Filter Tests...\n');

describe('Suite 1: Category & Subcategory Hierarchy Structure', () => {
  it('Fruit Plants category contains all 3 subcategories and tree icon', () => {
    const fruitCat = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'fruit-plants');
    assert.ok(fruitCat, 'Fruit plants category exists');
    assert.equal(fruitCat.nameBn, 'ফল গাছ');
    assert.equal(fruitCat.iconName, 'tree');
    assert.equal(fruitCat.itemCount, 130);
    assert.ok(Array.isArray(fruitCat.subcategories), 'Subcategories array exists');
    assert.equal(fruitCat.subcategories!.length, 3);

    const subNames = fruitCat.subcategories!.map((s) => s.nameBn);
    assert.ok(subNames.includes('দেশি ফল গাছ'));
    assert.ok(subNames.includes('বারোমাসি ফল গাছ'));
    assert.ok(subNames.includes('বিদেশি ফল গাছ'));
    console.log('  ✅ PASS: Fruit Plants hierarchy (দেশি, বারোমাসি, বিদেশি ফল গাছ) verified');
  });

  it('Flowering Plants category contains all 6 subcategories and flower icon', () => {
    const flowerCat = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'flowering-plants');
    assert.ok(flowerCat, 'Flowering plants category exists');
    assert.equal(flowerCat.nameBn, 'ফুল গাছ');
    assert.equal(flowerCat.iconName, 'flower');
    assert.equal(flowerCat.itemCount, 183);
    assert.equal(flowerCat.subcategories!.length, 6);

    const subNames = flowerCat.subcategories!.map((s) => s.nameBn);
    assert.ok(subNames.includes('দেশি ফুল গাছ'));
    assert.ok(subNames.includes('বারোমাসি ফুল গাছ'));
    assert.ok(subNames.includes('বিদেশি ফুল গাছ'));
    assert.ok(subNames.includes('লতা জাতীয় ফুল গাছ'));
    assert.ok(subNames.includes('শীতকালীন ফুল'));
    assert.ok(subNames.includes('সুগন্ধি ফুল গাছ'));
    console.log('  ✅ PASS: Flowering Plants hierarchy (৬টি সাব-ক্যাটাগরি) verified');
  });

  it('Ornamental Plants category contains 5 subcategories and potted icon', () => {
    const ornCat = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'ornamental-plants');
    assert.ok(ornCat, 'Ornamental plants category exists');
    assert.equal(ornCat.nameBn, 'শোভাময় গাছ');
    assert.equal(ornCat.iconName, 'potted');
    assert.equal(ornCat.subcategories!.length, 5);

    const subNames = ornCat.subcategories!.map((s) => s.nameBn);
    assert.ok(subNames.includes('আউটডোর প্লান্টস'));
    assert.ok(subNames.includes('ইনডোর প্লান্টস'));
    assert.ok(subNames.includes('ক্যাকটাস ও স্যাকুলেন্ট'));
    assert.ok(subNames.includes('বনসাই'));
    assert.ok(subNames.includes('হ্যাঙ্গিং প্লান্টস'));
    console.log('  ✅ PASS: Ornamental Plants hierarchy (৫টি সাব-ক্যাটাগরি) verified');
  });

  it('Spice and Medicinal plant categories have leaf icons', () => {
    const spiceCat = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'spice-plants');
    const medCat = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'medicinal-plants');
    assert.ok(spiceCat && spiceCat.nameBn === 'মশলা জাতীয় গাছ' && spiceCat.iconName === 'leaf');
    assert.ok(medCat && medCat.nameBn === 'ঔষধি গাছ' && medCat.iconName === 'leaf');
    console.log('  ✅ PASS: Spice and Medicinal categories with leaf icons verified');
  });
});

describe('Suite 2: Multi-Select & Subcategory Filtering Logic', () => {
  it('Filtering by single subcategory "baromasi-fruit-plants" yields matching plants', async () => {
    const results = await productService.filterAndSortProducts({
      categorySlugs: ['baromasi-fruit-plants'],
      sortBy: 'featured',
    });
    assert.ok(results.length > 0, 'Found products for baromasi-fruit-plants');
    assert.ok(results.some((p) => p.nameBn.includes('লেবু') || p.nameEn.includes('Lemon')));
    console.log('  ✅ PASS: Filtering by baromasi-fruit-plants successfully returns Kagzi Lemon');
  });

  it('Filtering by multi-select subcategories returns union of items', async () => {
    const results = await productService.filterAndSortProducts({
      categorySlugs: ['baromasi-fruit-plants', 'deshi-fruit-plants'],
      sortBy: 'featured',
    });
    assert.ok(results.length >= 2, 'Found multiple products for multi-select');
    const names = results.map((p) => p.nameBn);
    assert.ok(names.some((n) => n.includes('আম')), 'Includes mango from deshi');
    assert.ok(names.some((n) => n.includes('লেবু')), 'Includes lemon from baromasi');
    console.log('  ✅ PASS: Multi-select filtering returns combined products');
  });

  it('Filtering by parent category "fruit-plants" returns all fruit varieties', async () => {
    const results = await productService.filterAndSortProducts({
      categorySlugs: ['fruit-plants'],
      sortBy: 'featured',
    });
    assert.ok(results.length >= 3, 'Found fruit plants collection');
    assert.ok(results.every((p) => p.categorySlug === 'fruit-plants'));
    console.log('  ✅ PASS: Parent category filter covers all child fruit plants');
  });
});

describe('Suite 3: UI Component Architecture & Accessibility', () => {
  it('CategoryHierarchyFilter implements role="checkbox" and aria-checked', () => {
    const compContent = fs.readFileSync(path.resolve('src/components/shop/CategoryHierarchyFilter.tsx'), 'utf-8');
    assert.ok(compContent.includes('role="checkbox"'), 'Has accessible checkbox role');
    assert.ok(compContent.includes('aria-checked='), 'Has accessible aria-checked state');
    assert.ok(compContent.includes('CategoryIcon'), 'Uses CategoryIcon component');
    const iconContent = fs.readFileSync(path.resolve('src/components/common/CategoryIcon.tsx'), 'utf-8');
    assert.ok(iconContent.includes('TreeDeciduous'), 'Includes tree icon in CategoryIcon');
    assert.ok(iconContent.includes('Flower2'), 'Includes flower icon in CategoryIcon');
    assert.ok(compContent.includes('Check'), 'Includes checkmark icon for active state');
    console.log('  ✅ PASS: CategoryHierarchyFilter accessibility and icon rendering verified');
  });

  it('FilterSidebar and FilterMobileDrawer integrate CategoryHierarchyFilter', () => {
    const sidebar = fs.readFileSync(path.resolve('src/components/shop/FilterSidebar.tsx'), 'utf-8');
    const drawer = fs.readFileSync(path.resolve('src/components/shop/FilterMobileDrawer.tsx'), 'utf-8');
    assert.ok(sidebar.includes('CategoryHierarchyFilter'), 'Sidebar imports CategoryHierarchyFilter');
    assert.ok(drawer.includes('CategoryHierarchyFilter'), 'Mobile drawer imports CategoryHierarchyFilter');
    console.log('  ✅ PASS: Both desktop sidebar and mobile drawer integrate hierarchy filter');
  });
});
