/**
 * @file orderService.ts
 * @description Order management service with complete 10-stage lifecycle, COD reconciliation,
 * courier management, and robust backend API integration with local fallback.
 */

import {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
  AdminCustomer,
  OrderItem,
  OrderFilterParams,
} from '../types/order';
import { CustomerInfo, DeliveryMethodId, PaymentMethodId } from '../types/cart';
import { loggerService } from './loggerService';
import { apiClient } from './apiClient';

const ORDERS_STORAGE_KEY = 'gardenvaly_admin_orders';

// Initial realistic demo orders
const INITIAL_DEMO_ORDERS: AdminOrder[] = [
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
        productName: 'Monstera Deliciosa (Swiss Cheese Plant)',
        slug: 'monstera-deliciosa',
        imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 850,
        lineSubtotal: 850,
      },
      {
        productId: 'seed-1',
        productName: 'Heirloom Tomato Seeds (টমেটো বীজ)',
        slug: 'heirloom-tomato-seeds',
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80',
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
    codExpectedAmount: 1150,
    codCollectedAmount: 0,
    codOutstandingBalance: 1150,
    codStatus: 'awaiting_collection',
    statusHistory: [
      {
        status: 'pending',
        changedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        note: 'Order placed via website checkout',
      },
    ],
    auditTrail: [
      {
        action: 'ORDER_CREATED',
        performedBy: 'Tahmina Akter',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        details: 'Initial order placement via checkout.',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ord-1002',
    orderNumber: 'GV-2026-0842',
    customer: {
      fullName: 'Dr. Rafiqul Islam',
      mobileNumber: '01819876543',
      email: 'rafiqul.plantlove@gmail.com',
      division: 'Chattogram',
      district: 'Chattogram',
      upazila: 'Panchlaish',
      addressDetail: 'Flat 6A, Green Tower, Nasirabad Housing Society',
      deliveryInstructions: 'Fragile plants. Handle nursery potting with extra care.',
    },
    items: [
      {
        productId: 'plant-2',
        productName: 'Snake Plant Laurentii (সাপের গাছ)',
        slug: 'snake-plant-laurentii',
        imageUrl: 'https://images.unsplash.com/photo-1599598425947-5202edd564c4?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 450,
        lineSubtotal: 450,
      },
      {
        productId: 'plant-3',
        productName: 'Peace Lily (শান্তির লিলি)',
        slug: 'peace-lily-plant',
        imageUrl: 'https://images.unsplash.com/photo-1593482874117-89e3a745bf37?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        unitPrice: 550,
        lineSubtotal: 550,
      },
    ],
    subtotal: 1000,
    deliveryCharge: 120,
    totalAmount: 1120,
    deliveryMethod: 'home-delivery',
    paymentMethod: 'cash-on-delivery',
    paymentStatus: 'paid',
    status: 'delivered',
    deliveryProvider: 'Steadfast Courier',
    trackingNumber: 'ST-9874102',
    dispatchDate: new Date(Date.now() - 3600000 * 48).toISOString(),
    actualDeliveryDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    codExpectedAmount: 1120,
    codCollectedAmount: 1120,
    codCollectedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    codCollectedByStaff: 'Steadfast Courier Agent',
    codOutstandingBalance: 0,
    codStatus: 'collected',
    statusHistory: [
      {
        status: 'pending',
        changedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        note: 'Order placed',
      },
      {
        status: 'confirmed',
        changedAt: new Date(Date.now() - 3600000 * 68).toISOString(),
        note: 'Customer confirmed on WhatsApp',
      },
      {
        status: 'shipped',
        changedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        note: 'Handed over to Steadfast Courier',
      },
      {
        status: 'delivered',
        changedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        note: 'Delivered to customer doorstep',
      },
    ],
    auditTrail: [
      {
        action: 'COD_COLLECTED',
        performedBy: 'Steadfast Courier Agent',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        details: 'Full COD collection verified (৳1120).',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

function loadStoredOrders(): AdminOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return INITIAL_DEMO_ORDERS;
}

function persistOrders(orders: AdminOrder[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export const orderService = {
  async getOrders(filters?: OrderFilterParams): Promise<AdminOrder[]> {
    const res = await this.getOrdersPaginated(filters);
    return res.orders;
  },

  async getOrdersPaginated(filters?: OrderFilterParams): Promise<{ orders: AdminOrder[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.paymentStatus && filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
      if (filters?.paymentMethod && filters.paymentMethod !== 'all') params.append('paymentMethod', filters.paymentMethod);
      if (filters?.deliveryArea && filters.deliveryArea !== 'all') params.append('deliveryArea', filters.deliveryArea);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await apiClient.get<AdminOrder[]>(`/orders${queryStr}`);
      if (res.success && Array.isArray(res.data)) {
        const total = (res.meta?.total as number) ?? res.data.length;
        persistOrders(res.data);
        return { orders: res.data, total };
      }
    } catch {
      // fallback
    }

    // Local fallback filtering
    let list = loadStoredOrders();
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((o) => o.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.mobileNumber.includes(q)
      );
    }
    return { orders: list, total: list.length };
  },

  async getOrderById(id: string): Promise<AdminOrder | null> {
    try {
      const res = await apiClient.get<AdminOrder>(`/orders/${id}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // fallback
    }
    const orders = loadStoredOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(payload: {
    customer: CustomerInfo;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    totalAmount: number;
    deliveryMethod: DeliveryMethodId;
    paymentMethod: PaymentMethodId;
    adminNotes?: string;
  }): Promise<AdminOrder> {
    try {
      const res = await apiClient.post<AdminOrder>('/orders', payload);
      if (res.success && res.data) {
        const orders = loadStoredOrders();
        orders.unshift(res.data);
        persistOrders(orders);
        return res.data;
      }
    } catch (err) {
      loggerService.warn('API order creation error, storing locally', 'OrderService');
    }

    // Local fallback order generation
    const fallbackOrder: AdminOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `GV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: payload.customer,
      items: payload.items,
      subtotal: payload.subtotal,
      deliveryCharge: payload.deliveryCharge,
      totalAmount: payload.totalAmount,
      deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod,
      paymentStatus: 'unpaid',
      status: 'pending',
      codExpectedAmount: payload.paymentMethod === 'cash-on-delivery' ? payload.totalAmount : 0,
      codCollectedAmount: 0,
      codOutstandingBalance: payload.paymentMethod === 'cash-on-delivery' ? payload.totalAmount : 0,
      codStatus: payload.paymentMethod === 'cash-on-delivery' ? 'awaiting_collection' : undefined,
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date().toISOString(),
          note: 'Order placed via checkout',
        },
      ],
      adminNotes: payload.adminNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders = loadStoredOrders();
    orders.unshift(fallbackOrder);
    persistOrders(orders);
    return fallbackOrder;
  },

  async updateOrderStatus(
    id: string,
    newStatus: OrderStatus,
    note?: string
  ): Promise<{ success: boolean; order?: AdminOrder; error?: string }> {
    try {
      const res = await apiClient.patch<AdminOrder>(`/orders/${id}/status`, {
        status: newStatus,
        note,
      });
      if (res.success && res.data) {
        const orders = loadStoredOrders();
        const idx = orders.findIndex((o) => o.id === id || o.orderNumber === id);
        if (idx !== -1) {
          orders[idx] = res.data;
          persistOrders(orders);
        }
        return { success: true, order: res.data };
      }
      return { success: false, error: res.error || 'Failed to update status' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async updateOrderPaymentStatus(
    id: string,
    paymentStatus: PaymentStatus
  ): Promise<{ success: boolean; order?: AdminOrder; error?: string }> {
    try {
      const res = await apiClient.patch<AdminOrder>(`/orders/${id}/payment`, {
        paymentStatus,
      });
      if (res.success && res.data) {
        return { success: true, order: res.data };
      }
      return { success: false, error: res.error || 'Failed to update payment status' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async updateDelivery(
    id: string,
    deliveryData: {
      deliveryProvider?: string;
      trackingNumber?: string;
      dispatchDate?: string;
      expectedDeliveryDate?: string;
      deliveryNotes?: string;
    }
  ): Promise<{ success: boolean; order?: AdminOrder; error?: string }> {
    try {
      const res = await apiClient.patch<AdminOrder>(`/orders/${id}/delivery`, deliveryData);
      if (res.success && res.data) {
        return { success: true, order: res.data };
      }
      return { success: false, error: res.error || 'Failed to update delivery info' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async recordCodCollection(
    id: string,
    codData: {
      collectedAmount: number;
      collectedByStaff: string;
      note?: string;
    }
  ): Promise<{ success: boolean; order?: AdminOrder; error?: string }> {
    try {
      const res = await apiClient.patch<AdminOrder>(`/orders/${id}/cod-reconcile`, codData);
      if (res.success && res.data) {
        return { success: true, order: res.data };
      }
      return { success: false, error: res.error || 'Failed to record COD collection' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async processReturn(
    id: string,
    returnData: {
      action: 'request' | 'approve' | 'reject';
      reason?: string;
      returnedQuantities?: Record<string, number>;
      restoreToStock?: boolean;
    }
  ): Promise<{ success: boolean; order?: AdminOrder; error?: string }> {
    try {
      const res = await apiClient.patch<AdminOrder>(`/orders/${id}/return`, returnData);
      if (res.success && res.data) {
        return { success: true, order: res.data };
      }
      return { success: false, error: res.error || 'Failed to process return' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async recordRefund(
    id: string,
    refundData: {
      amount: number;
      reason: string;
    }
  ): Promise<{ success: boolean; order?: AdminOrder; error?: string }> {
    try {
      const res = await apiClient.patch<AdminOrder>(`/orders/${id}/refund`, refundData);
      if (res.success && res.data) {
        return { success: true, order: res.data };
      }
      return { success: false, error: res.error || 'Failed to record refund' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async updateOrderNotes(id: string, notes: string): Promise<AdminOrder | null> {
    const orders = loadStoredOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      adminNotes: notes,
      updatedAt: new Date().toISOString(),
    };
    persistOrders(orders);
    return orders[index];
  },

  async getCustomers(): Promise<AdminCustomer[]> {
    const orders = loadStoredOrders();
    const customerMap = new Map<string, AdminCustomer>();

    orders.forEach((ord) => {
      const key = ord.customer.mobileNumber || ord.customer.fullName;
      const existing = customerMap.get(key);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += ord.totalAmount;
        if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = ord.createdAt;
        }
      } else {
        customerMap.set(key, {
          id: `cust-${customerMap.size + 1}`,
          fullName: ord.customer.fullName,
          mobileNumber: ord.customer.mobileNumber,
          email: ord.customer.email,
          district: ord.customer.district || 'Dhaka',
          division: ord.customer.division || 'Dhaka',
          totalOrders: 1,
          totalSpent: ord.totalAmount,
          firstOrderDate: ord.createdAt,
          lastOrderDate: ord.createdAt,
        });
      }
    });

    return Array.from(customerMap.values());
  },
};
