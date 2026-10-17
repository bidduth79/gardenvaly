/**
 * @file paymentConfig.ts
 * @description Centralized payment method configurations and policies with bKash, Nagad, COD & WhatsApp.
 */

import { PaymentMethodId } from '../types/cart';

export interface PaymentOption {
  id: PaymentMethodId;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
}

export const PAYMENT_CONFIG = {
  options: [
    {
      id: 'cash-on-delivery',
      nameEn: 'Cash on Delivery (COD)',
      nameBn: 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে মূল্য পরিশোধ)',
      descEn: 'Pay cash directly to the delivery hero after verifying your plants and seeds.',
      descBn: 'গাছপালা বা বীজ হাতে পেয়ে যাচাই করে ডেলিভারি প্রতিনিধির কাছে মূল্য পরিশোধ করুন।',
    },
    {
      id: 'bkash',
      nameEn: 'bKash Mobile Banking',
      nameBn: 'বিকাশ পেমেন্ট (Send Money / Payment)',
      descEn: 'Pay via bKash personal/merchant number and provide Transaction ID.',
      descBn: 'বিকাশ অ্যাপ থেকে পেমেন্ট করে ট্রানজেকশন আইডি (TrxID) দিয়ে অর্ডার নিশ্চিত করুন।',
    },
    {
      id: 'nagad',
      nameEn: 'Nagad Mobile Banking',
      nameBn: 'নগদ পেমেন্ট (Send Money)',
      descEn: 'Pay via Nagad personal/merchant number and provide Transaction ID.',
      descBn: 'নগদ অ্যাপ বা ইউএসএসডি কোড থেকে সেন্ড মানি করে TrxID দিন।',
    },
    {
      id: 'whatsapp-order',
      nameEn: 'Order via WhatsApp Chat',
      nameBn: 'হোয়াটসঅ্যাপে সরাসরি অর্ডার',
      descEn: 'Send your cart details directly to Hasna Hena on WhatsApp for customized guidance.',
      descBn: 'হাসনাহেনার সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলে চারা নির্বাচন ও অর্ডার নিশ্চিত করুন।',
    },
  ] as PaymentOption[],
} as const;
