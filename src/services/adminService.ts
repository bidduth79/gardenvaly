/**
 * @file adminService.ts
 * @description Administration data service for products, categories, inventory, metrics, and store settings.
 */

import { Product, Category } from '../types/product';
import { DashboardMetrics, StoreSettings } from '../types/admin';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_CATEGORIES } from '../data/mockCategories';
import { orderService } from './orderService';
import { loggerService } from './loggerService';
import { apiClient } from './apiClient';
import { settingsService } from './settingsService';

const ADMIN_PRODUCTS_KEY = 'gardenvaly_admin_products';
const ADMIN_CATEGORIES_KEY = 'gardenvaly_admin_categories';
const ADMIN_SETTINGS_KEY = 'gardenvaly_admin_settings';

const DEFAULT_SETTINGS: StoreSettings = {
  storeNameEn: 'Gardenvaly',
  storeNameBn: 'গার্ডেনভ্যালি',
  signatureEn: 'by Hasna Hena',
  signatureBn: 'হাসনা হেনা কর্তৃক পরিচালিত',
  contactPhone: '+880 1712-345678',
  contactEmail: 'contact@gardenvaly.com',
  officialWhatsapp: '+880 1712-345678',
  standardDeliveryFee: 60,
  freeDeliveryThreshold: 2000,
  enablePickup: true,
  orderNotificationEmail: 'admin@gardenvaly.com',
  maintenanceMode: false,
  demoModeNotice: true,
};

function loadStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
      return [...MOCK_PRODUCTS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...MOCK_PRODUCTS];
  } catch (err) {
    loggerService.warn('Failed to parse admin products from localStorage', 'AdminService');
    return [...MOCK_PRODUCTS];
  }
}

function persistProducts(prods: Product[]): void {
  try {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(prods));
  } catch (err) {
    loggerService.error('Failed to save admin products', err, 'AdminService');
  }
}

function loadStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(ADMIN_CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(MOCK_CATEGORIES));
      return [...MOCK_CATEGORIES];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...MOCK_CATEGORIES];
  } catch (err) {
    return [...MOCK_CATEGORIES];
  }
}

function persistCategories(cats: Category[]): void {
  try {
    localStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(cats));
  } catch (err) {
    loggerService.error('Failed to save admin categories', err, 'AdminService');
  }
}

export const adminService = {
  async getDashboardMetrics(range = 'all_time', customStart?: string, customEnd?: string): Promise<DashboardMetrics> {
    try {
      const params = new URLSearchParams();
      if (range) params.append('range', range);
      if (customStart) params.append('customStart', customStart);
      if (customEnd) params.append('customEnd', customEnd);

      const res = await apiClient.get<DashboardMetrics>(`/reports/dashboard?${params.toString()}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // fallback
    }

    const prods = loadStoredProducts();
    const orders = await orderService.getOrders();
    const customers = await orderService.getCustomers();

    const plantCount = prods.filter((p) => p.type === 'plant').length;
    const seedCount = prods.filter((p) => p.type === 'seed').length;
    const lowStock = prods.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
    const outOfStock = prods.filter((p) => p.stockQuantity === 0 || !p.inStock).length;

    const pending = orders.filter((o) => o.status === 'pending').length;
    const confirmed = orders.filter((o) => o.status === 'confirmed').length;
    const processing = orders.filter((o) => o.status === 'processing').length;
    const shipped = orders.filter((o) => o.status === 'shipped').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const cancelled = orders.filter((o) => o.status === 'cancelled').length;

    const grossOrderValue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
    const deliveredValue = orders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);
    const collectedPayments = orders.reduce((sum, o) => sum + (o.codCollectedAmount || (o.paymentStatus === 'paid' ? o.totalAmount : 0)), 0);
    const outstandingCod = orders
      .filter((o) => o.paymentMethod === 'cash-on-delivery' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.codOutstandingBalance ?? (o.totalAmount - (o.codCollectedAmount || 0))), 0);

    const nonCancelled = orders.filter((o) => o.status !== 'cancelled');

    return {
      totalOrders: orders.length,
      pendingOrders: pending,
      confirmedOrders: confirmed,
      processingOrders: processing,
      shippedOrders: shipped,
      deliveredOrders: delivered,
      cancelledOrders: cancelled,
      totalOrderValue: grossOrderValue,
      actualCollectedPayments: collectedPayments,
      outstandingCod,
      totalProducts: prods.length,
      lowStockProducts: lowStock,
      deliveredOrderValue: deliveredValue,
      netSales: deliveredValue,
      totalRefunds: 0,
      averageOrderValue: nonCancelled.length > 0 ? Math.round(grossOrderValue / nonCancelled.length) : 0,
      profitStatus: 'Profit data not configured (Cost tracking required)',
      plantProducts: plantCount,
      seedProducts: seedCount,
      outOfStockProducts: outOfStock,
      totalCustomers: customers.length,
      timeRangeLabel: range.replace(/_/g, ' ').toUpperCase(),
      timezone: 'Asia/Dhaka (UTC+6)',
    };
  },

  async getSalesTrend(range = 'last_30_days') {
    try {
      const res = await apiClient.get<any[]>(`/reports/sales-trend?range=${range}`);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return [];
  },

  async getStatusDistribution(range = 'all_time') {
    try {
      const res = await apiClient.get<any[]>(`/reports/status-distribution?range=${range}`);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return [];
  },

  async getTopSellingProducts(range = 'all_time', category?: string, limit = 10) {
    try {
      const params = new URLSearchParams();
      if (range) params.append('range', range);
      if (category) params.append('category', category);
      if (limit) params.append('limit', String(limit));

      const res = await apiClient.get<any[]>(`/reports/top-products?${params.toString()}`);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return [];
  },

  async getInventoryAlerts(threshold = 10) {
    try {
      const res = await apiClient.get<any[]>(`/reports/inventory-alerts?threshold=${threshold}`);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return [];
  },

  async getAllProducts(): Promise<Product[]> {
    try {
      const res = await apiClient.get<Product[]>('/products?publishedOnly=false');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        persistProducts(res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return loadStoredProducts();
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await apiClient.get<Product>(`/products/${id}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // fallback
    }
    const prods = loadStoredProducts();
    return prods.find((p) => p.id === id || p.slug === id) || null;
  },

  async saveProduct(productData: Partial<Product> & { nameEn: string; price: number }): Promise<Product> {
    const prods = loadStoredProducts();
    const isEdit = Boolean(productData.id);

    if (isEdit) {
      const idx = prods.findIndex((p) => p.id === productData.id);
      if (idx !== -1) {
        const updated: Product = {
          ...prods[idx],
          ...productData,
          slug: productData.slug || prods[idx].slug,
          inStock: (productData.stockQuantity ?? prods[idx].stockQuantity) > 0,
        };
        prods[idx] = updated;
        persistProducts(prods);
        return updated;
      }
    }

    // New product
    const newId = `prod-${Date.now()}`;
    const slug =
      productData.slug ||
      productData.nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProduct: Product = {
      id: newId,
      slug,
      nameEn: productData.nameEn,
      nameBn: productData.nameBn || productData.nameEn,
      botanicalName: productData.botanicalName,
      category: productData.category || 'General',
      categorySlug: productData.categorySlug || 'general',
      type: productData.type || 'plant',
      price: productData.price,
      originalPrice: productData.originalPrice,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl:
        productData.imageUrl ||
        'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
      images: productData.images && productData.images.length > 0
        ? productData.images
        : [productData.imageUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80'],
      isFeatured: Boolean(productData.isFeatured),
      isBestseller: Boolean(productData.isBestseller),
      inStock: (productData.stockQuantity ?? 10) > 0,
      stockQuantity: productData.stockQuantity ?? 10,
      SKU: productData.SKU || `GV-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      tagsEn: productData.tagsEn || ['new-arrival'],
      tagsBn: productData.tagsBn || ['নতুন'],
      indoorOutdoor: productData.indoorOutdoor || 'indoor',
      sunlightEn: productData.sunlightEn || 'Bright, indirect sunlight',
      sunlightBn: productData.sunlightBn || 'উজ্জ্বল পরোক্ষ আলো',
      waterEn: productData.waterEn || 'Water when topsoil dries',
      waterBn: productData.waterBn || 'মাটি শুকালে পানি দিন',
      soilTypeEn: productData.soilTypeEn || 'Well-draining potting mix',
      soilTypeBn: productData.soilTypeBn || 'পানি নিষ্কাশন উপযোগী মাটি',
      shortDescEn: productData.shortDescEn || productData.descriptionEn || 'Fresh nursery specimen grown with care by Gardenvaly.',
      shortDescBn: productData.shortDescBn || productData.descriptionBn || 'গার্ডেনভ্যালির নিজস্ব নার্সারিতে যত্নসহকারে উৎপাদিত।',
      fullDescEn: productData.fullDescEn || productData.descriptionEn || 'Carefully cultivated specimen from Gardenvaly by Hasna Hena nursery.',
      fullDescBn: productData.fullDescBn || productData.descriptionBn || 'গার্ডেনভ্যালির নিজস্ব নার্সারিতে হাসনা হেনা কর্তৃক সযত্নে উৎপাদিত।',
      descriptionEn: productData.descriptionEn,
      descriptionBn: productData.descriptionBn,
    };

    prods.unshift(newProduct);
    persistProducts(prods);
    return newProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    let prods = loadStoredProducts();
    const initLen = prods.length;
    prods = prods.filter((p) => p.id !== id);
    if (prods.length < initLen) {
      persistProducts(prods);
      return true;
    }
    return false;
  },

  async updateStock(id: string, newStock: number): Promise<Product | null> {
    const prods = loadStoredProducts();
    const idx = prods.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    prods[idx] = {
      ...prods[idx],
      stockQuantity: Math.max(0, newStock),
      inStock: newStock > 0,
    };
    persistProducts(prods);
    return prods[idx];
  },

  async getAllCategories(): Promise<Category[]> {
    return loadStoredCategories();
  },

  async saveCategory(catData: Partial<Category> & { nameEn: string }): Promise<Category> {
    const cats = loadStoredCategories();
    if (catData.id) {
      const idx = cats.findIndex((c) => c.id === catData.id);
      if (idx !== -1) {
        const updated: Category = { ...cats[idx], ...catData };
        cats[idx] = updated;
        persistCategories(cats);
        return updated;
      }
    }

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug:
        catData.slug ||
        catData.nameEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      type: catData.type || 'plant',
      nameEn: catData.nameEn,
      nameBn: catData.nameBn || catData.nameEn,
      descriptionEn: catData.descriptionEn || '',
      descriptionBn: catData.descriptionBn || '',
      imageUrl:
        catData.imageUrl ||
        'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
      itemCount: catData.itemCount || 0,
    };
    cats.push(newCat);
    persistCategories(cats);
    return newCat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    let cats = loadStoredCategories();
    const initLen = cats.length;
    cats = cats.filter((c) => c.id !== id);
    if (cats.length < initLen) {
      persistCategories(cats);
      return true;
    }
    return false;
  },

  getStoreSettings(): StoreSettings {
    return settingsService.getSettings();
  },

  async saveStoreSettings(settings: StoreSettings): Promise<void> {
    await settingsService.saveSettings(settings);
  },
};
