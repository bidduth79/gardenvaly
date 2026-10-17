/**
 * @file whatsappService.ts
 * @description Generates formatted, URL-encoded WhatsApp messages for chat-based ordering using dynamic store settings.
 */

import { CartItem, CustomerInfo } from '../types/cart';
import { settingsService } from './settingsService';
import { calculateOrderTotals } from '../utils/orderCalculations';

export const whatsappService = {
  /**
   * Generates a wa.me URL with pre-filled readable order summary.
   */
  generateWhatsAppOrderUrl(
    items: CartItem[],
    customer: CustomerInfo,
    deliveryCharge: number,
    lang: 'en' | 'bn',
    overrideWhatsapp?: string
  ): string | null {
    const settings = settingsService.getSettings();
    const phoneSource = overrideWhatsapp || settings.officialWhatsapp || '8801712345678';
    const digits = phoneSource.replace(/\D/g, '');
    const fullNumber = digits.startsWith('88') ? digits : `88${digits}`;

    if (!fullNumber) return null;

    const totals = calculateOrderTotals(items, deliveryCharge);
    const isBn = lang === 'bn';
    const storeName = isBn ? (settings.storeNameBn || 'Gardenvaly') : (settings.storeNameEn || 'Gardenvaly');
    const signature = isBn ? (settings.signatureBn || 'বাই হাসনাহেনা') : (settings.signatureEn || 'by Hasna Hena');

    const header = isBn
      ? `🌿 *${storeName} - নতুন অর্ডার অনুরোধ (${signature})*`
      : `🌿 *${storeName} - New Order Request (${signature})*`;

    const itemList = items
      .map((item, idx) => {
        const name = isBn ? item.product.nameBn : item.product.nameEn;
        const linePrice = item.product.price * item.quantity;
        return `${idx + 1}. ${name} x ${item.quantity} = ৳${linePrice}`;
      })
      .join('\n');

    const fullAddress = [
      customer.addressDetail,
      customer.union,
      customer.upazila,
      customer.district,
      customer.division,
    ]
      .filter(Boolean)
      .join(', ');

    const customerDetails = isBn
      ? `👤 *গ্রাহক তথ্য:*\nনাম: ${customer.fullName}\nমোবাইল: ${customer.mobileNumber}\nঠিকানা: ${fullAddress}`
      : `👤 *Customer Details:*\nName: ${customer.fullName}\nPhone: ${customer.mobileNumber}\nAddress: ${fullAddress}`;

    const instructions = customer.deliveryInstructions
      ? `\n${isBn ? 'নির্দেশনা' : 'Notes'}: ${customer.deliveryInstructions}`
      : '';

    const summary = isBn
      ? `💰 *মোট হিসাব:*\nপণ্য মূল্য: ৳${totals.subtotal}\nডেলিভারি ফি: ৳${totals.deliveryCharge}\n*সর্বমোট:* ৳${totals.finalEstimatedTotal}`
      : `💰 *Summary:*\nSubtotal: ৳${totals.subtotal}\nDelivery: ৳${totals.deliveryCharge}\n*Estimated Total:* ৳${totals.finalEstimatedTotal}`;

    const footer = isBn
      ? `_অনুগ্রহ করে মেসেজটি পাঠিয়ে দিন, আমরা দ্রুত যোগাযোগ করব।_`
      : `_Please send this message, we will reply promptly._`;

    const fullMessage = `${header}\n\n${itemList}\n\n${summary}\n\n${customerDetails}${instructions}\n\n${footer}`;
    const encoded = encodeURIComponent(fullMessage);

    return `https://wa.me/${fullNumber}?text=${encoded}`;
  },
};
