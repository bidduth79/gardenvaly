/**
 * @file seoOptimization.test.ts
 * @description Comprehensive automated test suite validating SEO, Google integration readiness,
 * XML sitemaps, robots.txt, Schema.org JSON-LD structured data, and bilingual discoverability.
 */

import { seoService } from '../server/services/seoService';
import { db } from '../server/db/database';
import { analyticsService } from '../src/services/analyticsService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    failed++;
  }
}

console.log('\n🌿 Running Gardenvaly SEO, Google Integration & Discoverability Tests...\n');

const BASE_URL = 'https://gardenvaly.com';

// -------------------------------------------------------------
// Suite 1: Unique Page Titles and Descriptions across Public Routes
// -------------------------------------------------------------
console.log('--- Suite 1: Route Metadata & Hierarchy ---');

const homeSeoBn = seoService.getPageSeoData('/', 'bn', BASE_URL);
const homeSeoEn = seoService.getPageSeoData('/', 'en', BASE_URL);

assert(
  homeSeoBn.title.includes('গার্ডেনভ্যালি') && homeSeoBn.title.includes('সবুজে সাজুক জীবন'),
  'Homepage Bengali title includes brand and Bengali tagline'
);

assert(
  homeSeoEn.title.includes('Gardenvaly') && homeSeoEn.title.includes('Grow Green, Live Beautiful'),
  'Homepage English title includes brand and English tagline'
);

assert(
  homeSeoBn.title !== homeSeoEn.title,
  'Homepage Bengali and English titles are distinct and language-specific'
);

const shopSeo = seoService.getPageSeoData('/shop', 'en', BASE_URL);
const plantsSeo = seoService.getPageSeoData('/plants', 'en', BASE_URL);
const seedsSeo = seoService.getPageSeoData('/seeds', 'en', BASE_URL);

assert(
  shopSeo.title !== plantsSeo.title && plantsSeo.title !== seedsSeo.title,
  'Shop, Plants, and Seeds listing routes have distinct, descriptive titles'
);

assert(
  shopSeo.description.length >= 50 && shopSeo.description.length <= 160,
  `Shop description is within optimal snippet length (${shopSeo.description.length} chars)`
);

// -------------------------------------------------------------
// Suite 2: Real Product Metadata & Truthful Field Extraction
// -------------------------------------------------------------
console.log('--- Suite 2: Real Product Metadata Extraction ---');

const product = db.findProductBySlug('monstera-deliciosa');
assert(!!product, 'Database contains real test product (monstera-deliciosa)');

if (product) {
  const prodSeoEn = seoService.getPageSeoData('/product/monstera-deliciosa', 'en', BASE_URL);
  const prodSeoBn = seoService.getPageSeoData('/product/monstera-deliciosa', 'bn', BASE_URL);

  assert(
    prodSeoEn.title.includes(product.nameEn),
    `English product title includes real product name "${product.nameEn}"`
  );

  assert(
    prodSeoBn.title.includes(product.nameBn),
    `Bengali product title includes real Bengali product name "${product.nameBn}"`
  );

  assert(
    prodSeoEn.canonicalUrl === `${BASE_URL}/product/monstera-deliciosa`,
    'Product canonical URL points to clean canonical path without trailing slash issues'
  );

  assert(
    prodSeoEn.robots === 'index, follow',
    'Published product is marked for index and follow'
  );

  assert(
    prodSeoEn.ogType === 'product',
    'Product page OpenGraph type is "product"'
  );

  assert(
    prodSeoEn.ogImage === product.imageUrl || prodSeoEn.ogImage === product.images[0],
    'Product OpenGraph image uses real product photograph'
  );
}

// -------------------------------------------------------------
// Suite 3: Canonical URLs and Hreflang Annotations
// -------------------------------------------------------------
console.log('--- Suite 3: Canonical & Hreflang Configuration ---');

const catSeo = seoService.getPageSeoData('/category/indoor-plants', 'en', BASE_URL);

assert(
  catSeo.canonicalUrl === `${BASE_URL}/category/indoor-plants`,
  'Category page canonical URL matches absolute URL'
);

assert(
  catSeo.hreflang.bn === `${BASE_URL}/category/indoor-plants?lang=bn` &&
  catSeo.hreflang.en === `${BASE_URL}/category/indoor-plants?lang=en` &&
  catSeo.hreflang.xDefault === `${BASE_URL}/category/indoor-plants`,
  'Hreflang alternates correctly specify bn, en, and x-default targets'
);

// -------------------------------------------------------------
// Suite 4: XML Sitemap Generation & Route Filtering
// -------------------------------------------------------------
console.log('--- Suite 4: XML Sitemap Generation & Privacy Filtering ---');

const sitemap = seoService.generateSitemapXml(BASE_URL);

assert(
  sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
  'Sitemap has valid XML declaration'
);

assert(
  sitemap.includes('<urlset') && sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'),
  'Sitemap uses standard sitemaps.org namespace with xhtml namespace for alternates'
);

assert(
  sitemap.includes(`${BASE_URL}/`) &&
  sitemap.includes(`${BASE_URL}/shop`) &&
  sitemap.includes(`${BASE_URL}/plants`) &&
  sitemap.includes(`${BASE_URL}/seeds`),
  'Sitemap includes all core public indexable hub routes'
);

assert(
  sitemap.includes(`${BASE_URL}/product/monstera-deliciosa`),
  'Sitemap includes published product URL'
);

assert(
  !sitemap.includes('/admin') &&
  !sitemap.includes('/cart') &&
  !sitemap.includes('/checkout') &&
  !sitemap.includes('/api/'),
  'Sitemap strictly excludes admin, cart, checkout, and API endpoints'
);

assert(
  sitemap.includes('hreflang="bn"') && sitemap.includes('hreflang="en"'),
  'Sitemap entries contain bilingual alternate language tags'
);

// -------------------------------------------------------------
// Suite 5: Robots.txt Directives & Sitemap Reference
// -------------------------------------------------------------
console.log('--- Suite 5: Robots.txt Directives ---');

const robotsTxt = seoService.generateRobotsTxt(BASE_URL);

assert(
  robotsTxt.includes('User-agent: *'),
  'Robots.txt addresses all web crawlers'
);

assert(
  robotsTxt.includes('Allow: /') &&
  robotsTxt.includes('Allow: /product/') &&
  robotsTxt.includes('Allow: /category/'),
  'Robots.txt allows public product and category paths'
);

assert(
  robotsTxt.includes('Disallow: /admin') &&
  robotsTxt.includes('Disallow: /cart') &&
  robotsTxt.includes('Disallow: /checkout') &&
  robotsTxt.includes('Disallow: /api/'),
  'Robots.txt disallows private administrative and checkout URLs'
);

assert(
  robotsTxt.includes(`Sitemap: ${BASE_URL}/sitemap.xml`),
  'Robots.txt contains absolute reference to production sitemap'
);

// -------------------------------------------------------------
// Suite 6: Schema.org Structured Data (JSON-LD) Validation
// -------------------------------------------------------------
console.log('--- Suite 6: Schema.org JSON-LD Structured Data ---');

const homeSchemas = homeSeoEn.jsonLd;
const storeSchema = homeSchemas.find((s) => s['@type'] === 'OnlineStore');
const websiteSchema = homeSchemas.find((s) => s['@type'] === 'WebSite');

assert(!!storeSchema, 'Homepage includes Schema.org OnlineStore schema');
if (storeSchema) {
  assert(
    storeSchema.name === 'Gardenvaly by Hasna Hena',
    'Store schema displays truthful business name'
  );
  assert(
    storeSchema.priceRange === '৳৳',
    'Store schema reflects truthful Bangladeshi Taka price range'
  );
}

assert(!!websiteSchema, 'Homepage includes Schema.org WebSite schema with SearchAction');

const prodSeo = seoService.getPageSeoData('/product/monstera-deliciosa', 'en', BASE_URL);
const prodSchema = prodSeo.jsonLd.find((s) => s['@type'] === 'Product') as Record<string, unknown> | undefined;

assert(!!prodSchema, 'Product page includes Schema.org Product schema');
if (prodSchema) {
  assert(
    prodSchema.name === 'Monstera Deliciosa',
    'Product schema has exact product name'
  );
  assert(
    prodSchema.sku === 'GV-PL-001',
    'Product schema has actual SKU identifier'
  );
  const offers = prodSchema.offers as Record<string, unknown>;
  assert(
    offers && offers.price === 850 && offers.priceCurrency === 'BDT',
    `Product offer accurately reflects actual price (৳850) and currency (BDT)`
  );
  assert(
    offers.availability === 'https://schema.org/InStock',
    'In-stock item sets Schema.org InStock availability'
  );

  const aggregateRating = prodSchema.aggregateRating as Record<string, unknown>;
  assert(
    aggregateRating && aggregateRating.ratingValue === 4.9 && aggregateRating.reviewCount === 38,
    'Aggregate rating reflects truthful real review count without fabrication'
  );
}

const breadcrumbSchema = prodSeo.jsonLd.find((s) => s['@type'] === 'BreadcrumbList');
assert(!!breadcrumbSchema, 'Product page includes Schema.org BreadcrumbList schema');

// -------------------------------------------------------------
// Suite 7: 404 & Missing Product Handling
// -------------------------------------------------------------
console.log('--- Suite 7: 404 & Missing Slugs Handling ---');

const missingSeo = seoService.getPageSeoData('/product/non-existent-flower', 'en', BASE_URL);

assert(
  missingSeo.statusCode === 404,
  'Missing product returns 404 HTTP status code indicator'
);

assert(
  missingSeo.robots === 'noindex, nofollow',
  'Missing product is protected from indexation with "noindex, nofollow"'
);

assert(
  missingSeo.title.includes('Product Not Found'),
  'Missing product returns clean descriptive 404 title'
);

// -------------------------------------------------------------
// Suite 8: Admin & Private Route Protection
// -------------------------------------------------------------
console.log('--- Suite 8: Private Area Indexation Defense ---');

const adminSeo = seoService.getPageSeoData('/admin/orders', 'en', BASE_URL);
const cartSeo = seoService.getPageSeoData('/cart', 'en', BASE_URL);
const checkoutSeo = seoService.getPageSeoData('/checkout', 'en', BASE_URL);

assert(
  adminSeo.robots === 'noindex, nofollow',
  'Admin orders page enforces noindex, nofollow'
);

assert(
  cartSeo.robots === 'noindex, nofollow',
  'Cart page enforces noindex, nofollow'
);

assert(
  checkoutSeo.robots === 'noindex, nofollow',
  'Checkout page enforces noindex, nofollow'
);

// -------------------------------------------------------------
// Suite 9: Server HTML Head Injection
// -------------------------------------------------------------
console.log('--- Suite 9: Server HTML Head Injection ---');

const sampleHtml = `<!doctype html><html><head><title>Old Title</title></head><body><div id="root"></div></body></html>`;
const injectedHtml = seoService.injectSeoIntoHtml(sampleHtml, prodSeo);

assert(
  injectedHtml.includes('<title>Monstera Deliciosa'),
  'HTML head injection updates <title>'
);

assert(
  injectedHtml.includes('<meta property="og:title"'),
  'HTML head injection adds OpenGraph title tag'
);

assert(
  injectedHtml.includes('<meta name="twitter:card" content="summary_large_image" />'),
  'HTML head injection adds Twitter card tag'
);

assert(
  injectedHtml.includes('id="gardenvaly-schema" type="application/ld+json"'),
  'HTML head injection injects Schema.org JSON-LD tag'
);

assert(
  injectedHtml.includes('<link rel="canonical" href="https://gardenvaly.com/product/monstera-deliciosa" />'),
  'HTML head injection injects canonical link tag'
);

// -------------------------------------------------------------
// Suite 10: Analytics Readiness & Privacy Defense
// -------------------------------------------------------------
console.log('--- Suite 10: GA4 Analytics Readiness & Privacy Protection ---');

assert(
  analyticsService.isTrackingActive() === false,
  'Analytics remains inactive when measurement ID is not configured (prevents phantom scripts)'
);

// Verify safe tracking does not throw even when invoked while inactive
analyticsService.trackPageView('/shop', 'Shop Plants');
analyticsService.trackAddToCart(product as unknown as any, 1, 'en');
analyticsService.trackPurchase('GV-TEST-001', 850, [
  { productId: 'plant-1', productName: 'Monstera Deliciosa', quantity: 1, unitPrice: 850 },
]);

assert(true, 'Analytics methods gracefully handle inactive state without runtime exceptions');

console.log('\n========================================');
console.log(`📊 SEO & Discoverability Test Summary: ${passed} Passed, ${failed} Failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
