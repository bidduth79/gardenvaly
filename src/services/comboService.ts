/**
 * @file comboService.ts
 * @description Centralized service for managing Gardenvaly Combo Packs,
 * Custom Bundle Builder settings, and Frequently Bought Together configurations.
 * Supports full Admin CRUD with real-time storefront synchronization.
 */

import { Product } from '../types/product';

export const COMBOS_STORAGE_KEY = 'gardenvaly_combo_packs_v1';
export const COMBO_SETTINGS_STORAGE_KEY = 'gardenvaly_combo_settings_v1';
export const COMBOS_UPDATED_EVENT = 'gardenvaly_combos_updated';

export interface ComboItem {
  id: string;
  nameBn: string;
  nameEn: string;
  quantityLabelBn: string;
  quantityLabelEn: string;
  imageUrl: string;
  unitPrice: number;
}

export interface ComboPack {
  id: string;
  slug: string;
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  imageUrl: string;
  regularPrice: number;
  comboPrice: number;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  soldCount: number;
  rating: number;
  items: ComboItem[];
  benefitsBn: string[];
  benefitsEn: string[];
}

export interface ComboSettings {
  customComboEnabled: boolean;
  customComboDiscountPercent: number;
  fbtEnabled: boolean;
  fbtDiscountPercent: number;
}

export const DEFAULT_COMBO_SETTINGS: ComboSettings = {
  customComboEnabled: true,
  customComboDiscountPercent: 15,
  fbtEnabled: true,
  fbtDiscountPercent: 10,
};

export const DEFAULT_COMBO_PACKS: ComboPack[] = [
  {
    id: 'combo-indoor-air-trio',
    slug: 'indoor-air-purifying-trio-combo',
    badgeBn: 'বেস্টসেলার ইনডোর কম্বো',
    badgeEn: 'Bestseller Indoor Combo',
    titleBn: 'বেডরুম ও অফিস এয়ার-পিউরিফাইং কম্বো (৩টি গাছ + টব)',
    titleEn: 'Bedroom & Office Air-Purifying Trio Combo',
    subtitleBn:
      'ঘরের বাতাস বিশুদ্ধ রাখতে কম আলোতে বেঁচে থাকা ৩টি জনপ্রিয় ইনডোর প্ল্যান্ট ও ম্যাচিং নার্সারি টবের সাশ্রয়ী বান্ডেল।',
    subtitleEn:
      'Three low-light air-purifying indoor plants paired with matching nursery pots for a fresh home or desk.',
    imageUrl:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80',
    regularPrice: 1050,
    comboPrice: 850,
    isActive: true,
    isFeatured: true,
    stockQuantity: 18,
    soldCount: 142,
    rating: 4.9,
    items: [
      {
        id: 'ci-1',
        nameBn: 'স্নেক প্ল্যান্ট (স্যানসেভেরিয়া)',
        nameEn: 'Snake Plant (Sansevieria)',
        quantityLabelBn: '১টি ঝোপালো চারা',
        quantityLabelEn: '1 Bushy Plant',
        imageUrl:
          'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=300&q=80',
        unitPrice: 350,
      },
      {
        id: 'ci-2',
        nameBn: 'গোল্ডেন মানি প্ল্যান্ট (পোথোস)',
        nameEn: 'Golden Money Plant (Pothos)',
        quantityLabelBn: '১টি লতানো চারা',
        quantityLabelEn: '1 Trailing Plant',
        imageUrl:
          'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=300&q=80',
        unitPrice: 220,
      },
      {
        id: 'ci-3',
        nameBn: 'পিস লিলি (Peace Lily)',
        nameEn: 'Peace Lily Indoor Plant',
        quantityLabelBn: '১টি সতেজ চারা',
        quantityLabelEn: '1 Healthy Plant',
        imageUrl:
          'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=300&q=80',
        unitPrice: 380,
      },
      {
        id: 'ci-4',
        nameBn: 'প্রিমিয়াম নার্সারি টব সেট',
        nameEn: 'Premium Nursery Planter Set',
        quantityLabelBn: '৩টি টব',
        quantityLabelEn: '3 Planters',
        imageUrl:
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80',
        unitPrice: 100,
      },
    ],
    benefitsBn: [
      'কম আলো ও এসি রুমে সহজেই সতেজ থাকে',
      'সপ্তাহে মাত্র ১-২ দিন পানি দিলেই চলে',
      'ঘরের অক্সিজেন বৃদ্ধি ও ক্ষতিকর টক্সিন দূর করে',
    ],
    benefitsEn: [
      'Thrives in low light and air-conditioned rooms',
      'Requires watering only 1–2 times a week',
      'Naturally filters indoor air toxins',
    ],
  },
  {
    id: 'combo-beginner-starter-kit',
    slug: 'beginner-gardener-starter-kit',
    badgeBn: 'নতুনদের জন্য সেরা',
    badgeEn: 'Best for Beginners',
    titleBn: 'নতুন বাগানিদের কমপ্লিট স্টার্টার কিট (গাছ + মাটি + সার + টুলস)',
    titleEn: 'Complete Beginner Gardener Starter Kit',
    subtitleBn:
      'যারা নতুন বাগান শুরু করতে চান, তাদের জন্য চারা, রেডি পটিং মিক্স, ভার্মি কম্পোস্ট ও গার্ডেনিং টুলসের পূর্ণাঙ্গ প্যাক।',
    subtitleEn:
      'Everything a new plant parent needs in one box: live plant, ready potting soil, vermicompost, and hand tools.',
    imageUrl:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
    regularPrice: 1250,
    comboPrice: 990,
    isActive: true,
    isFeatured: true,
    stockQuantity: 15,
    soldCount: 98,
    rating: 4.9,
    items: [
      {
        id: 'ci-5',
        nameBn: 'মনস্টেরা ডেলিসিওসা চারা',
        nameEn: 'Monstera Deliciosa Sapling',
        quantityLabelBn: '১টি চারা',
        quantityLabelEn: '1 Sapling',
        imageUrl:
          'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=300&q=80',
        unitPrice: 550,
      },
      {
        id: 'ci-6',
        nameBn: 'রেডি পটিং সয়েল মিক্স',
        nameEn: 'Ready Potting Soil Mix',
        quantityLabelBn: '৫ কেজি প্যাক',
        quantityLabelEn: '5 kg Pack',
        imageUrl:
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80',
        unitPrice: 250,
      },
      {
        id: 'ci-7',
        nameBn: 'খাঁটি ভার্মি কম্পোস্ট জৈব সার',
        nameEn: 'Organic Vermicompost',
        quantityLabelBn: '২ কেজি প্যাক',
        quantityLabelEn: '2 kg Pack',
        imageUrl:
          'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=300&q=80',
        unitPrice: 150,
      },
      {
        id: 'ci-8',
        nameBn: 'গার্ডেনিং হ্যান্ড টুলস সেট (৩ পিস)',
        nameEn: '3-Piece Gardening Tool Set',
        quantityLabelBn: '১ সেট',
        quantityLabelEn: '1 Set',
        imageUrl:
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=300&q=80',
        unitPrice: 300,
      },
    ],
    benefitsBn: [
      'আলাদা করে মাটি বা সার প্রস্তুত করার ঝামেলা নেই',
      'হাসনাহেনার লেখা প্রিন্টেড পরিচর্যা গাইড ফ্রি',
      'বারান্দা বা ছাদবাগান শুরু করার পূর্ণাঙ্গ সমাধান',
    ],
    benefitsEn: [
      'No hassle of mixing soil or fertilizers separately',
      'Includes free printed Bengali care guide by Hasna Hena',
      'All-in-one box to start your balcony garden today',
    ],
  },
  {
    id: 'combo-5in1-veggie-seeds',
    slug: '5-in-1-balcony-vegetable-seed-combo',
    badgeBn: '৯৮% অঙ্কুরোদগম নিশ্চিত',
    badgeEn: '98% Germination Tested',
    titleBn: '৫-ইন-১ বারান্দা ও ছাদবাগান অর্গানিক সবজি বীজ কম্বো',
    titleEn: '5-in-1 Balcony & Rooftop Organic Veggie Seed Pack',
    subtitleBn:
      'বারোমাস টবে বা গ্রো-ব্যাগে চাষ উপযোগী ৫টি উচ্চ ফলনশীল সবজি বীজ ও কোকোপিট সিডলিং স্টার্টার প্যাক।',
    subtitleEn:
      'Five high-yield organic vegetable seed packets with cocopeat starter block for year-round balcony harvesting.',
    imageUrl:
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=900&q=80',
    regularPrice: 650,
    comboPrice: 490,
    isActive: true,
    isFeatured: true,
    stockQuantity: 32,
    soldCount: 215,
    rating: 4.8,
    items: [
      {
        id: 'ci-9',
        nameBn: 'চেরি টমেটো ও ক্যাপসিকাম বীজ',
        nameEn: 'Cherry Tomato & Capsicum Seeds',
        quantityLabelBn: '২ প্যাকেট',
        quantityLabelEn: '2 Packets',
        imageUrl:
          'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80',
        unitPrice: 240,
      },
      {
        id: 'ci-10',
        nameBn: 'ধনিয়া পাতা, লেটুস ও নাগা মরিচ বীজ',
        nameEn: 'Coriander, Lettuce & Chili Seeds',
        quantityLabelBn: '৩ প্যাকেট',
        quantityLabelEn: '3 Packets',
        imageUrl:
          'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=300&q=80',
        unitPrice: 260,
      },
      {
        id: 'ci-11',
        nameBn: 'কোকোপিট সিডলিং ব্লক',
        nameEn: 'Washed Cocopeat Seedling Block',
        quantityLabelBn: '১ কেজি ব্লক',
        quantityLabelEn: '1 kg Block',
        imageUrl:
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80',
        unitPrice: 150,
      },
    ],
    benefitsBn: [
      'ল্যাব-পরীক্ষিত ৯৮% অঙ্কুরোদগম হার',
      'ছোট টবেই ৩০-৪৫ দিনে ফসল তোলা যায়',
      'সম্পূর্ণ বিষমুক্ত পারিবারিক সবজির নিশ্চয়তা',
    ],
    benefitsEn: [
      'Lab-tested 98% germination rate',
      'Harvest fresh veggies in 30–45 days in small pots',
      '100% chemical-free organic family nutrition',
    ],
  },
  {
    id: 'combo-fragrant-blooms',
    slug: 'fragrant-rooftop-bloom-combo',
    badgeBn: 'সুবাসিত ফুলের প্যাক',
    badgeEn: 'Fragrant Bloom Bundle',
    titleBn: 'সুগন্ধি ফুলের ছাদবাগান কম্বো (গোলাপ + বেলি + হাসনাহেনা)',
    titleEn: 'Fragrant Rooftop Flower Trio & Bloom Booster Pack',
    subtitleBn:
      'আপনার বারান্দা ও ছাদবাগান মিষ্টি সুবাসে ভরিয়ে তুলতে ৩টি জনপ্রিয় ফুলের কলম চারা ও ফ্লাওয়ার বুস্টার জৈব সার।',
    subtitleEn:
      'Fill your balcony with evening fragrance—three grafted flowering plants plus organic bloom-booster fertilizer.',
    imageUrl:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
    regularPrice: 1150,
    comboPrice: 890,
    isActive: true,
    isFeatured: true,
    stockQuantity: 14,
    soldCount: 116,
    rating: 5.0,
    items: [
      {
        id: 'ci-12',
        nameBn: 'কাশ্মীরি গোলাপ চারা (কলিযুক্ত)',
        nameEn: 'Kashmiri Rose Plant (With Buds)',
        quantityLabelBn: '১টি কলম চারা',
        quantityLabelEn: '1 Grafted Plant',
        imageUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
        unitPrice: 320,
      },
      {
        id: 'ci-13',
        nameBn: 'সুগন্ধি বেলি ও হাসনাহেনা চারা',
        nameEn: 'Arabian Jasmine & Hasna Hena Pair',
        quantityLabelBn: '২টি ঝোপালো চারা',
        quantityLabelEn: '2 Bushy Plants',
        imageUrl:
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=300&q=80',
        unitPrice: 580,
      },
      {
        id: 'ci-14',
        nameBn: 'বোনমিল ও ফ্লাওয়ার বুস্টার সার',
        nameEn: 'Organic Bone Meal & Bloom Booster',
        quantityLabelBn: '১ কেজি প্যাক',
        quantityLabelEn: '1 kg Pack',
        imageUrl:
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=300&q=80',
        unitPrice: 250,
      },
    ],
    benefitsBn: [
      'প্রতিটি চারায় দ্রুত ফুল আসার উপযোগী ম্যাচুরিটি',
      'সন্ধ্যা ও রাতে পুরো বারান্দা সুবাসিত রাখে',
      'ফুলের আকার ও সংখ্যা বাড়াতে স্পেশাল ফ্লাওয়ার ফুড যুক্ত',
    ],
    benefitsEn: [
      'Mature grafted plants ready to bloom rapidly',
      'Fills your balcony with soothing evening fragrance',
      'Includes organic bloom booster for abundant flowers',
    ],
  },
];

function notifyCombosUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(COMBOS_UPDATED_EVENT));
  }
}

export const comboService = {
  getCombos(): ComboPack[] {
    if (typeof window === 'undefined') return DEFAULT_COMBO_PACKS;
    try {
      const raw = localStorage.getItem(COMBOS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default combos
    }
    return DEFAULT_COMBO_PACKS;
  },

  getActiveCombos(): ComboPack[] {
    return this.getCombos().filter((c) => c.isActive);
  },

  saveCombos(combos: ComboPack[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(COMBOS_STORAGE_KEY, JSON.stringify(combos));
      notifyCombosUpdated();
    } catch (e) {
      console.error('Failed to save combo packs', e);
    }
  },

  addCombo(combo: ComboPack): ComboPack[] {
    const current = this.getCombos();
    const updated = [combo, ...current];
    this.saveCombos(updated);
    return updated;
  },

  updateCombo(id: string, updates: Partial<ComboPack>): ComboPack[] {
    const current = this.getCombos();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveCombos(updated);
    return updated;
  },

  deleteCombo(id: string): ComboPack[] {
    const current = this.getCombos();
    const updated = current.filter((c) => c.id !== id);
    this.saveCombos(updated);
    return updated;
  },

  resetCombosToDefault(): ComboPack[] {
    this.saveCombos(DEFAULT_COMBO_PACKS);
    this.saveSettings(DEFAULT_COMBO_SETTINGS);
    return DEFAULT_COMBO_PACKS;
  },

  getSettings(): ComboSettings {
    if (typeof window === 'undefined') return DEFAULT_COMBO_SETTINGS;
    try {
      const raw = localStorage.getItem(COMBO_SETTINGS_STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_COMBO_SETTINGS, ...JSON.parse(raw) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_COMBO_SETTINGS;
  },

  saveSettings(settings: ComboSettings): ComboSettings {
    if (typeof window === 'undefined') return settings;
    try {
      localStorage.setItem(COMBO_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      notifyCombosUpdated();
    } catch (e) {
      console.error('Failed to save combo settings', e);
    }
    return settings;
  },

  /**
   * Converts a ComboPack into a standard Cart-compatible Product object
   */
  comboToProduct(combo: ComboPack): Product {
    const discountPercent =
      combo.regularPrice > combo.comboPrice
        ? Math.round(((combo.regularPrice - combo.comboPrice) / combo.regularPrice) * 100)
        : 0;
    const itemNamesBn = combo.items.map((i) => i.nameBn).join(' + ');
    const itemNamesEn = combo.items.map((i) => i.nameEn).join(' + ');

    return {
      id: combo.id,
      slug: combo.slug,
      nameBn: `🎁 ${combo.titleBn}`,
      nameEn: `🎁 ${combo.titleEn}`,
      botanicalName: `Combo Pack (${combo.items.length} Items)`,
      category: 'Combo Pack',
      categorySlug: 'combo-packs',
      type: 'plant',
      price: combo.comboPrice,
      originalPrice: combo.regularPrice,
      discountPercent,
      rating: combo.rating || 4.9,
      reviewsCount: 48,
      imageUrl: combo.imageUrl,
      images: [combo.imageUrl, ...combo.items.map((i) => i.imageUrl)],
      isFeatured: combo.isFeatured,
      isBestseller: true,
      inStock: combo.stockQuantity > 0,
      stockQuantity: combo.stockQuantity,
      soldCount: combo.soldCount,
      SKU: `GV-COMBO-${combo.id.slice(-4).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      tagsEn: ['Combo Pack', 'Value Bundle'],
      tagsBn: ['কম্বো প্যাক', 'সাশ্রয়ী বান্ডেল'],
      sunlightEn: 'Included in Guide',
      sunlightBn: 'গাইডে উল্লেখিত',
      waterEn: 'Easy Care',
      waterBn: 'সহজ পরিচর্যা',
      shortDescBn: `প্যাকেজে রয়েছে: ${itemNamesBn}`,
      shortDescEn: `Includes: ${itemNamesEn}`,
      fullDescBn: `${combo.subtitleBn} (${itemNamesBn})`,
      fullDescEn: `${combo.subtitleEn} (${itemNamesEn})`,
    };
  },

  /**
   * Converts a customer's Custom 3-Item Bundle (Plant + Seed + Supply) into a Cart-compatible Product
   */
  customBundleToProduct(
    plant: Product,
    seed: Product,
    supply: Product,
    discountPercent: number
  ): Product {
    const regularTotal = plant.price + seed.price + supply.price;
    const discountedPrice = Math.round(regularTotal * (1 - discountPercent / 100));

    return {
      id: `custom-combo-${plant.id}-${seed.id}-${supply.id}`,
      slug: `custom-combo-${plant.slug}`,
      nameBn: `✨ কাস্টম কম্বো: ${plant.nameBn} + ${seed.nameBn} + ${supply.nameBn}`,
      nameEn: `✨ Custom Combo: ${plant.nameEn} + ${seed.nameEn} + ${supply.nameEn}`,
      botanicalName: `Custom 3-in-1 Bundle (${discountPercent}% Off)`,
      category: 'Custom Combo',
      categorySlug: 'combo-packs',
      type: 'plant',
      price: discountedPrice,
      originalPrice: regularTotal,
      discountPercent,
      rating: 5.0,
      reviewsCount: 30,
      imageUrl: plant.imageUrl,
      images: [plant.imageUrl, seed.imageUrl, supply.imageUrl],
      isFeatured: true,
      inStock: true,
      stockQuantity: 10,
      SKU: 'GV-CUSTOM-BUNDLE',
      createdAt: new Date().toISOString(),
      tagsEn: ['Custom Bundle'],
      tagsBn: ['কাস্টম কম্বো'],
      sunlightEn: plant.sunlightEn,
      sunlightBn: plant.sunlightBn,
      waterEn: plant.waterEn,
      waterBn: plant.waterBn,
      shortDescBn: `১টি গাছ + ১টি বীজ + ১টি বাগান সরঞ্জাম (${discountPercent}% কম্বো ছাড়)`,
      shortDescEn: `1 Plant + 1 Seed + 1 Supply (${discountPercent}% Combo Discount)`,
      fullDescBn: `কাস্টম বান্ডেল: ${plant.nameBn}, ${seed.nameBn} এবং ${supply.nameBn}`,
      fullDescEn: `Custom Bundle: ${plant.nameEn}, ${seed.nameEn}, and ${supply.nameEn}`,
    };
  },
};
