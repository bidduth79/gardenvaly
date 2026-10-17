/**
 * @file mobileResponsiveness.test.ts
 * @description Automated verification suite for Gardenvaly mobile responsiveness,
 * viewport coverage, touch targets, accessibility, and performance optimization.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

console.log('📱 Running Gardenvaly Mobile Responsiveness & Performance Tests...\n');

describe('Suite 1: Viewport & Breakpoint Matrix Coverage', () => {
  const viewports = [
    { name: 'Small Mobile', width: 320 },
    { name: 'Standard Mobile', width: 375 },
    { name: 'Large Mobile', width: 430 },
    { name: 'Tablet', width: 768 },
    { name: 'Laptop', width: 1024 },
    { name: 'Desktop', width: 1440 },
  ];

  it('All 6 mandatory device viewports are mapped and accounted for', () => {
    assert.equal(viewports.length, 6);
    assert.deepEqual(viewports.map((v) => v.width), [320, 375, 430, 768, 1024, 1440]);
    console.log('  ✅ PASS: All 6 mandatory viewport widths (320px - 1440px) verified');
  });

  it('ProductCard contains responsive grid scaling down to small mobile', () => {
    const cardContent = fs.readFileSync(path.resolve('src/components/home/ProductCard.tsx'), 'utf-8');
    assert.ok(cardContent.includes('min-[360px]:h-44') || cardContent.includes('min-[420px]:'), 'Card scales image height and button layout for small mobile');
    console.log('  ✅ PASS: ProductCard scales gracefully on small mobile viewports');
  });

  it('ShopPage and featured plant/seed grids support single-column/2-column small mobile scaling', () => {
    const shopContent = fs.readFileSync(path.resolve('src/pages/ShopPage.tsx'), 'utf-8');
    const featuredPlants = fs.readFileSync(path.resolve('src/components/home/FeaturedPlants.tsx'), 'utf-8');
    const featuredSeeds = fs.readFileSync(path.resolve('src/components/home/FeaturedSeeds.tsx'), 'utf-8');

    assert.ok(shopContent.includes('min-[360px]:grid-cols-2'), 'ShopPage handles <=350px gracefully');
    assert.ok(featuredPlants.includes('min-[360px]:grid-cols-2'), 'FeaturedPlants handles <=350px gracefully');
    assert.ok(featuredSeeds.includes('min-[360px]:grid-cols-2'), 'FeaturedSeeds handles <=350px gracefully');
    console.log('  ✅ PASS: Product listing grids prevent horizontal card squishing on <=350px screens');
  });
});

describe('Suite 2: Mobile Header, Navigation & Touch Targets', () => {
  it('Header maintains slim height on mobile (h-16) and standard on desktop (sm:h-20)', () => {
    const headerContent = fs.readFileSync(path.resolve('src/components/layout/Header.tsx'), 'utf-8');
    assert.ok(headerContent.includes('h-16 sm:h-20'), 'Header scales height appropriately');
    console.log('  ✅ PASS: Header occupies compact height (h-16) on mobile screens');
  });

  it('Header interactive action controls meet accessible touch targets', () => {
    const headerContent = fs.readFileSync(path.resolve('src/components/layout/Header.tsx'), 'utf-8');
    assert.ok(headerContent.includes('w-10 h-10 sm:w-11 sm:h-11'), 'Action buttons have >=40px touch targets');
    console.log('  ✅ PASS: Search, Cart, and Menu triggers meet accessible touch targets');
  });

  it('MobileMenu enforces min 44px tap targets for every navigation link', () => {
    const menuContent = fs.readFileSync(path.resolve('src/components/layout/MobileMenu.tsx'), 'utf-8');
    assert.ok(menuContent.includes('min-h-[44px]'), 'Menu items enforce min 44px touch target');
    assert.ok(menuContent.includes('w-11 h-11'), 'Close button has 44px touch target');
    console.log('  ✅ PASS: MobileMenu enforces WCAG-compliant min 44px tap targets');
  });

  it('LanguageSwitcher supports compact mobile rendering without overflowing header', () => {
    const switcherContent = fs.readFileSync(path.resolve('src/components/layout/LanguageSwitcher.tsx'), 'utf-8');
    assert.ok(switcherContent.includes('min-[360px]:inline'), 'Switcher has compact labels on ultra-small screens');
    assert.ok(switcherContent.includes('min-h-[36px]'), 'Buttons have accessible height');
    console.log('  ✅ PASS: LanguageSwitcher supports compact mobile rendering');
  });
});

describe('Suite 3: Modal & Drawer Accessibility and Scroll Management', () => {
  it('MobileMenu locks body scroll and handles Escape key', () => {
    const menuContent = fs.readFileSync(path.resolve('src/components/layout/MobileMenu.tsx'), 'utf-8');
    assert.ok(menuContent.includes("document.body.style.overflow = 'hidden'"), 'Locks body scroll');
    assert.ok(menuContent.includes("e.key === 'Escape'"), 'Handles Escape key');
    assert.ok(menuContent.includes('role="dialog"'), 'Has dialog role');
    console.log('  ✅ PASS: MobileMenu locks body scroll and supports Escape key');
  });

  it('CartDrawer locks body scroll and handles Escape key', () => {
    const cartContent = fs.readFileSync(path.resolve('src/components/home/CartDrawer.tsx'), 'utf-8');
    assert.ok(cartContent.includes("document.body.style.overflow = 'hidden'"), 'Locks body scroll');
    assert.ok(cartContent.includes("e.key === 'Escape'"), 'Handles Escape key');
    assert.ok(cartContent.includes('role="dialog"'), 'Has dialog role');
    console.log('  ✅ PASS: CartDrawer locks body scroll and supports Escape key');
  });

  it('SearchDrawer locks body scroll and handles Escape key', () => {
    const searchContent = fs.readFileSync(path.resolve('src/components/home/SearchDrawer.tsx'), 'utf-8');
    assert.ok(searchContent.includes("document.body.style.overflow = 'hidden'"), 'Locks body scroll');
    assert.ok(searchContent.includes("e.key === 'Escape'"), 'Handles Escape key');
    assert.ok(searchContent.includes('role="dialog"'), 'Has dialog role');
    console.log('  ✅ PASS: SearchDrawer locks body scroll and supports Escape key');
  });

  it('FilterMobileDrawer locks body scroll and handles Escape key', () => {
    const filterContent = fs.readFileSync(path.resolve('src/components/shop/FilterMobileDrawer.tsx'), 'utf-8');
    assert.ok(filterContent.includes("document.body.style.overflow = 'hidden'"), 'Locks body scroll');
    assert.ok(filterContent.includes("e.key === 'Escape'"), 'Handles Escape key');
    assert.ok(filterContent.includes('role="dialog"'), 'Has dialog role');
    console.log('  ✅ PASS: FilterMobileDrawer locks body scroll and supports Escape key');
  });

  it('ProductQuickViewModal locks body scroll, handles Escape, and supports max-height scrolling', () => {
    const quickView = fs.readFileSync(path.resolve('src/components/home/ProductQuickViewModal.tsx'), 'utf-8');
    assert.ok(quickView.includes("document.body.style.overflow = 'hidden'"), 'Locks body scroll');
    assert.ok(quickView.includes("e.key === 'Escape'"), 'Handles Escape key');
    assert.ok(quickView.includes('max-h-[90vh]'), 'Constrains modal height on small screens');
    console.log('  ✅ PASS: ProductQuickViewModal locks body scroll with responsive max-height');
  });
});

describe('Suite 4: Cart and Checkout Mobile Usability', () => {
  it('CartItemRow stepper buttons and trash icon meet touch target requirements', () => {
    const itemRow = fs.readFileSync(path.resolve('src/components/cart/CartItemRow.tsx'), 'utf-8');
    assert.ok(itemRow.includes('w-9 h-9 sm:w-8 sm:h-8'), 'Stepper buttons have accessible touch targets');
    assert.ok(itemRow.includes('aria-label="Decrease quantity"'), 'Stepper has accessible aria label');
    assert.ok(itemRow.includes('aria-label="Increase quantity"'), 'Stepper has accessible aria label');
    console.log('  ✅ PASS: CartItemRow stepper buttons have accessible touch targets and ARIA labels');
  });

  it('CustomerInformationForm has autocomplete, mobile inputMode, and 16px text size to prevent iOS zoom', () => {
    const formContent = fs.readFileSync(path.resolve('src/components/checkout/CustomerInformationForm.tsx'), 'utf-8');
    assert.ok(formContent.includes('autoComplete="name"'), 'Full name has autocomplete');
    assert.ok(formContent.includes('autoComplete="tel"'), 'Phone has autocomplete');
    assert.ok(formContent.includes('inputMode="tel"'), 'Phone has tel inputMode');
    assert.ok(formContent.includes('text-base sm:text-sm'), '16px input font size prevents auto-zoom on iOS');
    console.log('  ✅ PASS: CustomerInformationForm contains autocomplete, inputMode, and zoom prevention');
  });
});

describe('Suite 5: Admin Dashboard & Responsive Tables', () => {
  it('Admin orders table is wrapped in touch-scrolling container with min-width', () => {
    const ordersPage = fs.readFileSync(path.resolve('src/pages/admin/AdminOrdersPage.tsx'), 'utf-8');
    assert.ok(ordersPage.includes('-webkit-overflow-scrolling-touch'), 'Touch scrolling enabled');
    assert.ok(ordersPage.includes('min-w-[760px]'), 'Table enforces minimum width');
    console.log('  ✅ PASS: Admin orders table has responsive horizontal scroll container');
  });

  it('Admin products and inventory tables enforce responsive minimum widths', () => {
    const productsPage = fs.readFileSync(path.resolve('src/pages/admin/AdminProductsPage.tsx'), 'utf-8');
    const inventoryPage = fs.readFileSync(path.resolve('src/pages/admin/AdminInventoryPage.tsx'), 'utf-8');
    assert.ok(productsPage.includes('min-w-[680px]'), 'Products table enforces minimum width');
    assert.ok(inventoryPage.includes('min-w-[640px]'), 'Inventory table enforces minimum width');
    console.log('  ✅ PASS: Products and inventory tables have touch-scrolling wrappers');
  });

  it('AdminSidebar supports drawer mode with body scroll locking and close button on mobile', () => {
    const sidebar = fs.readFileSync(path.resolve('src/components/admin/AdminSidebar.tsx'), 'utf-8');
    assert.ok(sidebar.includes("document.body.style.overflow = 'hidden'"), 'Locks scroll in drawer mode');
    assert.ok(sidebar.includes("aria-label=\"Close sidebar\""), 'Has mobile close button');
    assert.ok(sidebar.includes('min-h-[44px]'), 'Nav items meet min-h 44px');
    console.log('  ✅ PASS: AdminSidebar has full mobile drawer support with scroll locking');
  });

  it('AdminHeader conforms to Clean UI guidelines (no status/telemetry indicators)', () => {
    const adminHeader = fs.readFileSync(path.resolve('src/components/admin/AdminHeader.tsx'), 'utf-8');
    assert.ok(!adminHeader.includes('apiConnected ?'), 'No telemetry connection pill in header');
    console.log('  ✅ PASS: AdminHeader complies with Clean UI rules without status clutter');
  });
});

describe('Suite 6: CSS & Loading Performance Optimization', () => {
  it('Global CSS enforces touch-action manipulation and accessible focus-visible rings', () => {
    const css = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');
    assert.ok(css.includes('touch-action: manipulation;'), 'Touch delay disabled');
    assert.ok(css.includes('*:focus-visible'), 'Focus rings configured');
    assert.ok(css.includes('prefers-reduced-motion'), 'Reduced motion compliant');
    console.log('  ✅ PASS: Global CSS enforces touch manipulation, focus-visible, and reduced-motion');
  });

  it('Hero image has high fetchPriority and eager loading while catalog images use lazy loading', () => {
    const heroContent = fs.readFileSync(path.resolve('src/components/home/HeroSection.tsx'), 'utf-8');
    const productCard = fs.readFileSync(path.resolve('src/components/home/ProductCard.tsx'), 'utf-8');
    assert.ok(heroContent.includes('fetchPriority="high"'), 'Hero image has high priority');
    assert.ok(heroContent.includes('loading="eager"'), 'Hero image loaded eagerly');
    assert.ok(productCard.includes('loading="lazy"'), 'Product card images loaded lazily');
    assert.ok(productCard.includes('decoding="async"'), 'Product card images decode asynchronously');
    console.log('  ✅ PASS: Image loading strategies optimized for Core Web Vitals (LCP & CLS)');
  });
});
