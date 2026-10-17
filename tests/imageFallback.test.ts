/**
 * @file imageFallback.test.ts
 * @description Comprehensive automated tests for Gardenvaly original photo fallback and error resilience.
 */

import {
  BOTANICAL_SVG_FALLBACK,
  SEED_SVG_FALLBACK,
  TOOL_SVG_FALLBACK,
  ORIGINAL_FALLBACK_IMAGES,
  PHOTO_FALLBACKS,
  getProductFallbackImage,
  getSafeImageUrl,
  handleImageError,
} from '../src/utils/imageFallback';

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

console.log('\n🌿 Running Gardenvaly Product Image Fallback Automated Tests...\n');

// Suite 1: Offline-Safe SVG Data URI Integrity
console.log('--- Suite 1: Offline-Safe Vector SVG Fallbacks ---');
assert(
  BOTANICAL_SVG_FALLBACK.startsWith('data:image/svg+xml;utf8,<svg') && BOTANICAL_SVG_FALLBACK.includes('GARDENVALY'),
  'Botanical SVG fallback is a valid self-contained vector data URI with branding'
);
assert(
  SEED_SVG_FALLBACK.startsWith('data:image/svg+xml;utf8,<svg') && SEED_SVG_FALLBACK.includes('PREMIUM SEEDS'),
  'Seed SVG fallback is a valid vector data URI with seed branding'
);
assert(
  TOOL_SVG_FALLBACK.startsWith('data:image/svg+xml;utf8,<svg') && TOOL_SVG_FALLBACK.includes('GARDEN SUPPLIES'),
  'Tool SVG fallback is a valid vector data URI with supplies branding'
);
assert(
  BOTANICAL_SVG_FALLBACK.includes('ছবি শীঘ্রই আসছে') &&
  SEED_SVG_FALLBACK.includes('বীজের ছবি শীঘ্রই আসছে') &&
  TOOL_SVG_FALLBACK.includes('যন্ত্রপাতির ছবি শীঘ্রই আসছে'),
  'All SVG fallbacks include helpful bilingual Bengali advisory text'
);

// Suite 2: Category & Type Specific Original Photo Resolution
console.log('\n--- Suite 2: Category & Type Specific Fallback Resolution ---');
assert(
  getProductFallbackImage({ type: 'plant' }) === ORIGINAL_FALLBACK_IMAGES.plant,
  'Plant type resolves to original plant photo fallback'
);
assert(
  getProductFallbackImage({ type: 'seed' }) === ORIGINAL_FALLBACK_IMAGES.seed,
  'Seed type resolves to original seed photo fallback'
);
assert(
  getProductFallbackImage({ type: 'tool' }) === ORIGINAL_FALLBACK_IMAGES.tool,
  'Tool type resolves to original garden supplies photo fallback'
);
assert(
  getProductFallbackImage({ categorySlug: 'heirloom-seeds' }) === ORIGINAL_FALLBACK_IMAGES.seed,
  'Category slug containing seed resolves to seed photo fallback'
);
assert(
  getProductFallbackImage({ category: 'ফুলের বীজ' }) === ORIGINAL_FALLBACK_IMAGES.flowerSeed,
  'Bengali category containing ফুলের বীজ resolves to flower seed photo fallback'
);
assert(
  getProductFallbackImage({ category: 'বাগানের সরঞ্জাম' }) === ORIGINAL_FALLBACK_IMAGES.tool,
  'Bengali category containing সরঞ্জাম resolves to tool photo fallback'
);
assert(
  getProductFallbackImage({ category: 'ফলের গাছ' }) === ORIGINAL_FALLBACK_IMAGES.fruit,
  'Bengali category containing ফলের গাছ resolves to fruit plant photo fallback'
);
assert(
  getProductFallbackImage(undefined) === ORIGINAL_FALLBACK_IMAGES.default,
  'Undefined options gracefully falls back to default original plant photo'
);

// Suite 3: Safe Image URL Normalization
console.log('\n--- Suite 3: Safe Image URL Resolution (Empty, Undefined, Whitespace) ---');
assert(
  getSafeImageUrl(undefined) === ORIGINAL_FALLBACK_IMAGES.default,
  'Undefined rawUrl returns default original photo fallback'
);
assert(
  getSafeImageUrl(null) === ORIGINAL_FALLBACK_IMAGES.default,
  'Null rawUrl returns default original photo fallback'
);
assert(
  getSafeImageUrl('') === ORIGINAL_FALLBACK_IMAGES.default,
  'Empty string rawUrl returns default original photo fallback'
);
assert(
  getSafeImageUrl('    ') === ORIGINAL_FALLBACK_IMAGES.default,
  'Whitespace-only rawUrl returns default original photo fallback'
);
assert(
  getSafeImageUrl('', { type: 'seed' }) === ORIGINAL_FALLBACK_IMAGES.seed,
  'Empty string with seed type returns original seed photo fallback'
);
const validHttpUrl = 'https://images.unsplash.com/photo-1545241047-6083a3684587';
assert(
  getSafeImageUrl(validHttpUrl) === validHttpUrl,
  'Valid HTTP URL is preserved unchanged'
);
assert(
  getSafeImageUrl(`  ${validHttpUrl}  `) === validHttpUrl,
  'Valid HTTP URL with leading/trailing whitespace is properly trimmed'
);

// Suite 4: Broken Image onError Recovery & Infinite Loop Defense
console.log('\n--- Suite 4: Image Error Recovery & Infinite Recursion Prevention ---');
let targetOnerrorAssigned: unknown = () => {};
let targetSrcAssigned: string = 'broken-image.jpg';

const mockEvent = {
  currentTarget: {
    get onerror() {
      return targetOnerrorAssigned;
    },
    set onerror(val) {
      targetOnerrorAssigned = val;
    },
    get src() {
      return targetSrcAssigned;
    },
    set src(val: string) {
      targetSrcAssigned = val;
    },
  },
} as any;

handleImageError(mockEvent, ORIGINAL_FALLBACK_IMAGES.seed);

assert(
  mockEvent.currentTarget.onerror === null,
  'handleImageError sets onerror to null to prevent recursive infinite loops'
);
assert(
  mockEvent.currentTarget.src === ORIGINAL_FALLBACK_IMAGES.seed,
  'handleImageError updates target src to original seed photo fallback'
);

// Secondary error test: if photo fallback fails, it cascades to vector SVG
mockEvent.currentTarget.src = ORIGINAL_FALLBACK_IMAGES.seed;
handleImageError(mockEvent, ORIGINAL_FALLBACK_IMAGES.seed);

assert(
  mockEvent.currentTarget.src === BOTANICAL_SVG_FALLBACK,
  'handleImageError gracefully cascades to offline vector SVG when photo fails'
);

console.log(`\n========================================`);
console.log(`📊 Image Fallback Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
