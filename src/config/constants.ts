/**
 * @file constants.ts
 * @description Centralized application constants and brand identity configurations.
 */

import { NavLinkItem } from '../types';

export const BRAND_CONFIG = {
  name: 'Gardenvaly',
  signature: 'by Hasna Hena',
  taglineEn: 'Grow Green, Live Beautiful',
  taglineBn: 'সবুজে সাজুক জীবন',
  phone: '+880 1700-000000',
  whatsapp: '+880 1700-000000',
  email: 'hello@gardenvaly.com',
  locationEn: 'Dhaka, Bangladesh',
  locationBn: 'ঢাকা, বাংলাদেশ',
} as const;

export const ANNOUNCEMENT_CONFIG = {
  textEn: 'Welcome to Gardenvaly — Bring Nature Home',
  textBn: 'গার্ডেনভ্যালিতে স্বাগতম — প্রকৃতিকে আনুন আপনার ঘরে',
} as const;

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'home', labelEn: 'Home', labelBn: 'হোম', href: '#home' },
  { id: 'plants', labelEn: 'Plants', labelBn: 'গাছপালা', href: '/plants' },
  { id: 'seeds', labelEn: 'Seeds', labelBn: 'বীজ', href: '/seeds' },
  { id: 'supplies', labelEn: 'Gardening Supplies', labelBn: 'বাগান সামগ্রী', href: '/supplies' },
  { id: 'track', labelEn: 'Track Order', labelBn: 'অর্ডার ট্র্যাকিং', href: '/track-order' },
  { id: 'guide', labelEn: 'Gardening Guide', labelBn: 'বাগান নির্দেশিকা', href: '#guide' },
  { id: 'contact', labelEn: 'Contact', labelBn: 'যোগাযোগ', href: '#contact' },
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
} as const;

export const CURRENCY = {
  symbolEn: '৳',
  symbolBn: '৳',
  code: 'BDT',
} as const;
