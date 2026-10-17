/**
 * @file customerService.ts
 * @description Frontend API service for customer authentication, profile, orders, and wishlist.
 */

import { CustomerProfile, CustomerAuthResponse, CustomerRegisterPayload } from '../types/customer';
import { Order } from '../types/order';
import { loggerService } from './loggerService';

const CUSTOMER_TOKEN_KEY = 'gardenvaly_customer_token';
const CUSTOMER_PROFILE_KEY = 'gardenvaly_customer_profile';

class CustomerService {
  private baseUrl = '/api/customers';

  public getToken(): string | null {
    try {
      return localStorage.getItem(CUSTOMER_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public setSession(token: string, customer: CustomerProfile): void {
    try {
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
      localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(customer));
    } catch {
      // ignore
    }
  }

  public getSavedProfile(): CustomerProfile | null {
    try {
      const raw = localStorage.getItem(CUSTOMER_PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public clearSession(): void {
    try {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      localStorage.removeItem(CUSTOMER_PROFILE_KEY);
    } catch {
      // ignore
    }
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  public async login(identifier: string, password?: string, isDemo = false): Promise<CustomerAuthResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, isDemo }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'লগইন ব্যর্থ হয়েছে');
      }
      this.setSession(data.data.token, data.data.customer);
      return data.data;
    } catch (err) {
      loggerService.error('Customer login error', err, 'CustomerService');
      throw err;
    }
  }

  public async demoLogin(): Promise<CustomerAuthResponse> {
    return this.login('01712345678', undefined, true);
  }

  public async register(payload: CustomerRegisterPayload): Promise<CustomerAuthResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি');
      }
      this.setSession(data.data.token, data.data.customer);
      return data.data;
    } catch (err) {
      loggerService.error('Customer register error', err, 'CustomerService');
      throw err;
    }
  }

  public async getProfile(): Promise<CustomerProfile> {
    try {
      const res = await fetch(`${this.baseUrl}/me`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'প্রোফাইল লোড করা সম্ভব হয়নি');
      }
      localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      const fallback = this.getSavedProfile();
      if (fallback) return fallback;
      throw err;
    }
  }

  public async updateProfile(updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    try {
      const res = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'প্রোফাইল আপডেট করা সম্ভব হয়নি');
      }
      localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      loggerService.error('Customer updateProfile error', err, 'CustomerService');
      throw err;
    }
  }

  public async getMyOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${this.baseUrl}/orders`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'অর্ডার হিস্ট্রি পাওয়া যায়নি');
      }
      return data.data || [];
    } catch (err) {
      loggerService.error('Customer getMyOrders error', err, 'CustomerService');
      return [];
    }
  }

  public async toggleWishlist(productId: string): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/wishlist/toggle`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'উইশলিস্ট আপডেট হয়নি');
      }
      // Update saved profile wishlist
      const saved = this.getSavedProfile();
      if (saved) {
        saved.wishlist = data.data.wishlist;
        localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(saved));
      }
      return data.data.wishlist;
    } catch (err) {
      loggerService.warn('Customer toggleWishlist remote error, will handle locally', 'CustomerService');
      throw err;
    }
  }
}

export const customerService = new CustomerService();
