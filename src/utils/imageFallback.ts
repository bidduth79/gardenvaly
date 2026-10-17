/**
 * @file imageFallback.ts
 * @description Centralized fallback image system for Gardenvaly.
 * Provides authentic original photo defaults, category-specific photography,
 * and guaranteed offline-safe vector SVG fallbacks as an ultimate safety net.
 */

import React from 'react';

// Guaranteed offline-safe vector SVG fallbacks (zero HTTP requests, zero failure)
export const BOTANICAL_SVG_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23F4F7F4"/><circle cx="200" cy="200" r="140" fill="%23E7EFE8"/><g transform="translate(130, 110) scale(1.4)" fill="none" stroke="%23174D35" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M50 85 V15" /><path d="M50 15 C50 15 15 25 15 55 C15 75 35 85 50 85 Z" fill="%23174D35" fill-opacity="0.15" /><path d="M50 35 C50 35 85 45 85 75 C85 95 65 105 50 105 Z" fill="%235C8D50" fill-opacity="0.25" /><path d="M50 45 C50 45 30 55 30 70" /></g><text x="200" y="320" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="14" font-weight="700" fill="%23174D35" text-anchor="middle" letter-spacing="1.5">GARDENVALY</text><text x="200" y="342" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" fill="%236B7280" text-anchor="middle">গাছের ছবি শীঘ্রই আসছে</text></svg>`;

export const SEED_SVG_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23FFFDF5"/><circle cx="200" cy="200" r="140" fill="%23FEF3C7"/><g transform="translate(140, 120) scale(1.2)" fill="none" stroke="%23B45309" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M50 80 C20 80 15 45 50 15 C85 45 80 80 50 80 Z" fill="%23D97706" fill-opacity="0.2" /><path d="M50 80 V45" /></g><text x="200" y="320" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="14" font-weight="700" fill="%2392400E" text-anchor="middle" letter-spacing="1.5">PREMIUM SEEDS</text><text x="200" y="342" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" fill="%2378716C" text-anchor="middle">বীজের ছবি শীঘ্রই আসছে</text></svg>`;

export const TOOL_SVG_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23F8FAFC"/><circle cx="200" cy="200" r="140" fill="%23E2E8F0"/><g transform="translate(140, 120) scale(1.2)" fill="none" stroke="%23334155" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M25 75 L75 25" /><path d="M60 20 L80 40" /><circle cx="25" cy="75" r="8" fill="%2364748B" fill-opacity="0.3" /></g><text x="200" y="320" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="14" font-weight="700" fill="%231E293B" text-anchor="middle" letter-spacing="1.5">GARDEN SUPPLIES</text><text x="200" y="342" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" fill="%2364748B" text-anchor="middle">যন্ত্রপাতির ছবি শীঘ্রই আসছে</text></svg>`;

// Authentic high-resolution original photography for defaults and fallbacks
export const ORIGINAL_FALLBACK_IMAGES = {
  // Bundled local high-resolution original photos
  plant: '/images/defaults/default-plant.jpg',
  seed: '/images/defaults/default-seed.jpg',
  tool: '/images/defaults/default-tool.jpg',
  default: '/images/defaults/default-plant.jpg',

  // Curated category-specific original botanical photography
  indoor: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80',
  outdoor: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=80',
  fruit: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
  flower: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
  medicinal: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&auto=format&fit=crop&q=80',
  ornamental: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&auto=format&fit=crop&q=80',
  rare: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=80',
  vegetableSeed: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&auto=format&fit=crop&q=80',
  flowerSeed: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80',
  fruitSeed: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop&q=80',
  cropSeed: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
  gardeningTools: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80',
  plantCare: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
  pots: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80',
} as const;

// Backward-compatible alias
export const PHOTO_FALLBACKS = ORIGINAL_FALLBACK_IMAGES;

// Default fallback image is an authentic original photo
export const DEFAULT_FALLBACK_IMAGE = ORIGINAL_FALLBACK_IMAGES.default;

export interface FallbackOptions {
  type?: string;
  categorySlug?: string;
  category?: string;
}

/**
 * Resolves the most suitable original photo fallback URL based on product type or category.
 */
export function getProductFallbackImage(options?: FallbackOptions): string {
  if (!options) return ORIGINAL_FALLBACK_IMAGES.default;

  const type = options.type?.toLowerCase() || '';
  const slug = (options.categorySlug || options.category || '').toLowerCase();

  // 1. Seeds matching
  if (type === 'seed' || slug.includes('seed') || slug.includes('বীজ')) {
    if (slug.includes('veg') || slug.includes('সবজি')) return ORIGINAL_FALLBACK_IMAGES.vegetableSeed;
    if (slug.includes('flow') || slug.includes('ফুল')) return ORIGINAL_FALLBACK_IMAGES.flowerSeed;
    if (slug.includes('fruit') || slug.includes('ফল')) return ORIGINAL_FALLBACK_IMAGES.fruitSeed;
    if (slug.includes('agri') || slug.includes('কৃষি')) return ORIGINAL_FALLBACK_IMAGES.cropSeed;
    return ORIGINAL_FALLBACK_IMAGES.seed;
  }

  // 2. Tools & Supplies matching
  if (type === 'tool' || type === 'supplies' || slug.includes('tool') || slug.includes('সরঞ্জাম')) {
    if (slug.includes('care') || slug.includes('সার') || slug.includes('মাটি') || slug.includes('soil')) {
      return ORIGINAL_FALLBACK_IMAGES.plantCare;
    }
    if (slug.includes('pot') || slug.includes('টব') || slug.includes('planter')) {
      return ORIGINAL_FALLBACK_IMAGES.pots;
    }
    return ORIGINAL_FALLBACK_IMAGES.tool;
  }

  // 3. Plant categories matching
  if (slug.includes('fruit') || slug.includes('আম') || slug.includes('লেবু') || slug.includes('ফল')) {
    return ORIGINAL_FALLBACK_IMAGES.fruit;
  }
  if (slug.includes('flow') || slug.includes('গোলাপ') || slug.includes('ফুল')) {
    return ORIGINAL_FALLBACK_IMAGES.flower;
  }
  if (slug.includes('indoor') || slug.includes('ইনডোর')) {
    return ORIGINAL_FALLBACK_IMAGES.indoor;
  }
  if (slug.includes('medicin') || slug.includes('ঔষধি') || slug.includes('ভেষজ')) {
    return ORIGINAL_FALLBACK_IMAGES.medicinal;
  }
  if (slug.includes('ornament') || slug.includes('শোভাবর্ধক') || slug.includes('পাতা')) {
    return ORIGINAL_FALLBACK_IMAGES.ornamental;
  }
  if (slug.includes('rare') || slug.includes('বিরল') || slug.includes('বনসাই')) {
    return ORIGINAL_FALLBACK_IMAGES.rare;
  }
  if (slug.includes('outdoor') || slug.includes('আউটডোর') || slug.includes('ছাদবাগান')) {
    return ORIGINAL_FALLBACK_IMAGES.outdoor;
  }

  return ORIGINAL_FALLBACK_IMAGES.plant;
}

/**
 * Returns either the clean, non-empty image URL or the corresponding original photo fallback.
 */
export function getSafeImageUrl(
  rawUrl?: string | null,
  options?: FallbackOptions
): string {
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 4) {
    return rawUrl.trim();
  }
  return getProductFallbackImage(options);
}

/**
 * Handles img `onError` event to gracefully replace broken images with original photo fallback.
 * If the fallback photo also fails (e.g., offline), gracefully cascades to vector SVG.
 * Prevents recursive loops by nullifying onerror handler.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
): void {
  const target = event.currentTarget;
  target.onerror = null; // Prevent infinite error recursion

  const currentSrc = target.src;
  const intendedFallback = fallbackSrc || ORIGINAL_FALLBACK_IMAGES.default;

  // If already tried the fallback photo and that errored, fall back to offline SVG
  if (currentSrc.includes(intendedFallback) || currentSrc.endsWith(intendedFallback)) {
    target.src = BOTANICAL_SVG_FALLBACK;
  } else {
    target.src = intendedFallback;
  }
}
