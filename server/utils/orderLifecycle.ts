/**
 * @file orderLifecycle.ts
 * @description Pure business rules and transition matrix for the 10-stage order lifecycle.
 */

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

export interface StatusMeta {
  key: OrderStatus;
  labelEn: string;
  labelBn: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ORDER_STATUS_REGISTRY: Record<OrderStatus, StatusMeta> = {
  pending: {
    key: 'pending',
    labelEn: 'Pending',
    labelBn: 'নতুন অর্ডার',
    color: '#D97706',
    bgColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  confirmed: {
    key: 'confirmed',
    labelEn: 'Confirmed',
    labelBn: 'অর্ডার নিশ্চিত',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  processing: {
    key: 'processing',
    labelEn: 'Processing',
    labelBn: 'অর্ডার প্রস্তুত হচ্ছে',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    borderColor: '#C4B5FD',
  },
  packed: {
    key: 'packed',
    labelEn: 'Packed',
    labelBn: 'পণ্য প্যাক করা হয়েছে',
    color: '#0D9488',
    bgColor: '#CCFBF1',
    borderColor: '#5EEAD4',
  },
  shipped: {
    key: 'shipped',
    labelEn: 'Shipped',
    labelBn: 'ডেলিভারির জন্য পাঠানো হয়েছে',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    borderColor: '#7DD3FC',
  },
  delivered: {
    key: 'delivered',
    labelEn: 'Delivered',
    labelBn: 'পণ্য পৌঁছে দেওয়া হয়েছে',
    color: '#15803D',
    bgColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  cancelled: {
    key: 'cancelled',
    labelEn: 'Cancelled',
    labelBn: 'অর্ডার বাতিল',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  return_requested: {
    key: 'return_requested',
    labelEn: 'Return Requested',
    labelBn: 'রিটার্নের অনুরোধ',
    color: '#C026D3',
    bgColor: '#FAE8FF',
    borderColor: '#F0ABFC',
  },
  returned: {
    key: 'returned',
    labelEn: 'Returned',
    labelBn: 'পণ্য ফেরত এসেছে',
    color: '#4B5563',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  refunded: {
    key: 'refunded',
    labelEn: 'Refunded',
    labelBn: 'টাকা ফেরত দেওয়া হয়েছে',
    color: '#059669',
    bgColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },
};

/**
 * Valid Status Transition Matrix.
 * Restricts jumping between invalid states (e.g. Cancelled directly to Delivered).
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'], // returned on delivery failure / RTO
  delivered: ['return_requested'],
  return_requested: ['returned', 'delivered'], // returned if accepted, back to delivered if rejected
  returned: ['refunded'],
  cancelled: [], // Final state
  refunded: [], // Final state
};

/**
 * Validates if an order can transition from currentStatus to targetStatus.
 * Superadmin or authorized correction can override non-terminal states if explicitly permitted.
 */
export function isValidTransition(
  current: OrderStatus,
  target: OrderStatus,
  userRole?: string
): { allowed: boolean; reason?: string } {
  if (current === target) {
    return { allowed: false, reason: 'Order is already in this status.' };
  }

  // Superadmin emergency correction override (except terminal refunded state)
  if (userRole === 'superadmin' && current !== 'refunded') {
    return { allowed: true };
  }

  const allowedNext = ALLOWED_STATUS_TRANSITIONS[current] || [];
  if (!allowedNext.includes(target)) {
    const validNames = allowedNext.map((s) => ORDER_STATUS_REGISTRY[s]?.labelEn).join(', ') || 'None (Terminal state)';
    return {
      allowed: false,
      reason: `Cannot transition order directly from "${ORDER_STATUS_REGISTRY[current]?.labelEn}" to "${ORDER_STATUS_REGISTRY[target]?.labelEn}". Allowed next states: ${validNames}.`,
    };
  }

  return { allowed: true };
}
