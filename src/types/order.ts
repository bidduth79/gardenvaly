/**
 * @file order.ts
 * @description Comprehensive order domain types for customer orders and administrative tracking.
 * Supports full 10-stage order lifecycle, COD reconciliation, and audit logs.
 */

import { CustomerInfo, DeliveryMethodId, PaymentMethodId } from './cart';

export type OrderStatus =
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

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'partially_refunded'
  | 'refunded'
  | 'failed';

export type CodReconciliationStatus =
  | 'awaiting_collection'
  | 'collected'
  | 'partially_collected'
  | 'discrepancy';

export interface OrderItem {
  productId: string;
  productName: string;
  slug?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  changedAt: string;
  note?: string;
  changedBy?: string;
}

export interface OrderAuditLogItem {
  action: string;
  performedBy: string;
  timestamp: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
}

export type Order = AdminOrder;

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount?: number;
  totalAmount: number;
  deliveryMethod: DeliveryMethodId;
  paymentMethod: PaymentMethodId;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory?: OrderStatusHistoryItem[];
  adminNotes?: string;

  // Courier & Delivery Management
  deliveryProvider?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  courierResponse?: any;
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
  codStatus?: CodReconciliationStatus;

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

  // Inventory Protection Flag
  isStockRestored?: boolean;

  // Append-only Audit Trail
  auditTrail?: OrderAuditLogItem[];

  createdAt: string;
  updatedAt: string;
}

export interface AdminCustomer {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  district: string;
  division: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
}

export interface OrderFilterParams {
  search?: string;
  status?: OrderStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  paymentMethod?: PaymentMethodId | 'all';
  deliveryArea?: 'all' | 'dhaka' | 'outside_dhaka';
  startDate?: string;
  endDate?: string;
  sortBy?: 'newest' | 'oldest' | 'highest_total' | 'lowest_total';
  page?: number;
  limit?: number;
}
