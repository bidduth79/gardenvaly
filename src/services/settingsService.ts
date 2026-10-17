/**
 * @file settingsService.ts
 * @description Centralized reactive store settings service.
 * Manages branding, contact numbers, bKash & Nagad accounts, and notifies
 * all components in real-time when settings are modified by the admin.
 */

import { StoreSettings } from '../types/admin';
import { apiClient } from './apiClient';
import { useState, useEffect } from 'react';

export const SETTINGS_STORAGE_KEY = 'gardenvaly_admin_settings';
export const SETTINGS_CHANGE_EVENT = 'gardenvaly_settings_updated';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeNameEn: 'Gardenvaly',
  storeNameBn: 'গার্ডেনভ্যালি',
  signatureEn: 'by Hasna Hena',
  signatureBn: 'হাসনা হেনা কর্তৃক পরিচালিত',
  taglineEn: 'Grow Green, Live Beautiful',
  taglineBn: 'সবুজে সাজুক জীবন',
  locationEn: 'Dhaka, Bangladesh',
  locationBn: 'ঢাকা, বাংলাদেশ',
  contactPhone: '+880 1712-345678',
  contactEmail: 'contact@gardenvaly.com',
  officialWhatsapp: '+880 1712-345678',
  bkashNumber: '01712-345678',
  bkashType: 'Personal',
  nagadNumber: '01712-345678',
  nagadType: 'Personal',
  paymentInstructionsBn: 'বিকাশ বা নগদ অ্যাপ থেকে ওপরের নম্বরে Send Money করুন এবং TrxID নিচে লিখুন।',
  paymentInstructionsEn: 'Send Money to the above number using bKash/Nagad and enter the TrxID below.',
  standardDeliveryFee: 60,
  freeDeliveryThreshold: 2000,
  enablePickup: true,
  maintenanceMode: false,
  demoModeNotice: true,
  courierProvider: 'steadfast',
  steadfastApiKey: '',
  steadfastSecretKey: '',
  autoCreateCourierParcel: false,
  smsProvider: 'disabled',
  smsApiKey: '',
  smsSenderId: 'Gardenvaly',
  sendSmsOnOrderPlaced: true,
  sendSmsOnOrderConfirmed: true,
  sendSmsOnOrderShipped: true,
  sendSmsOnOrderDelivered: true,
  bkashMerchantEnabled: false,
  bkashSandbox: true,
  sslcommerzEnabled: false,
  sslcommerzSandbox: true,
};

export const settingsService = {
  getSettings(): StoreSettings {
    if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      }
    } catch {
      // fallback
    }
    return DEFAULT_STORE_SETTINGS;
  },

  async saveSettings(newSettings: StoreSettings): Promise<StoreSettings> {
    const current = settingsService.getSettings();
    const merged = { ...DEFAULT_STORE_SETTINGS, ...current, ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: merged }));
      } catch (err) {
        console.error('Failed to write settings to localStorage', err);
      }
    }

    try {
      const res = await apiClient.put<StoreSettings>('/settings', merged);
      if (res.success && res.data) {
        const serverMerged = { ...merged, ...res.data };
        if (typeof window !== 'undefined') {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(serverMerged));
          window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: serverMerged }));
        }
        return serverMerged;
      }
    } catch (err) {
      console.warn('Network error saving settings to server, local copy retained', err);
    }

    return merged;
  },

  cleanPhoneNumber(phone: string): string {
    return (phone || '').replace(/[^0-9]/g, '');
  },

  getWhatsappUrl(phone: string, text?: string): string {
    const digits = settingsService.cleanPhoneNumber(phone);
    const num = digits.startsWith('88') ? digits : `88${digits}`;
    const query = text ? `?text=${encodeURIComponent(text)}` : '';
    return `https://wa.me/${num}${query}`;
  },
};

/**
 * React hook for reactive store settings that re-render whenever admin saves changes.
 */
export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(() => settingsService.getSettings());

  useEffect(() => {
    let isMounted = true;

    // 1. Initial server fetch
    async function fetchServerSettings() {
      try {
        const res = await apiClient.get<StoreSettings>('/settings');
        if (res.success && res.data && isMounted) {
          const localState = settingsService.getSettings();
          const merged = { ...DEFAULT_STORE_SETTINGS, ...localState, ...res.data };
          setSettings(merged);
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        }
      } catch {
        // use local
      }
    }
    fetchServerSettings();

    // 2. Custom event listener for instant local updates across components
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<StoreSettings>;
      if (customEvent.detail && isMounted) {
        setSettings(customEvent.detail);
      } else if (isMounted) {
        setSettings(settingsService.getSettings());
      }
    };

    // 3. Storage event listener for multi-tab updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue && isMounted) {
        try {
          setSettings({ ...DEFAULT_STORE_SETTINGS, ...JSON.parse(e.newValue) });
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener(SETTINGS_CHANGE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return {
    settings,
    saveSettings: settingsService.saveSettings,
  };
}
