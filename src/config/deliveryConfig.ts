/**
 * @file deliveryConfig.ts
 * @description Centralized delivery rate and location configuration.
 */

import { DeliveryMethodId } from '../types/cart';

export interface DeliveryOption {
  id: DeliveryMethodId;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  rate: number;
  estimatedDaysEn: string;
  estimatedDaysBn: string;
}

export const DELIVERY_CONFIG = {
  options: [
    {
      id: 'home-delivery',
      nameEn: 'Standard Home Delivery',
      nameBn: 'হোম ডেলিভারি',
      descEn: 'Gentle, plant-safe delivery right to your door',
      descBn: 'গাছের সুরক্ষামূলক প্যাকেজিং সহ হোম ডেলিভারি',
      rate: 70, // Demo flat rate for standard delivery
      estimatedDaysEn: '2 - 3 Days',
      estimatedDaysBn: '২ - ৩ কার্যদিবস',
    },
    {
      id: 'local-pickup',
      nameEn: 'Nursery Pickup (Dhaka Hub)',
      nameBn: 'নার্সারি থেকে পিকআপ',
      descEn: 'Pick up directly from our plant studio in Dhaka',
      descBn: 'আমাদের ঢাকা স্টুডিও থেকে সরাসরি সংগ্রহ করুন',
      rate: 0,
      estimatedDaysEn: 'Same Day Available',
      estimatedDaysBn: 'একই দিনে সংগ্রহযোগ্য',
    },
  ] as DeliveryOption[],
  freeDeliveryThreshold: 1500,
} as const;
