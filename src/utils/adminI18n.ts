/**
 * @file adminI18n.ts
 * @description Centralized Localization (i18n) & Number/Date/Terminology formatter for the
 * GardenValy Admin Panel. Ensures 100% pure Bengali in 'bn' mode and 100% pure English in 'en' mode
 * without mixed "Banglish" parenthetical strings.
 */

export type AdminLang = 'bn' | 'en';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts English digits to Bengali digits when language === 'bn'
 */
export function toBnDigits(val: string | number): string {
  return String(val).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Formats a number according to the active language ('bn' -> ১২,৪৫০ | 'en' -> 12,450)
 */
export function formatAdminNumber(value: number | undefined | null, lang: AdminLang): string {
  const safeVal = Number(value ?? 0);
  const formatted = safeVal.toLocaleString('en-IN');
  return lang === 'bn' ? toBnDigits(formatted) : formatted;
}

/**
 * Formats currency in BDT ('bn' -> ৳১২,৪৫০ | 'en' -> ৳12,450)
 */
export function formatAdminCurrency(value: number | undefined | null, lang: AdminLang): string {
  return `৳${formatAdminNumber(value, lang)}`;
}

/**
 * Formats dates cleanly in pure Bengali or pure English
 */
export function formatAdminDate(dateStr: string | Date, lang: AdminLang): string {
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    if (lang === 'bn') {
      return d.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Translates product type ('plant' | 'seed' | etc.) without mixing languages
 */
export function translateProductType(type: string | undefined, lang: AdminLang): string {
  const key = (type || '').toLowerCase();
  if (lang === 'bn') {
    if (key === 'plant') return 'গাছের চারা';
    if (key === 'seed') return 'বীজ';
    return 'পণ্য';
  }
  if (key === 'plant') return 'Plant';
  if (key === 'seed') return 'Seed';
  return type || 'Product';
}

/**
 * Translates product unit ('pots' vs 'packs') cleanly
 */
export function translateStockUnit(type: string | undefined, lang: AdminLang): string {
  const key = (type || '').toLowerCase();
  if (lang === 'bn') {
    return key === 'seed' ? 'প্যাকেট' : 'টি চারা';
  }
  return key === 'seed' ? 'packs' : 'pots';
}

/**
 * Translates category names/slugs into pure Bengali or pure English
 */
export function translateCategoryName(category: string | undefined, lang: AdminLang): string {
  if (!category) return lang === 'bn' ? 'সাধারণ' : 'General';
  const key = category.toLowerCase().trim();

  const mapBn: Record<string, string> = {
    indoor: 'ইনডোর গাছ',
    'indoor plants': 'ইনডোর গাছ',
    'indoor-plants': 'ইনডোর গাছ',
    outdoor: 'আউটডোর গাছ',
    'outdoor plants': 'আউটডোর গাছ',
    'outdoor-plants': 'আউটডোর গাছ',
    fruit: 'ফলের গাছ',
    'fruit plants': 'ফলের গাছ',
    'fruit-plants': 'ফলের গাছ',
    flower: 'ফুলের গাছ',
    'flowering plants': 'ফুলের গাছ',
    'flower-plants': 'ফুলের গাছ',
    medicinal: 'ভেষজ গাছ',
    'medicinal plants': 'ভেষজ গাছ',
    'medicinal-plants': 'ভেষজ গাছ',
    succulent: 'সাকুলেন্ট ও ক্যাকটাস',
    'succulents & cacti': 'সাকুলেন্ট ও ক্যাকটাস',
    'vegetable seeds': 'সবজি বীজ',
    'vegetable-seeds': 'সবজি বীজ',
    'flower seeds': 'ফুলের বীজ',
    'flower-seeds': 'ফুলের বীজ',
    'herb seeds': 'ভেষজ ও মসলা বীজ',
    'farming seeds': 'কৃষি বীজ',
    seeds: 'উন্নত বীজ',
    plants: 'গাছের চারা',
  };

  if (lang === 'bn') {
    return mapBn[key] || category;
  }
  return category;
}

/**
 * Translates payment method cleanly
 */
export function translatePaymentMethod(method: string | undefined, lang: AdminLang): string {
  if (lang === 'bn') {
    if (method === 'online-bkash' || method === 'bkash') return 'বিকাশ';
    if (method === 'nagad') return 'নগদ';
    return 'ক্যাশ অন ডেলিভারি';
  }
  if (method === 'online-bkash' || method === 'bkash') return 'bKash';
  if (method === 'nagad') return 'Nagad';
  return 'Cash on Delivery';
}

/**
 * Translates district/city names for order tables
 */
export function translateDistrict(district: string | undefined, lang: AdminLang): string {
  if (!district) return lang === 'bn' ? 'ঢাকা' : 'Dhaka';
  const key = district.toLowerCase().trim();
  const bnDistricts: Record<string, string> = {
    dhaka: 'ঢাকা',
    chattogram: 'চট্টগ্রাম',
    chittagong: 'চট্টগ্রাম',
    sylhet: 'সিলেট',
    rajshahi: 'রাজশাহী',
    khulna: 'খুলনা',
    barishal: 'বরিশাল',
    rangpur: 'রংপুর',
    mymensingh: 'ময়মনসিংহ',
    gazipur: 'গাজীপুর',
    narayanganj: 'নারায়ণগঞ্জ',
    cumilla: 'কুমিল্লা',
  };
  if (lang === 'bn') {
    return bnDistricts[key] || district;
  }
  return district;
}

const BN_WORDS_0_99: string[] = [
  'শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়',
  'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ',
  'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ',
  'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ',
  'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ',
  'পঞ্চাশ', 'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট',
  'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর',
  'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি',
  'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই',
  'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই',
];

/**
 * Converts a BDT integer amount into official Bengali words (e.g., "এক হাজার দুইশত পঞ্চাশ টাকা মাত্র")
 */
export function numberToBanglaWords(amount: number | undefined | null): string {
  const n = Math.round(Math.max(0, Number(amount ?? 0)));
  if (n === 0) return 'শূন্য টাকা মাত্র';

  const parts: string[] = [];
  let rem = n;

  const crore = Math.floor(rem / 10000000);
  if (crore > 0) {
    parts.push(`${BN_WORDS_0_99[crore] || toBnDigits(crore)} কোটি`);
    rem %= 10000000;
  }

  const lakh = Math.floor(rem / 100000);
  if (lakh > 0) {
    parts.push(`${BN_WORDS_0_99[lakh]} লক্ষ`);
    rem %= 100000;
  }

  const thousand = Math.floor(rem / 1000);
  if (thousand > 0) {
    parts.push(`${BN_WORDS_0_99[thousand]} হাজার`);
    rem %= 1000;
  }

  const hundred = Math.floor(rem / 100);
  if (hundred > 0) {
    parts.push(`${BN_WORDS_0_99[hundred]}শত`);
    rem %= 100;
  }

  if (rem > 0) {
    parts.push(BN_WORDS_0_99[rem]);
  }

  return `${parts.join(' ')} টাকা মাত্র`;
}

