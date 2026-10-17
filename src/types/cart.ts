/**
 * @file cart.ts
 * @description Shopping cart and order-related type definitions.
 */

import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
}

export type DeliveryMethodId = 'home-delivery' | 'local-pickup';
export type PaymentMethodId = 'cash-on-delivery' | 'bkash' | 'nagad' | 'whatsapp-order';

export interface CustomerInfo {
  fullName: string;
  mobileNumber: string;
  email?: string;
  division: string;
  district: string;
  upazila: string;
  addressDetail: string;
  deliveryInstructions?: string;
}

export interface OrderPayload {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineSubtotal: number;
  }[];
  customer: CustomerInfo;
  deliveryMethod: DeliveryMethodId;
  deliveryCharge: number;
  paymentMethod: PaymentMethodId;
  createdAt: string;
}
