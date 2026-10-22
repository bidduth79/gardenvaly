/**
 * @file guideService.ts
 * @description Manages Gardening Care Guides (বাগান পরিচর্যা নির্দেশিকা) with persistent storage,
 * broken-image auto-healing, and real-time synchronization between Admin Panel and Storefront.
 */

import { GardenTip } from '../types';
import { MOCK_TIPS } from '../data/mockTips';
import { loggerService } from './loggerService';

const GUIDES_STORAGE_KEY = 'gardenvaly_gardening_guides';
export const GUIDES_UPDATED_EVENT = 'gardenvaly-guides-updated';

class GuideService {
  private notifyListeners(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(GUIDES_UPDATED_EVENT));
    }
  }

  private normalizeGuides(list: GardenTip[]): GardenTip[] {
    const defaultMap = new Map(MOCK_TIPS.map((t) => [t.id, t]));
    return list.map((item) => {
      const def = defaultMap.get(item.id);
      // Fix old broken Unsplash URL if cached
      const fixedImage =
        !item.imageUrl || item.imageUrl.includes('photo-1592417817098-8f3d6910985c')
          ? def?.imageUrl || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85'
          : item.imageUrl;

      return {
        ...def,
        ...item,
        imageUrl: fixedImage,
        contentBn: item.contentBn || def?.contentBn || item.excerptBn,
        contentEn: item.contentEn || def?.contentEn || item.excerptEn,
        stepsBn: item.stepsBn && item.stepsBn.length > 0 ? item.stepsBn : def?.stepsBn || [],
        stepsEn: item.stepsEn && item.stepsEn.length > 0 ? item.stepsEn : def?.stepsEn || [],
        proTipBn: item.proTipBn || def?.proTipBn || '',
        proTipEn: item.proTipEn || def?.proTipEn || '',
      };
    });
  }

  public getGuides(): GardenTip[] {
    if (typeof window === 'undefined') return [...MOCK_TIPS];
    try {
      const stored = localStorage.getItem(GUIDES_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(MOCK_TIPS));
        return [...MOCK_TIPS];
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return this.normalizeGuides(parsed);
      }
      return [...MOCK_TIPS];
    } catch (err) {
      loggerService.warn('Failed to parse gardening guides from localStorage', 'GuideService');
      return [...MOCK_TIPS];
    }
  }

  public getGuideById(id: string): GardenTip | undefined {
    return this.getGuides().find((g) => g.id === id);
  }

  public saveGuides(guides: GardenTip[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(guides));
      this.notifyListeners();
    } catch (err) {
      loggerService.error('Failed to save gardening guides to storage', err, 'GuideService');
    }
  }

  public addGuide(guideData: Omit<GardenTip, 'id'>): GardenTip {
    const list = this.getGuides();
    const newGuide: GardenTip = {
      ...guideData,
      id: `guide-${Date.now()}`,
    };
    const updated = [newGuide, ...list];
    this.saveGuides(updated);
    return newGuide;
  }

  public updateGuide(id: string, updates: Partial<GardenTip>): GardenTip | null {
    const list = this.getGuides();
    const idx = list.findIndex((g) => g.id === id);
    if (idx === -1) return null;

    const updatedItem: GardenTip = { ...list[idx], ...updates };
    list[idx] = updatedItem;
    this.saveGuides(list);
    return updatedItem;
  }

  public deleteGuide(id: string): boolean {
    const list = this.getGuides();
    const filtered = list.filter((g) => g.id !== id);
    if (filtered.length === list.length) return false;
    this.saveGuides(filtered);
    return true;
  }

  public reorderGuides(newGuides: GardenTip[]): void {
    this.saveGuides(newGuides);
  }

  public resetToDefault(): GardenTip[] {
    if (typeof window === 'undefined') return [...MOCK_TIPS];
    try {
      localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(MOCK_TIPS));
      this.notifyListeners();
      return [...MOCK_TIPS];
    } catch (err) {
      loggerService.error('Failed to reset gardening guides', err, 'GuideService');
      return [...MOCK_TIPS];
    }
  }
}

export const guideService = new GuideService();
