/**
 * @file index.ts
 * @description Core global types for Gardenvaly by Hasna Hena.
 */

export type Language = 'en' | 'bn';

export interface NavLinkItem {
  id: string;
  labelEn: string;
  labelBn: string;
  href: string;
  badge?: string;
}

export interface GardenTip {
  id: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  readTimeEn: string;
  readTimeBn: string;
  categoryEn: string;
  categoryBn: string;
  imageUrl: string;
  publishedDate: string;
}

export interface ReviewItem {
  id: string;
  authorEn: string;
  authorBn: string;
  locationEn: string;
  locationBn: string;
  commentEn: string;
  commentBn: string;
  rating: number;
  dateEn: string;
  dateBn: string;
  avatarUrl: string;
}
