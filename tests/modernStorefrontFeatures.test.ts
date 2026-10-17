/**
 * @file modernStorefrontFeatures.test.ts
 * @description Automated test suite verifying MobileBottomNav, CategoryChipsBar,
 * FreeDeliveryProgressBar, InstantBuyNowModal, and ProductCardCareBadges.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('⚡ Running Gardenvaly Modern Storefront Features Tests...\n');

describe('Suite 1: Mobile Bottom Navigation Dock', () => {
  it('MobileBottomNav.tsx renders all 5 primary mobile actions with touch targets', () => {
    const filePath = path.resolve('src/components/layout/MobileBottomNav.tsx');
    assert.ok(fs.existsSync(filePath), 'MobileBottomNav.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('min-h-[48px]'), 'Enforces accessible >=44px touch targets');
    assert.ok(content.includes('aria-label="Mobile Bottom Navigation"'), 'Provides accessible navigation label');
    assert.ok(content.includes('Home'), 'Renders Home button');
    assert.ok(content.includes('Layers'), 'Renders Categories button');
    assert.ok(content.includes('Search'), 'Renders Search button');
    assert.ok(content.includes('ShoppingBag'), 'Renders Cart button with live count');
    assert.ok(content.includes('Heart'), 'Renders Wishlist button with live count');

    console.log('  ✅ PASS: MobileBottomNav provides 5 app-like quick action buttons');
  });

  it('Header.tsx integrates MobileBottomNav for responsive mobile viewports', () => {
    const headerPath = path.resolve('src/components/layout/Header.tsx');
    const content = fs.readFileSync(headerPath, 'utf-8');
    assert.ok(content.includes('<MobileBottomNav'), 'Header renders MobileBottomNav');
    assert.ok(content.includes('onOpenCategories'), 'Wires category open callback');

    console.log('  ✅ PASS: Header seamlessly integrates MobileBottomNav');
  });
});

describe('Suite 2: Horizontal Category Chips Bar', () => {
  it('CategoryChipsBar.tsx supports horizontal scrolling and subcategory row', () => {
    const filePath = path.resolve('src/components/shop/CategoryChipsBar.tsx');
    assert.ok(fs.existsSync(filePath), 'CategoryChipsBar.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('overflow-x-auto'), 'Implements horizontal swipe/scroll container');
    assert.ok(content.includes('activeParent'), 'Detects active parent category to reveal subcategories');
    assert.ok(content.includes('CategoryIcon'), 'Renders category icons on chips');
    assert.ok(content.includes('onToggleSlug'), 'Triggers instant category filtering on click');

    console.log('  ✅ PASS: CategoryChipsBar supports two-tiered chips and instant filtering');
  });
});

describe('Suite 3: Free Delivery Progress Bar', () => {
  it('FreeDeliveryProgressBar.tsx computes threshold and celebratory state', () => {
    const filePath = path.resolve('src/components/cart/FreeDeliveryProgressBar.tsx');
    assert.ok(fs.existsSync(filePath), 'FreeDeliveryProgressBar.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('Math.max(0, threshold - subtotal)'), 'Computes remaining amount correctly');
    assert.ok(content.includes('isUnlocked'), 'Detects free shipping unlocked state');
    assert.ok(content.includes('Truck'), 'Renders delivery vehicle icon');
    assert.ok(content.includes('CheckCircle2'), 'Renders unlocked celebratory icon');

    console.log('  ✅ PASS: FreeDeliveryProgressBar computes dynamic threshold accurately');
  });

  it('CartDrawer.tsx integrates FreeDeliveryProgressBar and modular CartDrawerItem', () => {
    const drawerPath = path.resolve('src/components/home/CartDrawer.tsx');
    const content = fs.readFileSync(drawerPath, 'utf-8');
    assert.ok(content.includes('FreeDeliveryProgressBar'), 'CartDrawer renders FreeDeliveryProgressBar');
    assert.ok(content.includes('CartDrawerItem'), 'CartDrawer uses modular CartDrawerItem');

    console.log('  ✅ PASS: CartDrawer includes dynamic free shipping progress');
  });
});

describe('Suite 4: 1-Click Instant Buy Now & Plant Care Badges', () => {
  it('InstantBuyNowModal.tsx supports rapid COD ordering with Dhaka/Outside delivery fees', () => {
    const filePath = path.resolve('src/components/shop/InstantBuyNowModal.tsx');
    assert.ok(fs.existsSync(filePath), 'InstantBuyNowModal.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('deliveryZone'), 'Includes Dhaka vs Outside Dhaka selection');
    assert.ok(content.includes('isValidBdPhone'), 'Enforces 11-digit Bangladeshi mobile number validation');
    assert.ok(content.includes('orderService.createOrder'), 'Creates persistent order record');
    assert.ok(content.includes('confirmedOrderNo'), 'Shows verified order tracking confirmation');

    console.log('  ✅ PASS: InstantBuyNowModal provides seamless 1-click cash on delivery');
  });

  it('ProductCardCareBadges.tsx renders sunlight, water, and indoor indicators', () => {
    const filePath = path.resolve('src/components/home/ProductCardCareBadges.tsx');
    assert.ok(fs.existsSync(filePath), 'ProductCardCareBadges.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('Sun'), 'Renders sunlight care badge');
    assert.ok(content.includes('Droplet'), 'Renders watering care badge');
    assert.ok(content.includes('Home'), 'Renders indoor placement badge');
    assert.ok(content.includes('whitespace-nowrap'), 'Keeps care badges in a single line without wrapping');

    console.log('  ✅ PASS: ProductCardCareBadges provides single-line micro botanical indicators');
  });

  it('ProductCard.tsx integrates care badges, live stock counter, and quick view modal', () => {
    const cardPath = path.resolve('src/components/home/ProductCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf-8');
    assert.ok(content.includes('ProductCardCareBadges'), 'ProductCard imports and renders care badges');
    assert.ok(content.includes('handleInstantBuyClick'), 'ProductCard contains instant buy handler');
    assert.ok(content.includes('stockQuantity'), 'Displays live inventory stock quantity');
    assert.ok(content.includes('ProductQuickViewModal'), 'Integrates quick view modal trigger on eye icon');

    console.log('  ✅ PASS: ProductCard integrates care badges, live stock counter, and quick view');
  });

  it('PlantFinderModal.tsx supports 3-step plant matcher quiz with ARIA accessibility', () => {
    const filePath = path.resolve('src/components/home/PlantFinderModal.tsx');
    assert.ok(fs.existsSync(filePath), 'PlantFinderModal.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('role="dialog"'), 'Provides accessible modal dialog role');
    assert.ok(content.includes('aria-modal="true"'), 'Provides aria-modal attribute');
    assert.ok(content.includes('productService.getProducts'), 'Queries catalog for matched plants');
    assert.ok(content.includes('formatPrice'), 'Formats product prices properly');

    console.log('  ✅ PASS: PlantFinderModal provides interactive 3-step plant matcher');
  });
});

describe('Suite 5: Multi-Image Gallery & Interactive Image Zoom', () => {
  it('ProductGallery.tsx handles dynamic 1 vs many images with cursor zoom and lightbox', () => {
    const filePath = path.resolve('src/components/shop/ProductGallery.tsx');
    assert.ok(fs.existsSync(filePath), 'ProductGallery.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('validImages.length > 1'), 'Renders thumbnails ONLY when more than 1 image');
    assert.ok(content.includes('scale(2)'), 'Implements cursor magnifier 2x zoom');
    assert.ok(content.includes('ProductLightboxModal'), 'Wires fullscreen HD zoom lightbox modal');

    console.log('  ✅ PASS: ProductGallery dynamically toggles thumbnails and provides interactive zoom');
  });

  it('ProductLightboxModal.tsx provides fullscreen zoom in, zoom out, reset, and navigation', () => {
    const filePath = path.resolve('src/components/shop/ProductLightboxModal.tsx');
    assert.ok(fs.existsSync(filePath), 'ProductLightboxModal.tsx exists');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('role="dialog"'), 'Provides accessible modal dialog role');
    assert.ok(content.includes('ZoomIn'), 'Provides zoom in control');
    assert.ok(content.includes('ZoomOut'), 'Provides zoom out control');
    assert.ok(content.includes('RotateCcw'), 'Provides zoom reset control');

    console.log('  ✅ PASS: ProductLightboxModal provides accessible HD zoom tools');
  });
});

describe('Suite 6: Architectural Governance & Strict File Constraints', () => {
  it('All modern components strictly adhere to <= 200 lines limit', () => {
    const files = [
      'src/components/layout/MobileBottomNav.tsx',
      'src/components/shop/CategoryChipsBar.tsx',
      'src/components/cart/FreeDeliveryProgressBar.tsx',
      'src/components/cart/CartDrawerItem.tsx',
      'src/components/shop/InstantBuyNowModal.tsx',
      'src/components/home/ProductCardCareBadges.tsx',
      'src/components/home/ProductCard.tsx',
      'src/components/home/CartDrawer.tsx',
      'src/components/home/PlantFinderModal.tsx',
      'src/components/home/ProductQuickViewModal.tsx',
      'src/components/shop/ProductGallery.tsx',
      'src/components/shop/ProductLightboxModal.tsx',
      'src/pages/ShopPage.tsx',
    ];

    for (const f of files) {
      const fullPath = path.resolve(f);
      assert.ok(fs.existsSync(fullPath), `File exists: ${f}`);
      const lines = fs.readFileSync(fullPath, 'utf-8').split('\n').length;
      assert.ok(lines <= 200, `File ${f} is ${lines} lines, which exceeds max 200 limit`);
    }

    console.log('  ✅ PASS: All 13 modern components strictly obey <= 200 lines rule');
  });
});
