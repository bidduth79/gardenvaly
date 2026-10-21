/**
 * @file couponService.ts
 * @description Dynamic promo code and discount voucher engine for Gardenvaly.
 * Supports percentage and flat discounts, minimum order thresholds, expiry validation,
 * and Admin Panel management with real-time storage synchronization.
 */

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  descriptionBn: string;
  descriptionEn: string;
  isActive: boolean;
  expiryDate?: string;
  usageCount: number;
  createdAt: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  messageBn: string;
  messageEn: string;
}

export const COUPONS_STORAGE_KEY = 'gardenvaly_coupons_v1';
export const COUPONS_UPDATED_EVENT = 'gardenvaly_coupons_updated';

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'cpn-green10',
    code: 'GREEN10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 300,
    descriptionBn: '৫০০৳ বা তার বেশি অর্ডারে ১০% বিশেষ ছাড় (সর্বোচ্চ ৩০০৳)',
    descriptionEn: '10% off on orders above ৳500 (up to ৳300)',
    isActive: true,
    expiryDate: '2027-12-31',
    usageCount: 142,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cpn-garden100',
    code: 'GARDEN100',
    discountType: 'flat',
    discountValue: 100,
    minOrderAmount: 1000,
    descriptionBn: '১,০০০৳ বা তার বেশি গাছ ও বীজের অর্ডারে ১০০৳ ফ্ল্যাট ছাড়',
    descriptionEn: 'Flat ৳100 off on orders of ৳1,000 or more',
    isActive: true,
    expiryDate: '2027-12-31',
    usageCount: 89,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'cpn-monsoon15',
    code: 'MONSOON15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1200,
    maxDiscountAmount: 500,
    descriptionBn: 'মৌসুমি ছাদবাগান উৎসবে ১,২০০৳+ অর্ডারে ১৫% মেগা ছাড়',
    descriptionEn: '15% seasonal terrace festival discount on ৳1,200+ orders',
    isActive: true,
    expiryDate: '2027-10-30',
    usageCount: 64,
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'cpn-hasna50',
    code: 'HASNA50',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 400,
    descriptionBn: 'নতুন বাগানীদের জন্য ৪০০৳+ অর্ডারে ৫০৳ উপহার ছাড়',
    descriptionEn: '৳50 welcome voucher on orders above ৳400',
    isActive: true,
    expiryDate: '2027-12-31',
    usageCount: 215,
    createdAt: '2026-01-01T10:00:00Z',
  },
];

class CouponService {
  public getCoupons(): Coupon[] {
    if (typeof window === 'undefined') return DEFAULT_COUPONS;
    try {
      const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(DEFAULT_COUPONS));
        return DEFAULT_COUPONS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  }

  public getActiveCoupons(): Coupon[] {
    return this.getCoupons().filter((c) => c.isActive);
  }

  private saveCoupons(coupons: Coupon[]): void {
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
      window.dispatchEvent(new CustomEvent(COUPONS_UPDATED_EVENT));
    } catch {
      // ignore storage errors
    }
  }

  public validateCoupon(code: string, subtotal: number): CouponValidationResult {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return {
        valid: false,
        discountAmount: 0,
        messageBn: 'অনুগ্রহ করে একটি কুপন কোড লিখুন',
        messageEn: 'Please enter a coupon code',
      };
    }

    const coupon = this.getCoupons().find((c) => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      return {
        valid: false,
        discountAmount: 0,
        messageBn: `"${cleanCode}" নামের কোনো বৈধ কুপন পাওয়া যায়নি`,
        messageEn: `Invalid coupon code "${cleanCode}"`,
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        discountAmount: 0,
        messageBn: 'এই কুপন কোডটি বর্তমানে বন্ধ রয়েছে',
        messageEn: 'This coupon code is currently inactive',
      };
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
      return {
        valid: false,
        discountAmount: 0,
        messageBn: 'এই কুপন কোডটির মেয়াদ শেষ হয়ে গেছে',
        messageEn: 'This coupon code has expired',
      };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        messageBn: `এই কুপনটি ব্যবহার করতে কমপক্ষে ৳${coupon.minOrderAmount} টাকার অর্ডার প্রয়োজন`,
        messageEn: `Minimum order of ৳${coupon.minOrderAmount} required for this coupon`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, subtotal);

    return {
      valid: true,
      coupon,
      discountAmount,
      messageBn: `অভিনন্দন! "${coupon.code}" কুপনে ৳${discountAmount} ছাড় যুক্ত হয়েছে`,
      messageEn: `Coupon "${coupon.code}" applied! You saved ৳${discountAmount}`,
    };
  }

  public addCoupon(data: Omit<Coupon, 'id' | 'usageCount' | 'createdAt'>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      ...data,
      code: data.code.trim().toUpperCase(),
      id: `cpn-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.saveCoupons([newCoupon, ...coupons]);
    return newCoupon;
  }

  public toggleCouponStatus(id: string): Coupon[] {
    const updated = this.getCoupons().map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    this.saveCoupons(updated);
    return updated;
  }

  public deleteCoupon(id: string): Coupon[] {
    const updated = this.getCoupons().filter((c) => c.id !== id);
    this.saveCoupons(updated);
    return updated;
  }
}

export const couponService = new CouponService();
