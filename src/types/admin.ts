/**
 * @file admin.ts
 * @description Domain interfaces for Gardenvaly administrative dashboard, reports, metrics, and role sessions.
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'store_manager' | 'inventory_staff';
  avatar?: string;
  lastLogin?: string;
}

export type DateRangeOption =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'previous_month'
  | 'custom'
  | 'all_time';

export interface DashboardMetrics {
  // 12 Mandatory Summary Cards
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalOrderValue: number; // Gross Order Value in BDT
  actualCollectedPayments: number; // Verified payments collected in BDT
  outstandingCod: number; // Uncollected COD balance in BDT
  totalProducts: number;
  lowStockProducts: number;

  // Additional Real Business Metrics
  deliveredOrderValue: number;
  netSales: number; // Formula: Delivered Order Value - (Approved Returns + Refunds)
  totalRefunds: number;
  averageOrderValue: number; // AOV
  profitStatus: string; // "Profit data not configured (Cost tracking required)"
  plantProducts: number;
  seedProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  timeRangeLabel: string;
  timezone: string;
}

export interface SalesTrendPoint {
  date: string; // ISO date or DD Mon
  label: string;
  sales: number;
  ordersCount: number;
}

export interface StatusDistributionPoint {
  status: string;
  labelEn: string;
  labelBn: string;
  count: number;
  value: number;
  color: string;
}

export interface PaymentSummaryMetrics {
  paid: number;
  unpaid: number;
  partiallyRefunded: number;
  refunded: number;
  outstandingCod: number;
  totalExpectedCod: number;
}

export interface TopSellingProduct {
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

export interface InventoryAlertItem {
  productId: string;
  nameEn: string;
  nameBn: string;
  imageUrl: string;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  categorySlug: string;
  type: string;
  stockStatus: 'out_of_stock' | 'low_stock' | 'healthy_stock';
}

export interface StoreSettings {
  storeNameEn: string;
  storeNameBn: string;
  signatureEn: string;
  signatureBn: string;
  taglineEn?: string;
  taglineBn?: string;
  locationEn?: string;
  locationBn?: string;
  contactPhone: string;
  contactEmail: string;
  officialWhatsapp: string;
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
