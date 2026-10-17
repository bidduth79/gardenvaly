/**
 * @file orderCalculations.ts
 * @description Centralized calculations for cart subtotal, delivery charges, and final estimates.
 */

import { CartItem } from '../types/cart';

export interface CalculatedOrderTotals {
  subtotal: number;
  deliveryCharge: number;
  finalEstimatedTotal: number;
  totalQuantity: number;
}

/**
 * Computes strictly numeric totals from cart line items and configured delivery charge.
 * Note: Future backend orders will recalculate these securely on the server.
 */
export function calculateOrderTotals(
  items: CartItem[],
  deliveryCharge: number = 0
): CalculatedOrderTotals {
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = Number(item.product.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    return acc + itemPrice * itemQty;
  }, 0);

  const totalQuantity = items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const cleanDeliveryCharge = Math.max(0, Number(deliveryCharge) || 0);
  const finalEstimatedTotal = subtotal + cleanDeliveryCharge;

  return {
    subtotal,
    deliveryCharge: cleanDeliveryCharge,
    finalEstimatedTotal,
    totalQuantity,
  };
}
