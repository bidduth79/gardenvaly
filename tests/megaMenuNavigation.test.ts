/**
 * @file megaMenuNavigation.test.ts
 * @description Automated verification suite for Gardenvaly MegaMenu, MobileCategoryAccordion,
 * and category navigation integration.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { HIERARCHICAL_CATEGORIES } from '../src/data/mockCategoryHierarchy';

console.log('🌿 Running Gardenvaly Mega Menu & Modern Navigation Tests...\n');

describe('Suite 1: Botanical Mega Menu Structure & Coverage', () => {
  it('Hierarchical plant categories provide fruit, flower, and ornamental branches', () => {
    const fruit = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'fruit-plants');
    const flower = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'flowering-plants');
    const ornamental = HIERARCHICAL_CATEGORIES.find((c) => c.slug === 'ornamental-plants');

    assert.ok(fruit, 'Fruit category exists in tree');
    assert.ok(flower, 'Flower category exists in tree');
    assert.ok(ornamental, 'Ornamental category exists in tree');

    assert.equal(fruit.subcategories?.length, 3, 'Fruit category has 3 subcategories');
    assert.equal(flower.subcategories?.length, 6, 'Flower category has 6 subcategories');
    assert.equal(ornamental.subcategories?.length, 5, 'Ornamental category has 5 subcategories');

    console.log('  ✅ PASS: Plant categories provide complete hierarchical subcategories');
  });

  it('Subcategories contain valid slugs for direct storefront routing', () => {
    const allSubs = HIERARCHICAL_CATEGORIES.flatMap((c) => c.subcategories || []);
    assert.ok(allSubs.length >= 14, 'At least 14 subcategories are defined');

    for (const sub of allSubs) {
      assert.ok(sub.slug.length > 0, `Subcategory slug is valid: ${sub.slug}`);
      assert.ok(sub.nameBn.length > 0, `Subcategory Bengali name is defined: ${sub.nameBn}`);
      assert.ok(typeof sub.itemCount === 'number' && sub.itemCount > 0, `Subcategory has positive item count: ${sub.itemCount}`);
    }
    console.log('  ✅ PASS: All subcategories have valid routing slugs and item counts');
  });
});

describe('Suite 2: Component Architecture & Accessibility Attributes', () => {
  it('MegaMenu.tsx adheres to ARIA menu standards and routing triggers', () => {
    const megaMenuPath = path.resolve('src/components/layout/MegaMenu.tsx');
    assert.ok(fs.existsSync(megaMenuPath), 'MegaMenu.tsx file exists');
    const content = fs.readFileSync(megaMenuPath, 'utf8');

    assert.ok(content.includes('role="menu"'), 'MegaMenu declares role="menu"');
    assert.ok(content.includes('aria-label='), 'MegaMenu provides accessible aria-label');
    assert.ok(content.includes('/category/'), 'MegaMenu contains /category/ routing logic');
    assert.ok(content.includes('CategoryIcon'), 'MegaMenu imports and renders CategoryIcon');
    assert.ok(content.includes('onMouseEnter'), 'MegaMenu supports smooth hover transitions');
    assert.ok(content.includes('onMouseLeave'), 'MegaMenu supports mouse leave handlers');

    console.log('  ✅ PASS: MegaMenu.tsx complies with WCAG accessibility and routing standards');
  });

  it('MobileCategoryAccordion.tsx supports expandable tree hierarchy', () => {
    const mobileAccPath = path.resolve('src/components/layout/MobileCategoryAccordion.tsx');
    assert.ok(fs.existsSync(mobileAccPath), 'MobileCategoryAccordion.tsx exists');
    const content = fs.readFileSync(mobileAccPath, 'utf8');

    assert.ok(content.includes('expandedCat'), 'Implements expand/collapse state');
    assert.ok(content.includes('onSelectCategory'), 'Provides direct selection callback');
    assert.ok(content.includes('CategoryIcon'), 'Renders category icons');
    assert.ok(content.includes('ChevronDown'), 'Uses ChevronDown for open state');
    assert.ok(content.includes('ChevronRight'), 'Uses ChevronRight for collapsed state');

    console.log('  ✅ PASS: MobileCategoryAccordion.tsx supports expandable tree navigation');
  });

  it('Navigation.tsx integrates MegaMenu with Chevron indicator', () => {
    const navPath = path.resolve('src/components/layout/Navigation.tsx');
    const content = fs.readFileSync(navPath, 'utf8');

    assert.ok(content.includes('<MegaMenu'), 'Navigation renders MegaMenu component');
    assert.ok(content.includes('aria-haspopup="true"'), 'Navigation link has aria-haspopup="true"');
    assert.ok(content.includes('aria-expanded={isMegaMenuOpen}'), 'Navigation link has dynamic aria-expanded');
    assert.ok(content.includes('closeTimeoutRef'), 'Navigation prevents flicker using timeout cleanup');

    console.log('  ✅ PASS: Navigation.tsx integrates MegaMenu with hover debouncing');
  });
});

describe('Suite 3: File Governance & Constraint Enforcement', () => {
  it('All modified components strictly adhere to <= 200 line constraint', () => {
    const filesToCheck = [
      'src/components/common/CategoryIcon.tsx',
      'src/components/layout/MegaMenu.tsx',
      'src/components/layout/MobileCategoryAccordion.tsx',
      'src/components/layout/Navigation.tsx',
      'src/components/layout/MobileMenu.tsx',
      'src/components/shop/CategoryHierarchyFilter.tsx',
    ];

    for (const relPath of filesToCheck) {
      const fullPath = path.resolve(relPath);
      assert.ok(fs.existsSync(fullPath), `File exists: ${relPath}`);
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n').length;
      assert.ok(lines <= 200, `File ${relPath} has ${lines} lines, which must be <= 200`);
    }

    console.log('  ✅ PASS: All navigation and hierarchy components strictly <= 200 lines');
  });
});
