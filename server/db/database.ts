/**
 * @file database.ts
 * @description Centralized data access layer for Gardenvaly Backend.
 * Supports persistent local storage with PostgreSQL schema alignment and automatic seeding.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { ENV} from '../config/env.ts';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'store_manager' | 'inventory_staff';
  isActive: boolean;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBCategory {
  id: string;
  slug: string;
  type: 'plant' | 'seed' | 'tool' | 'care';
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  imageUrl: string;
  isActive: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBProduct {
  id: string;
  slug: string;
  SKU: string;
  type: 'plant' | 'seed' | 'tool' | 'care';
  category: string;
  categorySlug: string;
  nameEn: string;
  nameBn: string;
  botanicalName?: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  isBestseller?: boolean;
  isPublished: boolean;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  images: string[];
  indoorOutdoor?: 'indoor' | 'outdoor' | 'both';
  packetSizeEn?: string;
  packetSizeBn?: string;
  plantHeightEn?: string;
  plantHeightBn?: string;
  plantAgeEn?: string;
  plantAgeBn?: string;
  sunlightEn: string;
  sunlightBn: string;
  waterEn: string;
  waterBn: string;
  soilTypeEn?: string;
  soilTypeBn?: string;
  plantingSeasonEn?: string;
  plantingSeasonBn?: string;
  tagsEn: string[];
  tagsBn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DBCustomer {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  passwordHash?: string;
  division: string;
  district: string;
  upazila?: string;
  addressDetail: string;
  wishlist?: string[];
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBOrderItem {
  productId: string;
  productName: string;
  slug?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
}

export interface DBOrderAuditTrail {
  action: string;
  performedBy: string;
  timestamp: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
}

export interface DBOrder {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    mobileNumber: string;
    email?: string;
    division: string;
    district: string;
    upazila?: string;
    addressDetail: string;
    deliveryInstructions?: string;
  };
  items: DBOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount?: number;
  totalAmount: number;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'partially_refunded' | 'refunded' | 'failed';
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'packed'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'return_requested'
    | 'returned'
    | 'refunded';
  statusHistory?: {
    status: string;
    changedAt: string;
    note?: string;
    changedBy?: string;
  }[];
  adminNotes?: string;

  // Courier & Delivery details
  deliveryProvider?: string;
  trackingNumber?: string;
  dispatchDate?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  deliveryNotes?: string;

  // Cash on Delivery Reconciliation
  codExpectedAmount?: number;
  codCollectedAmount?: number;
  codCollectedAt?: string;
  codCollectedByStaff?: string;
  codOutstandingBalance?: number;
  codStatus?: 'awaiting_collection' | 'collected' | 'partially_collected' | 'discrepancy';

  // Returns & Refunds
  returnReason?: string;
  returnRequestedAt?: string;
  returnReviewedAt?: string;
  returnStatus?: 'pending_review' | 'approved' | 'rejected';
  returnedQuantities?: Record<string, number>;
  refundAmount?: number;
  refundReason?: string;
  refundRecordedAt?: string;
  refundRecordedBy?: string;

  // Stock Protection (Prevents restoring inventory twice upon cancellation)
  isStockRestored?: boolean;

  // Immutable Audit Trail
  auditTrail?: DBOrderAuditTrail[];

  createdAt: string;
  updatedAt: string;
}

export interface DBInventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  quantityChanged: number;
  newQuantity: number;
  reason: string;
  adminUserName: string;
  createdAt: string;
}

export interface DBStoreSettings {
  storeNameEn: string;
  storeNameBn: string;
  signatureEn: string;
  signatureBn: string;
  taglineEn: string;
  taglineBn: string;
  contactPhone: string;
  contactEmail: string;
  officialWhatsapp: string;
  locationEn?: string;
  locationBn?: string;
  bkashNumber?: string;
  bkashType?: 'Personal' | 'Merchant';
  nagadNumber?: string;
  nagadType?: 'Personal' | 'Merchant';
  paymentInstructionsBn?: string;
  paymentInstructionsEn?: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  enablePickup: boolean;
  orderNotificationEmail: string;
  maintenanceMode: boolean;
  demoModeNotice: boolean;
}

interface DBStorageSchema {
  users: DBUser[];
  categories: DBCategory[];
  products: DBProduct[];
  customers: DBCustomer[];
  orders: DBOrder[];
  inventoryAdjustments: DBInventoryAdjustment[];
  settings: DBStoreSettings;
}

// File persistence path
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class DatabaseService {
  private data!: DBStorageSchema;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {
        // ignore
      }
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        return;
      } catch (err) {
        console.warn('[DB] Failed to read existing store.json, re-seeding default data', err);
      }
    }

    // Default Seed Data
    this.seedDefaultData();
    this.persist();
  }

  private seedDefaultData() {
    const salt = bcrypt.genSaltSync(10);
    const demoAdminHash = bcrypt.hashSync('gardenvaly123', salt);

    const defaultUsers: DBUser[] = [
      {
        id: 'usr-1',
        name: 'Hasna Hena',
        email: 'admin@gardenvaly.com',
        passwordHash: demoAdminHash,
        role: 'superadmin',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr-2',
        name: 'Karim Uddin',
        email: 'manager@gardenvaly.com',
        passwordHash: demoAdminHash,
        role: 'store_manager',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const defaultCategories: DBCategory[] = [
      {
        id: 'cat-plants-indoor',
        slug: 'indoor-plants',
        type: 'plant',
        nameEn: 'Indoor Plants',
        nameBn: 'ইনডোর গাছ',
        descriptionEn: 'Low-maintenance, air-purifying foliage suited for apartments and offices.',
        descriptionBn: 'ঘরের বাতাস বিশুদ্ধকারী ও অল্প যত্নে বেঁচে থাকা নান্দনিক ইনডোর গাছপালা।',
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        itemCount: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-plants-outdoor',
        slug: 'outdoor-plants',
        type: 'plant',
        nameEn: 'Outdoor Plants',
        nameBn: 'আউটডোর ও ছাদবাগান গাছ',
        descriptionEn: 'Hardy perennial plants and flowering shrubs for Bangladeshi climate.',
        descriptionBn: 'বাংলাদেশের আবহাওয়ায় মানানসই রৌদ্রপ্রিয় ও ছাদবাগানের আকর্ষণীয় গাছপালা।',
        imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        itemCount: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-seeds-veg',
        slug: 'vegetable-seeds',
        type: 'seed',
        nameEn: 'Vegetable Seeds',
        nameBn: 'সবজি বীজ',
        descriptionEn: 'High-germination rate organic vegetable seeds for rooftop and backyard pots.',
        descriptionBn: 'উচ্চ অঙ্কুরোদগম ক্ষমতাসম্পন্ন বিষমুক্ত দেশি ও হাইব্রিড সবজি বীজ।',
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        itemCount: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-seeds-flower',
        slug: 'flower-seeds',
        type: 'seed',
        nameEn: 'Flower Seeds',
        nameBn: 'ফুলের বীজ',
        descriptionEn: 'Fragrant and colorful seasonal flower seeds for balconies and verandahs.',
        descriptionBn: 'বারান্দা ও বাগানে ফুটন্ত বাহারি রঙ ও সুবাসিত ঋতুভিত্তিক ফুলের বীজ।',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        itemCount: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const defaultProducts: DBProduct[] = [
      {
        id: 'plant-1',
        slug: 'monstera-deliciosa',
        nameEn: 'Monstera Deliciosa',
        nameBn: 'মনস্টেরা ডেলিসিওসা',
        botanicalName: 'Monstera deliciosa Liebm.',
        category: 'Indoor Plants',
        categorySlug: 'indoor-plants',
        type: 'plant',
        price: 850,
        originalPrice: 1050,
        discountPercent: 19,
        rating: 4.9,
        reviewsCount: 38,
        imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80'],
        isFeatured: true,
        isBestseller: true,
        inStock: true,
        stockQuantity: 24,
        SKU: 'GV-PL-001',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: new Date().toISOString(),
        isPublished: true,
        indoorOutdoor: 'indoor',
        plantHeightEn: '14 - 18 inches',
        plantHeightBn: '১৪ - ১৮ ইঞ্চি',
        plantAgeEn: '8 months well-rooted',
        plantAgeBn: '৮ মাস বয়সী সুস্থ চারা',
        sunlightEn: 'Bright indirect sunlight',
        sunlightBn: 'উজ্জ্বল কিন্তু পরোক্ষ আলো',
        waterEn: 'Water when top 2 inches dry',
        waterBn: 'উপরের ২ ইঞ্চি মাটি শুকিয়ে গেলে জল দিন',
        soilTypeEn: 'Aerated organic potting mix',
        soilTypeBn: 'সারযুক্ত ঝুরঝুরে মাটি ও কোকোপিট',
        tagsEn: ['indoor', 'air-purifier', 'swiss-cheese', 'statement'],
        tagsBn: ['ইনডোর', 'বাতাস-বিশুদ্ধকারী', 'আভিজাত্য', 'ছায়া প্রিয়'],
        descriptionEn: 'The iconic Swiss Cheese Plant with striking fenestrated foliage.',
        descriptionBn: 'নান্দনিক খাঁজকাটা পাতার জনপ্রিয় ইনডোর গাছ মনস্টেরা ডেলিসিওসা।',
      },
      {
        id: 'plant-2',
        slug: 'snake-plant-laurentii',
        nameEn: 'Snake Plant Laurentii',
        nameBn: 'স্নেক প্ল্যান্ট লরেন্তি',
        botanicalName: 'Dracaena trifasciata',
        category: 'Indoor Plants',
        categorySlug: 'indoor-plants',
        type: 'plant',
        price: 450,
        originalPrice: 550,
        discountPercent: 18,
        rating: 4.8,
        reviewsCount: 42,
        imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&auto=format&fit=crop&q=80'],
        isFeatured: true,
        isBestseller: true,
        inStock: true,
        stockQuantity: 40,
        SKU: 'GV-PL-002',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: new Date().toISOString(),
        isPublished: true,
        indoorOutdoor: 'indoor',
        plantHeightEn: '10 - 14 inches',
        plantHeightBn: '১০ - ১৪ ইঞ্চি',
        plantAgeEn: '6 months hardy rhizome',
        plantAgeBn: '৬ মাস বয়সী শক্ত মূল',
        sunlightEn: 'Low to bright indirect light',
        sunlightBn: 'অল্প আলো থেকে মাঝারি আলো',
        waterEn: 'Every 10-14 days',
        waterBn: '১০-১৪ দিনে একবার',
        soilTypeEn: 'Well-draining cactus/succulent mix',
        soilTypeBn: 'পানি নিষ্কাশনযোগ্য দোআঁশ মাটি',
        tagsEn: ['hardy', 'air-purifier', 'low-light', 'bedroom'],
        tagsBn: ['সহজ যত্ন', 'বাতাস-শোধনকারী', 'শোবার ঘর'],
        descriptionEn: 'Top-rated air purifier with striking yellow borders on sword-like leaves.',
        descriptionBn: 'নাসা স্বীকৃত শীর্ষ বায়ু বিশুদ্ধকারী ও প্রায় অবিনাশী ঘরের গাছ।',
      },
      {
        id: 'seed-1',
        slug: 'heirloom-tomato-seeds',
        nameEn: 'Heirloom Tomato Seeds',
        nameBn: 'টমেটো বীজ (উন্নত জাত)',
        botanicalName: 'Solanum lycopersicum',
        category: 'Vegetable Seeds',
        categorySlug: 'vegetable-seeds',
        type: 'seed',
        price: 120,
        originalPrice: 150,
        discountPercent: 20,
        rating: 4.9,
        reviewsCount: 54,
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80'],
        isFeatured: true,
        isBestseller: true,
        inStock: true,
        stockQuantity: 150,
        SKU: 'GV-SD-001',
        createdAt: '2025-01-05T10:00:00Z',
        updatedAt: new Date().toISOString(),
        isPublished: true,
        packetSizeEn: '50+ High Germination Seeds',
        packetSizeBn: '৫০+ উচ্চ অঙ্কুরোদগমের বীজ',
        plantingSeasonEn: 'Autumn to Early Winter (September - December)',
        plantingSeasonBn: 'শরৎ থেকে হেমন্ত/শীতকাল (আশ্বিন - পৌষ)',
        sunlightEn: 'Full Sun (6+ hours)',
        sunlightBn: 'পূর্ণ রোদ (কমপক্ষে ৬ ঘণ্টা)',
        waterEn: 'Regular moderate moisture',
        waterBn: 'নিয়মিত পরিমিত আর্দ্রতা',
        tagsEn: ['vegetable', 'heirloom', 'organic', 'rooftop'],
        tagsBn: ['সবজি', 'উন্নত বীজ', 'ছাদবাগান', 'ফলন'],
        descriptionEn: 'Sweet, juicy organic heirloom tomato seeds with 88%+ tested germination rate.',
        descriptionBn: 'মিষ্টি ও রসালো অর্গানিক টমেটো বীজ, ছাদবাগানের টবের জন্য চমৎকার উপযোগী।',
      },
      {
        id: 'seed-2',
        slug: 'hot-chili-seeds',
        nameEn: 'Bangladeshi Hot Chili Seeds',
        nameBn: 'ঝাল মরিচ বীজ (দেশি বোম্বাই)',
        botanicalName: 'Capsicum frutescens',
        category: 'Vegetable Seeds',
        categorySlug: 'vegetable-seeds',
        type: 'seed',
        price: 90,
        originalPrice: 110,
        discountPercent: 18,
        rating: 4.7,
        reviewsCount: 31,
        imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80'],
        isFeatured: true,
        isBestseller: false,
        inStock: true,
        stockQuantity: 95,
        SKU: 'GV-SD-002',
        createdAt: '2025-01-08T10:00:00Z',
        updatedAt: new Date().toISOString(),
        isPublished: true,
        packetSizeEn: '60+ Vigorous Seeds',
        packetSizeBn: '৬০+ রোগ প্রতিরোধী বীজ',
        plantingSeasonEn: 'Year-round planting',
        plantingSeasonBn: 'সারা বছর রোপণ উপযোগী',
        sunlightEn: 'Full Direct Sun',
        sunlightBn: 'সরাসরি রোদ',
        waterEn: 'Moderate drainage',
        waterBn: 'মাটি শুকিয়ে আসলে জল দিন',
        tagsEn: ['chili', 'spicy', 'organic', 'pots'],
        tagsBn: ['মরিচ', 'ঝাল', 'টব উপযোগী'],
        descriptionEn: 'Vigorous high-yield local chili seeds with intense aroma and sharp heat.',
        descriptionBn: 'সুগন্ধযুক্ত তীব্র ঝাল দেশি মরিচের চারা তৈরির বিশ্বস্ত সতেজ বীজ।',
      },
    ];

    const defaultCustomers: DBCustomer[] = [
      {
        id: 'cust-101',
        fullName: 'Tahmina Akter',
        mobileNumber: '01712345678',
        email: 'tahmina.gardener@gmail.com',
        division: 'Dhaka',
        district: 'Dhaka',
        upazila: 'Dhanmondi',
        addressDetail: 'House 42, Road 9/A, Dhanmondi R/A, Rooftop Garden',
        totalOrders: 3,
        totalSpent: 4250,
        firstOrderDate: '2025-11-12T14:20:00Z',
        lastOrderDate: new Date().toISOString(),
        createdAt: '2025-11-12T14:20:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cust-102',
        fullName: 'Dr. Rafiqul Islam',
        mobileNumber: '01898765432',
        email: 'rafiqul.trees@gmail.com',
        division: 'Chittagong',
        district: 'Chittagong',
        upazila: 'Khulshi',
        addressDetail: 'Flat 6A, Green Tower, South Khulshi Residential',
        totalOrders: 2,
        totalSpent: 2180,
        firstOrderDate: '2025-12-01T10:00:00Z',
        lastOrderDate: '2026-02-14T11:30:00Z',
        createdAt: '2025-12-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];

    const defaultOrders: DBOrder[] = [
      {
        id: 'ord-1001',
        orderNumber: 'GV-2026-0841',
        customer: {
          fullName: 'Tahmina Akter',
          mobileNumber: '01712345678',
          email: 'tahmina.gardener@gmail.com',
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Dhanmondi',
          addressDetail: 'House 42, Road 9/A, Dhanmondi R/A, Rooftop Garden',
          deliveryInstructions: 'Please deliver before 4 PM. Ring bell 4B.',
        },
        items: [
          {
            productId: 'plant-1',
            productName: 'Monstera Deliciosa',
            slug: 'monstera-deliciosa',
            imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
            quantity: 1,
            unitPrice: 850,
            lineSubtotal: 850,
          },
          {
            productId: 'seed-1',
            productName: 'Heirloom Tomato Seeds',
            slug: 'heirloom-tomato-seeds',
            imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80',
            quantity: 2,
            unitPrice: 120,
            lineSubtotal: 240,
          },
        ],
        subtotal: 1090,
        deliveryCharge: 60,
        totalAmount: 1150,
        deliveryMethod: 'home-delivery',
        paymentMethod: 'cash-on-delivery',
        paymentStatus: 'unpaid',
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            changedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            note: 'Order placed via website checkout',
          },
        ],
        adminNotes: 'Customer requested sturdy packaging for rooftop transit.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const defaultAdjustments: DBInventoryAdjustment[] = [
      {
        id: 'inv-adj-1',
        productId: 'plant-1',
        productName: 'Monstera Deliciosa',
        quantityChanged: 10,
        newQuantity: 24,
        reason: 'Restock from nursery nursery batch #4',
        adminUserName: 'Hasna Hena',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    const defaultSettings: DBStoreSettings = {
      storeNameEn: 'Gardenvaly',
      storeNameBn: 'গার্ডেনভ্যালি',
      signatureEn: 'by Hasna Hena',
      signatureBn: 'হাসনা হেনা কর্তৃক পরিচালিত',
      taglineEn: 'Grow Green, Live Beautiful',
      taglineBn: 'সবুজে সাজুক জীবন',
      contactPhone: '+880 1712-345678',
      contactEmail: 'contact@gardenvaly.com',
      officialWhatsapp: '+880 1712-345678',
      locationEn: 'Dhaka, Bangladesh',
      locationBn: 'ঢাকা, বাংলাদেশ',
      bkashNumber: '01712-345678',
      bkashType: 'Personal',
      nagadNumber: '01712-345678',
      nagadType: 'Personal',
      paymentInstructionsBn: 'বিকাশ বা নগদ অ্যাপ থেকে ওপরের নম্বরে Send Money করুন এবং TrxID নিচে লিখুন।',
      paymentInstructionsEn: 'Send Money to the above number using bKash/Nagad and enter the TrxID below.',
      standardDeliveryFee: 60,
      freeDeliveryThreshold: 2000,
      enablePickup: true,
      orderNotificationEmail: 'admin@gardenvaly.com',
      maintenanceMode: false,
      demoModeNotice: true,
    };

    this.data = {
      users: defaultUsers,
      categories: defaultCategories,
      products: defaultProducts,
      customers: defaultCustomers,
      orders: defaultOrders,
      inventoryAdjustments: defaultAdjustments,
      settings: defaultSettings,
    };
  }

  private persist() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error persisting store.json:', err);
    }
  }

  // USERS
  public findUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): DBUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUsers(): DBUser[] {
    return this.data.users;
  }

  public updateUserLastLogin(id: string): void {
    const user = this.data.users.find((u) => u.id === id);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.persist();
    }
  }

  // PRODUCTS
  public getProducts(filters?: {
    category?: string;
    type?: string;
    search?: string;
    inStockOnly?: boolean;
    publishedOnly?: boolean;
  }): DBProduct[] {
    let prods = [...this.data.products];
    if (filters?.publishedOnly) {
      prods = prods.filter((p) => p.isPublished !== false);
    }
    if (filters?.category) {
      prods = prods.filter((p) => p.categorySlug === filters.category);
    }
    if (filters?.type) {
      prods = prods.filter((p) => p.type === filters.type);
    }
    if (filters?.inStockOnly) {
      prods = prods.filter((p) => p.inStock && p.stockQuantity > 0);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameBn.toLowerCase().includes(q) ||
          p.SKU.toLowerCase().includes(q)
      );
    }
    return prods;
  }

  public getProductById(id: string): DBProduct | undefined {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }

  public findProductBySlug(slug: string): DBProduct | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  public createProduct(product: Omit<DBProduct, 'id' | 'createdAt' | 'updatedAt'>): DBProduct {
    const id = `prod-${Date.now()}`;
    const newProd: DBProduct = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProd);
    this.persist();
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<DBProduct>): DBProduct | null {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.persist();
    return true;
  }

  // CATEGORIES
  public getCategories(): DBCategory[] {
    return [...this.data.categories];
  }

  public createCategory(cat: Omit<DBCategory, 'id' | 'createdAt' | 'updatedAt'>): DBCategory {
    const newCat: DBCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.categories.push(newCat);
    this.persist();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<DBCategory>): DBCategory | null {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = {
      ...this.data.categories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.categories[index];
  }

  public deleteCategory(id: string): boolean {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.persist();
    return true;
  }

  // ORDERS
  public getOrders(filters?: {
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    deliveryArea?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'highest_total' | 'lowest_total';
    page?: number;
    limit?: number;
  }): { orders: DBOrder[]; total: number; page: number; limit: number } {
    let orders = [...this.data.orders];

    if (filters?.status && filters.status !== 'all') {
      orders = orders.filter((o) => o.status === filters.status);
    }

    if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus === filters.paymentStatus);
    }

    if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
      orders = orders.filter((o) => o.paymentMethod === filters.paymentMethod);
    }

    if (filters?.deliveryArea && filters.deliveryArea !== 'all') {
      if (filters.deliveryArea === 'dhaka') {
        orders = orders.filter(
          (o) =>
            o.customer.division?.toLowerCase().includes('dhaka') ||
            o.customer.district?.toLowerCase().includes('dhaka')
        );
      } else if (filters.deliveryArea === 'outside_dhaka') {
        orders = orders.filter(
          (o) =>
            !o.customer.division?.toLowerCase().includes('dhaka') &&
            !o.customer.district?.toLowerCase().includes('dhaka')
        );
      }
    }

    if (filters?.startDate) {
      const start = new Date(filters.startDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() >= start);
    }

    if (filters?.endDate) {
      const end = new Date(filters.endDate).getTime() + 86400000; // include end of day
      orders = orders.filter((o) => new Date(o.createdAt).getTime() <= end);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.mobileNumber.includes(q)
      );
    }

    // Sorting
    switch (filters?.sortBy) {
      case 'oldest':
        orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest_total':
        orders.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'lowest_total':
        orders.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case 'newest':
      default:
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = orders.length;
    const page = Math.max(1, filters?.page || 1);
    const limit = filters?.limit ? Math.max(1, filters.limit) : 50;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(startIndex, startIndex + limit);

    return {
      orders: paginatedOrders,
      total,
      page,
      limit,
    };
  }

  public getOrderById(id: string): DBOrder | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: {
    customer: DBOrder['customer'];
    items: DBOrderItem[];
    subtotal: number;
    deliveryCharge: number;
    discountAmount?: number;
    totalAmount: number;
    deliveryMethod: string;
    paymentMethod: string;
    adminNotes?: string;
  }): DBOrder {
    const id = `ord-${Date.now()}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `GV-2026-${randomSuffix}`;

    const isCod = orderData.paymentMethod === 'cash-on-delivery';

    const newOrder: DBOrder = {
      id,
      orderNumber,
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge,
      discountAmount: orderData.discountAmount || 0,
      totalAmount: orderData.totalAmount,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'unpaid',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date().toISOString(),
          note: 'Order placed via API checkout',
          changedBy: 'Customer (Online Checkout)',
        },
      ],
      adminNotes: orderData.adminNotes,
      codExpectedAmount: isCod ? orderData.totalAmount : 0,
      codCollectedAmount: 0,
      codOutstandingBalance: isCod ? orderData.totalAmount : 0,
      codStatus: isCod ? 'awaiting_collection' : undefined,
      isStockRestored: false,
      auditTrail: [
        {
          action: 'ORDER_CREATED',
          performedBy: 'Customer',
          timestamp: new Date().toISOString(),
          details: `Order created with ${orderData.items.length} items. Total: ৳${orderData.totalAmount}. Payment: ${orderData.paymentMethod}`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);

    // Auto-update customer records
    this.upsertCustomerFromOrder(newOrder);

    // Auto-decrement product stock
    for (const item of newOrder.items) {
      const prod = this.data.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        prod.inStock = prod.stockQuantity > 0;
      }
    }

    this.persist();
    return newOrder;
  }

  public updateOrderStatus(
    id: string,
    newStatus: DBOrder['status'],
    note?: string,
    performedBy = 'Administrator'
  ): { success: boolean; order?: DBOrder; error?: string } {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: 'Order not found' };

    const oldStatus = order.status;

    // Check transition
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: newStatus,
      changedAt: new Date().toISOString(),
      note: note || `Status updated from ${oldStatus} to ${newStatus}`,
      changedBy: performedBy,
    });

    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: 'STATUS_CHANGED',
      performedBy,
      timestamp: new Date().toISOString(),
      previousValue: oldStatus,
      newValue: newStatus,
      details: note || `Order status updated to ${newStatus}`,
    });

    // Stock handling on cancellation: Restore stock strictly ONCE
    if (newStatus === 'cancelled' && !order.isStockRestored) {
      for (const item of order.items) {
        const prod = this.data.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockQuantity += item.quantity;
          prod.inStock = prod.stockQuantity > 0;

          // Record inventory audit
          this.data.inventoryAdjustments.unshift({
            id: `adj-${Date.now()}-${item.productId}`,
            productId: prod.id,
            productName: prod.nameEn,
            quantityChanged: item.quantity,
            newQuantity: prod.stockQuantity,
            reason: `Order cancelled (#${order.orderNumber}) - stock returned`,
            adminUserName: performedBy,
            createdAt: new Date().toISOString(),
          });
        }
      }
      order.isStockRestored = true;
      order.auditTrail.push({
        action: 'STOCK_RESTORED',
        performedBy,
        timestamp: new Date().toISOString(),
        details: 'All ordered item quantities restored to inventory safely without duplication.',
      });
    }

    // Set actual delivery date on delivery
    if (newStatus === 'delivered' && !order.actualDeliveryDate) {
      order.actualDeliveryDate = new Date().toISOString();
    }

    this.persist();
    return { success: true, order };
  }

  public updateOrderPaymentStatus(
    id: string,
    paymentStatus: DBOrder['paymentStatus'],
    performedBy = 'Administrator'
  ): DBOrder | null {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;

    const oldPayment = order.paymentStatus;
    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: 'PAYMENT_STATUS_UPDATED',
      performedBy,
      timestamp: new Date().toISOString(),
      previousValue: oldPayment,
      newValue: paymentStatus,
      details: `Payment status updated to ${paymentStatus}`,
    });

    this.persist();
    return order;
  }

  public updateOrderDelivery(
    id: string,
    deliveryData: {
      deliveryProvider?: string;
      trackingNumber?: string;
      dispatchDate?: string;
      expectedDeliveryDate?: string;
      deliveryNotes?: string;
    },
    performedBy = 'Administrator'
  ): DBOrder | null {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;

    if (deliveryData.deliveryProvider !== undefined) order.deliveryProvider = deliveryData.deliveryProvider;
    if (deliveryData.trackingNumber !== undefined) order.trackingNumber = deliveryData.trackingNumber;
    if (deliveryData.dispatchDate !== undefined) order.dispatchDate = deliveryData.dispatchDate;
    if (deliveryData.expectedDeliveryDate !== undefined) order.expectedDeliveryDate = deliveryData.expectedDeliveryDate;
    if (deliveryData.deliveryNotes !== undefined) order.deliveryNotes = deliveryData.deliveryNotes;

    order.updatedAt = new Date().toISOString();

    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: 'DELIVERY_INFO_UPDATED',
      performedBy,
      timestamp: new Date().toISOString(),
      details: `Courier provider: ${order.deliveryProvider || 'N/A'}, Tracking: ${order.trackingNumber || 'N/A'}`,
    });

    this.persist();
    return order;
  }

  public recordCodCollection(
    id: string,
    data: {
      collectedAmount: number;
      collectedByStaff: string;
      note?: string;
    },
    performedBy = 'Administrator'
  ): { success: boolean; order?: DBOrder; error?: string } {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: 'Order not found' };

    const expected = order.codExpectedAmount || order.totalAmount;
    const collected = Number(data.collectedAmount);

    if (isNaN(collected) || collected < 0) {
      return { success: false, error: 'Invalid collected amount' };
    }

    order.codCollectedAmount = collected;
    order.codCollectedAt = new Date().toISOString();
    order.codCollectedByStaff = data.collectedByStaff || performedBy;
    order.codOutstandingBalance = Math.max(0, expected - collected);

    if (collected >= expected) {
      order.codStatus = 'collected';
      order.paymentStatus = 'paid';
    } else if (collected > 0) {
      order.codStatus = 'partially_collected';
    } else {
      order.codStatus = 'discrepancy';
    }

    order.updatedAt = new Date().toISOString();

    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: 'COD_COLLECTION_RECORDED',
      performedBy,
      timestamp: new Date().toISOString(),
      details: `Collected ৳${collected} out of expected ৳${expected} by ${order.codCollectedByStaff}. Outstanding: ৳${order.codOutstandingBalance}`,
    });

    this.persist();
    return { success: true, order };
  }

  public processOrderReturn(
    id: string,
    data: {
      action: 'request' | 'approve' | 'reject';
      reason?: string;
      returnedQuantities?: Record<string, number>;
      restoreToStock?: boolean;
    },
    performedBy = 'Administrator'
  ): { success: boolean; order?: DBOrder; error?: string } {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: 'Order not found' };

    if (data.action === 'request') {
      order.status = 'return_requested';
      order.returnReason = data.reason || 'Customer requested return';
      order.returnRequestedAt = new Date().toISOString();
      order.returnStatus = 'pending_review';
    } else if (data.action === 'approve') {
      order.status = 'returned';
      order.returnStatus = 'approved';
      order.returnReviewedAt = new Date().toISOString();
      order.returnedQuantities = data.returnedQuantities;

      // Restore stock only for inspected, approved sellable items
      if (data.restoreToStock && data.returnedQuantities) {
        for (const [prodId, qty] of Object.entries(data.returnedQuantities)) {
          const numQty = Number(qty);
          if (numQty > 0) {
            const prod = this.data.products.find((p) => p.id === prodId);
            if (prod) {
              prod.stockQuantity += numQty;
              prod.inStock = prod.stockQuantity > 0;
              this.data.inventoryAdjustments.unshift({
                id: `adj-ret-${Date.now()}-${prodId}`,
                productId: prod.id,
                productName: prod.nameEn,
                quantityChanged: numQty,
                newQuantity: prod.stockQuantity,
                reason: `Returned sellable items inspected (#${order.orderNumber})`,
                adminUserName: performedBy,
                createdAt: new Date().toISOString(),
              });
            }
          }
        }
      }
    } else if (data.action === 'reject') {
      order.returnStatus = 'rejected';
      order.returnReviewedAt = new Date().toISOString();
      order.status = 'delivered'; // Revert to delivered
    }

    order.updatedAt = new Date().toISOString();

    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: `RETURN_${data.action.toUpperCase()}`,
      performedBy,
      timestamp: new Date().toISOString(),
      details: data.reason || `Return action ${data.action} processed.`,
    });

    this.persist();
    return { success: true, order };
  }

  public recordOrderRefund(
    id: string,
    data: {
      amount: number;
      reason: string;
    },
    performedBy = 'Administrator'
  ): { success: boolean; order?: DBOrder; error?: string } {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: 'Order not found' };

    const refundAmount = Number(data.amount);
    if (isNaN(refundAmount) || refundAmount <= 0) {
      return { success: false, error: 'Refund amount must be greater than 0' };
    }

    if (refundAmount > order.totalAmount) {
      return { success: false, error: `Refund amount cannot exceed total order value (৳${order.totalAmount})` };
    }

    order.refundAmount = refundAmount;
    order.refundReason = data.reason;
    order.refundRecordedAt = new Date().toISOString();
    order.refundRecordedBy = performedBy;

    if (refundAmount >= order.totalAmount) {
      order.paymentStatus = 'refunded';
      order.status = 'refunded';
    } else {
      order.paymentStatus = 'partially_refunded';
    }

    order.updatedAt = new Date().toISOString();

    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: 'REFUND_RECORDED',
      performedBy,
      timestamp: new Date().toISOString(),
      details: `Refunded ৳${refundAmount}. Reason: ${data.reason}`,
    });

    this.persist();
    return { success: true, order };
  }

  // CUSTOMERS
  public getCustomers(): DBCustomer[] {
    return [...this.data.customers];
  }

  public getCustomerById(id: string): DBCustomer | undefined {
    return this.data.customers.find((c) => c.id === id);
  }

  public findCustomerByMobile(mobileNumber: string): DBCustomer | undefined {
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    return this.data.customers.find((c) => c.mobileNumber.replace(/\D/g, '') === cleanPhone);
  }

  public findCustomerByEmail(email: string): DBCustomer | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return this.data.customers.find((c) => c.email?.trim().toLowerCase() === cleanEmail);
  }

  public findCustomerByIdentifier(identifier: string): DBCustomer | undefined {
    const trimmed = identifier.trim();
    if (trimmed.includes('@')) {
      return this.findCustomerByEmail(trimmed);
    }
    return this.findCustomerByMobile(trimmed);
  }

  public registerCustomer(data: {
    fullName: string;
    mobileNumber: string;
    email?: string;
    passwordHash: string;
    division?: string;
    district?: string;
    upazila?: string;
    addressDetail?: string;
  }): DBCustomer {
    const now = new Date().toISOString();
    const newCustomer: DBCustomer = {
      id: `cust-${Date.now()}`,
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      passwordHash: data.passwordHash,
      division: data.division || 'Dhaka',
      district: data.district || 'Dhaka',
      upazila: data.upazila || '',
      addressDetail: data.addressDetail || '',
      wishlist: [],
      totalOrders: 0,
      totalSpent: 0,
      firstOrderDate: now,
      lastOrderDate: now,
      createdAt: now,
      updatedAt: now,
    };
    this.data.customers.push(newCustomer);
    this.persist();
    return newCustomer;
  }

  public updateCustomer(id: string, updates: Partial<DBCustomer>): DBCustomer | null {
    const customer = this.data.customers.find((c) => c.id === id);
    if (!customer) return null;

    if (updates.fullName !== undefined) customer.fullName = updates.fullName;
    if (updates.email !== undefined) customer.email = updates.email;
    if (updates.division !== undefined) customer.division = updates.division;
    if (updates.district !== undefined) customer.district = updates.district;
    if (updates.upazila !== undefined) customer.upazila = updates.upazila;
    if (updates.addressDetail !== undefined) customer.addressDetail = updates.addressDetail;
    if (updates.passwordHash !== undefined) customer.passwordHash = updates.passwordHash;
    if (updates.wishlist !== undefined) customer.wishlist = updates.wishlist;

    customer.updatedAt = new Date().toISOString();
    this.persist();
    return customer;
  }

  public toggleCustomerWishlist(customerId: string, productId: string): string[] {
    const customer = this.data.customers.find((c) => c.id === customerId);
    if (!customer) return [];
    if (!customer.wishlist) customer.wishlist = [];

    const index = customer.wishlist.indexOf(productId);
    if (index > -1) {
      customer.wishlist.splice(index, 1);
    } else {
      customer.wishlist.push(productId);
    }
    customer.updatedAt = new Date().toISOString();
    this.persist();
    return [...customer.wishlist];
  }

  public getCustomerOrders(mobileNumber: string): DBOrder[] {
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    return this.data.orders.filter((o) => {
      const orderPhone = (o.customer?.mobileNumber || '').replace(/\D/g, '');
      return orderPhone === cleanPhone;
    });
  }

  private upsertCustomerFromOrder(order: DBOrder) {
    const existing = this.data.customers.find(
      (c) => c.mobileNumber === order.customer.mobileNumber
    );
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.totalAmount;
      existing.lastOrderDate = order.createdAt;
      existing.fullName = order.customer.fullName || existing.fullName;
      existing.addressDetail = order.customer.addressDetail || existing.addressDetail;
      existing.updatedAt = new Date().toISOString();
    } else {
      const newCust: DBCustomer = {
        id: `cust-${Date.now()}`,
        fullName: order.customer.fullName,
        mobileNumber: order.customer.mobileNumber,
        email: order.customer.email,
        division: order.customer.division,
        district: order.customer.district,
        upazila: order.customer.upazila,
        addressDetail: order.customer.addressDetail,
        totalOrders: 1,
        totalSpent: order.totalAmount,
        firstOrderDate: order.createdAt,
        lastOrderDate: order.createdAt,
        createdAt: order.createdAt,
        updatedAt: order.createdAt,
      };
      this.data.customers.push(newCust);
    }
  }

  // INVENTORY
  public getInventoryAdjustments(): DBInventoryAdjustment[] {
    return [...this.data.inventoryAdjustments];
  }

  public adjustStock(
    productId: string,
    quantityChanged: number,
    reason: string,
    adminUserName: string
  ): DBProduct | null {
    const prod = this.data.products.find((p) => p.id === productId);
    if (!prod) return null;

    prod.stockQuantity = Math.max(0, prod.stockQuantity + quantityChanged);
    prod.inStock = prod.stockQuantity > 0;
    prod.updatedAt = new Date().toISOString();

    const adjustment: DBInventoryAdjustment = {
      id: `inv-${Date.now()}`,
      productId,
      productName: prod.nameEn,
      quantityChanged,
      newQuantity: prod.stockQuantity,
      reason,
      adminUserName,
      createdAt: new Date().toISOString(),
    };
    this.data.inventoryAdjustments.unshift(adjustment);

    this.persist();
    return prod;
  }

  // SETTINGS
  public getSettings(): DBStoreSettings {
    return { ...this.data.settings };
  }

  public updateSettings(updates: Partial<DBStoreSettings>): DBStoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.persist();
    return { ...this.data.settings };
  }

  // REPORTING & ANALYTICS
  private getDateFilterBounds(range?: string, customStart?: string, customEnd?: string): { start: number; end: number; label: string } {
    // Current time in Asia/Dhaka (UTC+6)
    const now = new Date();
    const nowUtc = now.getTime();
    const dhakaOffset = 6 * 3600 * 1000;
    const dhakaNow = new Date(nowUtc + dhakaOffset);

    // Helper for start of day in Dhaka
    const startOfDhakaDay = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth(), dhakaNow.getDate()).getTime() - dhakaOffset;
    const endOfDhakaDay = startOfDhakaDay + 86400000 - 1;

    switch (range) {
      case 'today':
        return { start: startOfDhakaDay, end: endOfDhakaDay, label: 'Today (আজকে)' };
      case 'yesterday': {
        const start = startOfDhakaDay - 86400000;
        const end = startOfDhakaDay - 1;
        return { start, end, label: 'Yesterday (গতকাল)' };
      }
      case 'last_7_days': {
        const start = startOfDhakaDay - 6 * 86400000;
        return { start, end: endOfDhakaDay, label: 'Last 7 Days (গত ৭ দিন)' };
      }
      case 'last_30_days': {
        const start = startOfDhakaDay - 29 * 86400000;
        return { start, end: endOfDhakaDay, label: 'Last 30 Days (গত ৩০ দিন)' };
      }
      case 'this_month': {
        const start = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth(), 1).getTime() - dhakaOffset;
        return { start, end: endOfDhakaDay, label: 'This Month (চলতি মাস)' };
      }
      case 'previous_month': {
        const start = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth() - 1, 1).getTime() - dhakaOffset;
        const end = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth(), 0, 23, 59, 59, 999).getTime() - dhakaOffset;
        return { start, end, label: 'Previous Month (পূর্ববর্তী মাস)' };
      }
      case 'custom': {
        if (customStart && customEnd) {
          const start = new Date(customStart).getTime();
          const end = new Date(customEnd).getTime() + 86400000 - 1;
          return { start, end, label: `Custom: ${customStart} to ${customEnd}` };
        }
        return { start: 0, end: Date.now() + 86400000, label: 'All Time (সর্বকালীন)' };
      }
      case 'all_time':
      default:
        return { start: 0, end: Date.now() + 86400000, label: 'All Time (সর্বকালীন)' };
    }
  }

  public getDashboardMetrics(range = 'all_time', customStart?: string, customEnd?: string) {
    const { start, end, label } = this.getDateFilterBounds(range, customStart, customEnd);

    // Filter orders by date range
    const inRangeOrders = this.data.orders.filter((o) => {
      const orderTime = new Date(o.createdAt).getTime();
      return orderTime >= start && orderTime <= end;
    });

    const totalOrders = inRangeOrders.length;
    const pendingOrders = inRangeOrders.filter((o) => o.status === 'pending').length;
    const confirmedOrders = inRangeOrders.filter((o) => o.status === 'confirmed').length;
    const processingOrders = inRangeOrders.filter((o) => o.status === 'processing').length;
    const shippedOrders = inRangeOrders.filter((o) => o.status === 'shipped').length;
    const deliveredOrders = inRangeOrders.filter((o) => o.status === 'delivered').length;
    const cancelledOrders = inRangeOrders.filter((o) => o.status === 'cancelled').length;

    // Financial Metrics
    // Gross Order Value: Sum of non-cancelled orders
    const nonCancelledOrders = inRangeOrders.filter((o) => o.status !== 'cancelled');
    const totalOrderValue = nonCancelledOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Delivered Order Value: Actual successful sales
    const deliveredList = inRangeOrders.filter((o) => o.status === 'delivered');
    const deliveredOrderValue = deliveredList.reduce((sum, o) => sum + o.totalAmount, 0);

    // Actual collected payments: verified COD collected + online payments
    const actualCollectedPayments = inRangeOrders.reduce((sum, o) => {
      if (o.paymentStatus === 'paid' && o.paymentMethod !== 'cash-on-delivery') {
        return sum + o.totalAmount;
      }
      return sum + (o.codCollectedAmount || 0);
    }, 0);

    // Outstanding Cash on Delivery: expected minus collected on non-cancelled eligible orders
    const outstandingCod = inRangeOrders
      .filter((o) => o.paymentMethod === 'cash-on-delivery' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.codOutstandingBalance ?? (o.totalAmount - (o.codCollectedAmount || 0))), 0);

    // Total verified refunds
    const totalRefunds = inRangeOrders.reduce((sum, o) => sum + (o.refundAmount || 0), 0);

    // Net Sales = Delivered Order Value minus verified refunds
    const netSales = Math.max(0, deliveredOrderValue - totalRefunds);

    // Average Order Value (AOV)
    const validCountForAov = nonCancelledOrders.length;
    const averageOrderValue = validCountForAov > 0 ? Math.round(totalOrderValue / validCountForAov) : 0;

    // Products & Inventory Metrics
    const totalProducts = this.data.products.length;
    const plantProducts = this.data.products.filter((p) => p.type === 'plant').length;
    const seedProducts = this.data.products.filter((p) => p.type === 'seed').length;
    const lowStockProducts = this.data.products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
    const outOfStockProducts = this.data.products.filter((p) => p.stockQuantity === 0).length;
    const totalCustomers = this.data.customers.length;

    return {
      // 12 Mandatory Summary Cards
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalOrderValue,
      actualCollectedPayments,
      outstandingCod,
      totalProducts,
      lowStockProducts,

      // Accurate business metrics
      deliveredOrderValue,
      netSales,
      totalRefunds,
      averageOrderValue,
      profitStatus: 'Profit data not configured (Cost tracking required)',
      plantProducts,
      seedProducts,
      outOfStockProducts,
      totalCustomers,
      timeRangeLabel: label,
      timezone: 'Asia/Dhaka (UTC+6)',
    };
  }

  public getSalesTrend(range = 'last_30_days') {
    const { start, end } = this.getDateFilterBounds(range);
    const inRangeOrders = this.data.orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= start && t <= end && o.status !== 'cancelled';
    });

    // Group by Day (YYYY-MM-DD)
    const dayMap = new Map<string, { date: string; label: string; sales: number; ordersCount: number }>();

    // Seed empty days if 7 or 30 days
    const numDays = Math.min(30, Math.ceil((end - start) / 86400000));
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(end - i * 86400000);
      const iso = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      dayMap.set(iso, { date: iso, label, sales: 0, ordersCount: 0 });
    }

    inRangeOrders.forEach((o) => {
      const iso = o.createdAt.slice(0, 10);
      const existing = dayMap.get(iso);
      if (existing) {
        existing.sales += o.totalAmount;
        existing.ordersCount += 1;
      } else {
        const d = new Date(o.createdAt);
        dayMap.set(iso, {
          date: iso,
          label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          sales: o.totalAmount,
          ordersCount: 1,
        });
      }
    });

    return Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  public getStatusDistribution(range = 'all_time') {
    const { start, end } = this.getDateFilterBounds(range);
    const inRangeOrders = this.data.orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= start && t <= end;
    });

    const statuses: Array<{ key: string; labelEn: string; labelBn: string; color: string }> = [
      { key: 'pending', labelEn: 'Pending', labelBn: 'নতুন অর্ডার', color: '#D97706' },
      { key: 'confirmed', labelEn: 'Confirmed', labelBn: 'নিশ্চিত', color: '#2563EB' },
      { key: 'processing', labelEn: 'Processing', labelBn: 'প্রস্তুত হচ্ছে', color: '#7C3AED' },
      { key: 'packed', labelEn: 'Packed', labelBn: 'প্যাক করা', color: '#0D9488' },
      { key: 'shipped', labelEn: 'Shipped', labelBn: 'শিপড', color: '#0284C7' },
      { key: 'delivered', labelEn: 'Delivered', labelBn: 'ডেলিভার্ড', color: '#15803D' },
      { key: 'cancelled', labelEn: 'Cancelled', labelBn: 'বাতিল', color: '#DC2626' },
      { key: 'return_requested', labelEn: 'Return Req.', labelBn: 'রিটার্ন আবেদন', color: '#C026D3' },
      { key: 'returned', labelEn: 'Returned', labelBn: 'ফেরত', color: '#4B5563' },
      { key: 'refunded', labelEn: 'Refunded', labelBn: 'রিফান্ডেড', color: '#059669' },
    ];

    return statuses.map((s) => {
      const matching = inRangeOrders.filter((o) => o.status === s.key);
      const count = matching.length;
      const value = matching.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        status: s.key,
        labelEn: s.labelEn,
        labelBn: s.labelBn,
        count,
        value,
        color: s.color,
      };
    });
  }

  public getTopSellingProducts(range = 'all_time', category?: string, limit = 10) {
    const { start, end } = this.getDateFilterBounds(range);
    const inRangeOrders = this.data.orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= start && t <= end && o.status !== 'cancelled';
    });

    // Aggregate units sold and gross sales by productId
    const productStats = new Map<
      string,
      {
        productId: string;
        nameEn: string;
        nameBn: string;
        imageUrl: string;
        sku: string;
        categorySlug: string;
        type: string;
        unitsSold: number;
        qualifyingOrdersCount: number;
        grossSales: number;
      }
    >();

    inRangeOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = this.data.products.find((p) => p.id === item.productId);
        if (category && category !== 'all' && prod && prod.categorySlug !== category && prod.type !== category) {
          return;
        }

        const existing = productStats.get(item.productId);
        if (existing) {
          existing.unitsSold += item.quantity;
          existing.qualifyingOrdersCount += 1;
          existing.grossSales += item.lineSubtotal;
        } else {
          productStats.set(item.productId, {
            productId: item.productId,
            nameEn: prod?.nameEn || item.productName,
            nameBn: prod?.nameBn || item.productName,
            imageUrl: prod?.imageUrl || item.imageUrl || '',
            sku: prod?.SKU || item.productId,
            categorySlug: prod?.categorySlug || 'general',
            type: prod?.type || 'plant',
            unitsSold: item.quantity,
            qualifyingOrdersCount: 1,
            grossSales: item.lineSubtotal,
          });
        }
      });
    });

    return Array.from(productStats.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, limit);
  }

  public getInventoryAlerts(threshold = 10) {
    return this.data.products.map((p) => {
      let stockStatus: 'out_of_stock' | 'low_stock' | 'healthy_stock';
      if (p.stockQuantity === 0) {
        stockStatus = 'out_of_stock';
      } else if (p.stockQuantity <= threshold) {
        stockStatus = 'low_stock';
      } else {
        stockStatus = 'healthy_stock';
      }

      return {
        productId: p.id,
        nameEn: p.nameEn,
        nameBn: p.nameBn,
        imageUrl: p.imageUrl,
        sku: p.SKU,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: threshold,
        categorySlug: p.categorySlug,
        type: p.type,
        stockStatus,
      };
    });
  }

  public exportAnalyticsCsv(type: string, range = 'all_time'): string {
    const escape = (val: unknown): string => {
      let s = String(val ?? '').replace(/"/g, '""');
      if (s.startsWith('=') || s.startsWith('+') || s.startsWith('-') || s.startsWith('@')) {
        s = `'${s}`;
      }
      return `"${s}"`;
    };

    if (type === 'top_products') {
      const products = this.getTopSellingProducts(range, undefined, 100);
      const headers = ['Product ID', 'Name (English)', 'Name (Bengali)', 'SKU', 'Units Sold', 'Orders Count', 'Gross Sales (BDT)'];
      const rows = products.map((p) => [
        escape(p.productId),
        escape(p.nameEn),
        escape(p.nameBn),
        escape(p.sku),
        escape(p.unitsSold),
        escape(p.qualifyingOrdersCount),
        escape(p.grossSales),
      ]);
      return '\uFEFF' + [headers.map(escape).join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (type === 'inventory_alerts') {
      const items = this.getInventoryAlerts();
      const headers = ['Product ID', 'Name', 'SKU', 'Category', 'Available Stock', 'Status'];
      const rows = items.map((i) => [
        escape(i.productId),
        escape(i.nameEn),
        escape(i.sku),
        escape(i.categorySlug),
        escape(i.stockQuantity),
        escape(i.stockStatus.toUpperCase()),
      ]);
      return '\uFEFF' + [headers.map(escape).join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    // Default: summary metrics
    const metrics = this.getDashboardMetrics(range);
    const headers = ['Metric Label (English)', 'Metric Label (Bengali)', 'Calculated Value'];
    const rows = [
      [escape('Total Orders'), escape('মোট অর্ডার'), escape(metrics.totalOrders)],
      [escape('Pending Orders'), escape('নতুন অর্ডার'), escape(metrics.pendingOrders)],
      [escape('Confirmed Orders'), escape('নিশ্চিত অর্ডার'), escape(metrics.confirmedOrders)],
      [escape('Processing Orders'), escape('প্রস্তুত হচ্ছে'), escape(metrics.processingOrders)],
      [escape('Shipped Orders'), escape('শিপড'), escape(metrics.shippedOrders)],
      [escape('Delivered Orders'), escape('ডেলিভার্ড'), escape(metrics.deliveredOrders)],
      [escape('Cancelled Orders'), escape('বাতিল'), escape(metrics.cancelledOrders)],
      [escape('Gross Order Value (BDT)'), escape('মোট অর্ডার মূল্য'), escape(metrics.totalOrderValue)],
      [escape('Delivered Order Value (BDT)'), escape('সফল ডেলিভারি বিক্রয়'), escape(metrics.deliveredOrderValue)],
      [escape('Actual Collected Payments (BDT)'), escape('সংগৃহীত ক্যাশ/পেমেন্ট'), escape(metrics.actualCollectedPayments)],
      [escape('Outstanding COD (BDT)'), escape('বকেয়া ক্যাশ-অন-ডেলিভারি'), escape(metrics.outstandingCod)],
      [escape('Verified Refunds (BDT)'), escape('রিফান্ডকৃত টাকা'), escape(metrics.totalRefunds)],
      [escape('Net Sales (BDT)'), escape('নেট বিক্রয়'), escape(metrics.netSales)],
      [escape('Average Order Value (BDT)'), escape('গড় অর্ডার মূল্য'), escape(metrics.averageOrderValue)],
      [escape('Profit Data'), escape('প্রফিট স্ট্যাটাস'), escape(metrics.profitStatus)],
    ];
    return '\uFEFF' + [headers.map(escape).join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const db = new DatabaseService();
