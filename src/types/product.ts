/**
 * @file product.ts
 * @description Centralized domain models for Products, Categories, Subcategories, and Filtering.
 */

export type ProductCategoryType = 'plant' | 'seed' | 'tool' | 'care';
export type IndoorOutdoorType = 'indoor' | 'outdoor' | 'both';
export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
export type CategoryIconType = 'tree' | 'flower' | 'potted' | 'leaf' | 'tool' | 'seed';

export interface Subcategory {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  itemCount: number;
  iconName?: CategoryIconType;
}

export interface Category {
  id: string;
  slug: string;
  type: ProductCategoryType;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  imageUrl: string;
  itemCount: number;
  iconName?: CategoryIconType;
  subcategories?: Subcategory[];
}

export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  botanicalName?: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  subcategorySlug?: string;
  type: ProductCategoryType;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  images: string[];
  isFeatured: boolean;
  isBestseller?: boolean;
  inStock: boolean;
  stockQuantity: number;
  soldCount?: number;
  SKU: string;
  createdAt: string;
  tagsEn: string[];
  tagsBn: string[];
  indoorOutdoor?: IndoorOutdoorType;
  packetSizeEn?: string;
  packetSizeBn?: string;
  plantHeightEn?: string;
  plantHeightBn?: string;
  plantAgeEn?: string;
  plantAgeBn?: string;
  sunlightEn: string;
  sunlightBn: string;
  waterEn: string;
  waterBn: string;
  soilTypeEn?: string;
  soilTypeBn?: string;
  plantingSeasonEn?: string;
  plantingSeasonBn?: string;
  germinationInfoEn?: string;
  germinationInfoBn?: string;
  shortDescEn: string;
  shortDescBn: string;
  fullDescEn: string;
  fullDescBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  careInstructionsEn?: string[];
  careInstructionsBn?: string[];
}

export interface ProductFilterState {
  type?: ProductCategoryType;
  categorySlug?: string;
  categorySlugs?: string[];
  subcategorySlug?: string;
  subcategorySlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  indoorOutdoor?: IndoorOutdoorType;
  sunlight?: string;
  searchQuery?: string;
  sortBy: SortOption;
}
