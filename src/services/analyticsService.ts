/**
 * @file analyticsService.ts
 * @description Production-ready Google Analytics 4 (GA4) integration with strict privacy controls,
 * e-commerce lifecycle tracking, and zero personal information (PII) leakage.
 */

import { Product } from '../types/product';
import { loggerService } from './loggerService';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

class AnalyticsService {
  private isInitialized = false;
  private measurementId: string | null = null;
  private recordedTransactions = new Set<string>();

  constructor() {
    this.measurementId = this.resolveMeasurementId();
  }

  private resolveMeasurementId(): string | null {
    try {
      const viteId = import.meta.env.VITE_GA_MEASUREMENT_ID;
      if (viteId && /^G-[A-Z0-9]+$/i.test(viteId.trim())) {
        return viteId.trim();
      }
    } catch {
      // Safe fallback
    }
    return null;
  }

  /**
   * Initialize GA4 script tag dynamically if a valid Measurement ID is configured.
   * If not configured, tracking remains disabled with no external network requests.
   */
  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    if (!this.measurementId) {
      loggerService.info(
        'GA4 tracking disabled: No valid VITE_GA_MEASUREMENT_ID configured in environment',
        'Analytics'
      );
      return;
    }

    try {
      // Setup dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        send_page_view: false, // Page views tracked manually on client SPA route changes
        anonymize_ip: true,
      });

      // Inject script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      this.isInitialized = true;
      loggerService.info(`GA4 initialized with ID ${this.measurementId}`, 'Analytics');
    } catch (err) {
      loggerService.error('Failed to initialize GA4', err, 'Analytics');
    }
  }

  /**
   * Track virtual page view on route transitions.
   */
  public trackPageView(path: string, title?: string): void {
    if (!this.isInitialized || !window.gtag || !this.measurementId) return;

    try {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href,
      });
    } catch (err) {
      loggerService.error('Error tracking page view', err, 'Analytics');
    }
  }

  /**
   * Track product view detail event (view_item).
   */
  public trackViewItem(product: Product, language: 'bn' | 'en' = 'en'): void {
    if (!this.isInitialized || !window.gtag) return;

    try {
      window.gtag('event', 'view_item', {
        currency: 'BDT',
        value: product.price,
        items: [
          {
            item_id: product.SKU || product.id,
            item_name: language === 'bn' ? product.nameBn : product.nameEn,
            item_category: product.category,
            price: product.price,
            quantity: 1,
          },
        ],
      });
    } catch (err) {
      loggerService.error('Error tracking view_item', err, 'Analytics');
    }
  }

  /**
   * Track item addition to cart (add_to_cart).
   */
  public trackAddToCart(product: Product, quantity = 1, language: 'bn' | 'en' = 'en'): void {
    if (!this.isInitialized || !window.gtag) return;

    try {
      window.gtag('event', 'add_to_cart', {
        currency: 'BDT',
        value: product.price * quantity,
        items: [
          {
            item_id: product.SKU || product.id,
            item_name: language === 'bn' ? product.nameBn : product.nameEn,
            item_category: product.category,
            price: product.price,
            quantity,
          },
        ],
      });
    } catch (err) {
      loggerService.error('Error tracking add_to_cart', err, 'Analytics');
    }
  }

  /**
   * Track checkout initiation (begin_checkout).
   */
  public trackBeginCheckout(items: { product: Product; quantity: number }[], totalAmount: number): void {
    if (!this.isInitialized || !window.gtag) return;

    try {
      window.gtag('event', 'begin_checkout', {
        currency: 'BDT',
        value: totalAmount,
        items: items.map(({ product, quantity }) => ({
          item_id: product.SKU || product.id,
          item_name: product.nameEn,
          item_category: product.category,
          price: product.price,
          quantity,
        })),
      });
    } catch (err) {
      loggerService.error('Error tracking begin_checkout', err, 'Analytics');
    }
  }

  /**
   * Track completed purchase (purchase).
   * Strict protection: only orderNumber and sanitized line items are passed.
   * Customer phone, full name, address, or credentials are NEVER sent to analytics.
   */
  public trackPurchase(
    orderNumber: string,
    totalAmount: number,
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[]
  ): void {
    if (!this.isInitialized || !window.gtag) return;

    // Deduplication check
    if (this.recordedTransactions.has(orderNumber)) {
      return;
    }
    this.recordedTransactions.add(orderNumber);

    try {
      window.gtag('event', 'purchase', {
        transaction_id: orderNumber,
        value: totalAmount,
        currency: 'BDT',
        items: items.map((i) => ({
          item_id: i.productId,
          item_name: i.productName,
          price: i.unitPrice,
          quantity: i.quantity,
        })),
      });
    } catch (err) {
      loggerService.error('Error tracking purchase', err, 'Analytics');
    }
  }

  public isTrackingActive(): boolean {
    return this.isInitialized;
  }

  public getMeasurementId(): string | null {
    return this.measurementId;
  }
}

export const analyticsService = new AnalyticsService();
