/**
 * @file useShopPageSeo.ts
 * @description Encapsulated SEO metadata hook for the Shop catalogue page.
 */

import { Category, ProductCategoryType } from '../types/product';
import { usePageSeo } from './usePageSeo';

interface ShopSeoParams {
  activeCategory: Category | null;
  type?: ProductCategoryType;
  pageTitle: string;
  language: 'bn' | 'en';
}

export function useShopPageSeo({ activeCategory, type, pageTitle, language }: ShopSeoParams): void {
  const seoTitle = activeCategory
    ? language === 'bn'
      ? `${activeCategory.nameBn} — সংগ্রহ | Gardenvaly (by Hasna Hena)`
      : `${activeCategory.nameEn} Collection | Gardenvaly by Hasna Hena`
    : type === 'plant'
    ? language === 'bn'
      ? `তাজা গাছের সংগ্রহশালা | Gardenvaly — by Hasna Hena`
      : `Live Plants Nursery Collection | Gardenvaly by Hasna Hena`
    : type === 'seed'
    ? language === 'bn'
      ? `উন্নত জাতের শাকসবজি ও ফুলের বীজ | Gardenvaly — by Hasna Hena`
      : `High-Yield Vegetable & Flower Seeds | Gardenvaly by Hasna Hena`
    : type === 'tool'
    ? language === 'bn'
      ? `প্রয়োজনীয় বাগান সামগ্রী ও গার্ডেনিং টুলস | Gardenvaly — by Hasna Hena`
      : `Essential Gardening Supplies & Tools | Gardenvaly by Hasna Hena`
    : language === 'bn'
    ? `গাছ ও অর্গানিক বীজের অনলাইন সংগ্রহ | Gardenvaly — by Hasna Hena`
    : `Shop Live Plants & Organic Seeds | Gardenvaly by Hasna Hena`;

  const seoDescription = activeCategory
    ? language === 'bn'
      ? activeCategory.descriptionBn
      : activeCategory.descriptionEn
    : type === 'plant'
    ? language === 'bn'
      ? 'এয়ার-পিউরিফায়িং ইনডোর গাছ, বারান্দার চারা ও ছাদবাগানের সতেজ গাছপালা সংগ্রহ করুন খাঁটি নার্সারি গার্ডেনভ্যালিতে।'
      : 'Explore healthy, well-rooted air-purifying indoor plants and vibrant patio greenery.'
    : type === 'seed'
    ? language === 'bn'
      ? 'উচ্চ অঙ্কুরোদগম ক্ষমতাসম্পন্ন দেশি-বিদেশি শাকসবজি ও বাহারি ফুলের খাঁটি অর্গানিক বীজ সংগ্রহ করুন।'
      : 'Authentic high-germination heirloom and hybrid vegetable, herb, and flower seeds.'
    : type === 'tool'
    ? language === 'bn'
      ? 'ছাদবাগান ও গাছের পরম যত্নে প্রিমিয়াম কাঁচি, স্প্রেয়ার, খাঁটি কেঁচো সার, কোকোপিট ও টব সংগ্রহ করুন।'
      : 'Discover heavy-duty pruning shears, 2L pressure sprayers, organic vermicompost, and planter pots.'
    : language === 'bn'
    ? 'গার্ডেনভ্যালির সম্পূর্ণ ক্যাটালগ — ইনডোর গাছ, বারান্দার চারা ও খাঁটি বীজ অর্ডার করুন ক্যাশ অন ডেলিভারিতে।'
    : "Browse Gardenvaly's curated catalog of premium nursery plants, botanical foliage, and certified organic seeds.";

  const canonicalPath = activeCategory
    ? `/category/${activeCategory.slug}`
    : type === 'plant'
    ? '/plants'
    : type === 'seed'
    ? '/seeds'
    : type === 'tool'
    ? '/supplies'
    : '/shop';

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    canonicalPath,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: activeCategory?.imageUrl || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&h=630&q=85',
    lang: language,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: language === 'bn' ? 'হোম' : 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: language === 'bn' ? 'শপ' : 'Shop', item: '/shop' },
          ...(activeCategory
            ? [{ '@type': 'ListItem', position: 3, name: pageTitle, item: `/category/${activeCategory.slug}` }]
            : []),
        ],
      },
    ],
  });
}
