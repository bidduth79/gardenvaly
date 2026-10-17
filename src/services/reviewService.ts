/**
 * @file reviewService.ts
 * @description Manages customer testimonials and reviews with persistent storage and real-time storefront synchronization.
 */

import { ReviewItem } from '../types';
import { MOCK_REVIEWS } from '../data/mockReviews';
import { loggerService } from './loggerService';

const REVIEWS_STORAGE_KEY = 'gardenvaly_customer_reviews';
export const REVIEWS_UPDATED_EVENT = 'gardenvaly-reviews-updated';

class ReviewService {
  private notifyListeners(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(REVIEWS_UPDATED_EVENT));
    }
  }

  public getReviews(): ReviewItem[] {
    if (typeof window === 'undefined') return [...MOCK_REVIEWS];
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(MOCK_REVIEWS));
        return [...MOCK_REVIEWS];
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [...MOCK_REVIEWS];
    } catch (err) {
      loggerService.warn('Failed to parse customer reviews from localStorage', 'ReviewService');
      return [...MOCK_REVIEWS];
    }
  }

  public getReviewById(id: string): ReviewItem | undefined {
    const list = this.getReviews();
    return list.find((r) => r.id === id);
  }

  public saveReviews(reviews: ReviewItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      this.notifyListeners();
    } catch (err) {
      loggerService.error('Failed to save reviews to storage', err, 'ReviewService');
    }
  }

  public addReview(reviewData: Omit<ReviewItem, 'id'>): ReviewItem {
    const list = this.getReviews();
    const newId = `rev-${Date.now()}`;
    const newReview: ReviewItem = {
      ...reviewData,
      id: newId,
    };
    const updated = [newReview, ...list];
    this.saveReviews(updated);
    return newReview;
  }

  public updateReview(id: string, updates: Partial<ReviewItem>): ReviewItem | null {
    const list = this.getReviews();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updatedItem = { ...list[index], ...updates };
    list[index] = updatedItem;
    this.saveReviews(list);
    return updatedItem;
  }

  public deleteReview(id: string): boolean {
    const list = this.getReviews();
    const filtered = list.filter((r) => r.id !== id);
    if (filtered.length === list.length) return false;
    this.saveReviews(filtered);
    return true;
  }

  public reorderReviews(newReviews: ReviewItem[]): void {
    this.saveReviews(newReviews);
  }

  public resetToDefault(): ReviewItem[] {
    if (typeof window === 'undefined') return [...MOCK_REVIEWS];
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(MOCK_REVIEWS));
      this.notifyListeners();
      return [...MOCK_REVIEWS];
    } catch (err) {
      loggerService.error('Failed to reset reviews', err, 'ReviewService');
      return [...MOCK_REVIEWS];
    }
  }
}

export const reviewService = new ReviewService();
