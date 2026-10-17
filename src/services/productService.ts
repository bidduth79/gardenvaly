/**
 * @file productService.ts
 * @description Decoupled data service for querying, filtering, and retrieving products.
 */

import { Product, Category, ProductCategoryType, ProductFilterState } from '../types/product';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_CATEGORIES } from '../data/mockCategories';
import { loggerService } from './loggerService';
import { sanitizeSearchQuery } from '../utils/validation';
import { apiClient } from './apiClient';

export const productService = {
  /**
   * Fetches all available products from REST API with local fallback.
   */
  async getProducts(): Promise<Product[]> {
    try {
      const res = await apiClient.get<Product[]>('/products');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return [...MOCK_PRODUCTS];
    } catch (err) {
      loggerService.error('Error fetching products from API, using fallback', err, 'ProductService');
      return [...MOCK_PRODUCTS];
    }
  },

  /**
   * Fetches a single product by its slug.
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
      return found ? { ...found } : null;
    } catch (err) {
      loggerService.error(`Error fetching product by slug ${slug}`, err, 'ProductService');
      return null;
    }
  },

  /**
   * Fetches categories, optionally filtered by type.
   */
  async getCategories(type?: ProductCategoryType): Promise<Category[]> {
    try {
      const res = await apiClient.get<Category[]>('/categories');
      const cats = res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : MOCK_CATEGORIES;
      if (!type) return [...cats];
      return cats.filter((cat) => cat.type === type);
    } catch (err) {
      loggerService.error('Error fetching categories from API, using fallback', err, 'ProductService');
      if (!type) return [...MOCK_CATEGORIES];
      return MOCK_CATEGORIES.filter((cat) => cat.type === type);
    }
  },

  /**
   * Fetches a single category by its slug.
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const found = MOCK_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
      return found ? { ...found } : null;
    } catch (err) {
      loggerService.error(`Error fetching category by slug ${slug}`, err, 'ProductService');
      return null;
    }
  },

  /**
   * Fetches products belonging to a specific category slug.
   */
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
      return MOCK_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
    } catch (err) {
      loggerService.error(`Error fetching products for category ${categorySlug}`, err, 'ProductService');
      return [];
    }
  },

  /**
   * Searches products by keyword across names, tags, and descriptions.
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const sanitized = sanitizeSearchQuery(query).toLowerCase();
      if (!sanitized) return [];

      return MOCK_PRODUCTS.filter((p) => {
        return (
          p.nameEn.toLowerCase().includes(sanitized) ||
          p.nameBn.includes(sanitized) ||
          p.shortDescEn.toLowerCase().includes(sanitized) ||
          p.shortDescBn.includes(sanitized) ||
          (p.botanicalName && p.botanicalName.toLowerCase().includes(sanitized)) ||
          p.tagsEn.some((t) => t.toLowerCase().includes(sanitized)) ||
          p.tagsBn.some((t) => t.includes(sanitized))
        );
      });
    } catch (err) {
      loggerService.error('Error searching products', err, 'ProductService');
      return [];
    }
  },

  /**
   * Filters and sorts products based on user criteria.
   */
  async filterAndSortProducts(filters: ProductFilterState): Promise<Product[]> {
    try {
      let list = [...MOCK_PRODUCTS];

      if (filters.type) {
        list = list.filter((p) => p.type === filters.type);
      }
      if (filters.categorySlug) {
        list = list.filter((p) => p.categorySlug === filters.categorySlug);
      }
      if (typeof filters.minPrice === 'number') {
        list = list.filter((p) => p.price >= (filters.minPrice as number));
      }
      if (typeof filters.maxPrice === 'number') {
        list = list.filter((p) => p.price <= (filters.maxPrice as number));
      }
      if (filters.inStockOnly) {
        list = list.filter((p) => p.inStock && p.stockQuantity > 0);
      }
      if (filters.indoorOutdoor) {
        list = list.filter(
          (p) => p.indoorOutdoor === filters.indoorOutdoor || p.indoorOutdoor === 'both'
        );
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        list = list.filter(
          (p) =>
            p.nameEn.toLowerCase().includes(q) ||
            p.nameBn.includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          list.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'featured':
        default:
          list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }

      return list;
    } catch (err) {
      loggerService.error('Error filtering/sorting products', err, 'ProductService');
      return [];
    }
  },
};
