/**
 * @file WishlistContext.tsx
 * @description Customer wishlist state management with localStorage persistence and API synchronization.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCustomerAuth } from './CustomerAuthContext';
import { customerService } from '../services/customerService';
import { loggerService } from '../services/loggerService';

const WISHLIST_STORAGE_KEY = 'gardenvaly_guest_wishlist';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { customer, isAuthenticated } = useCustomerAuth();

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // When customer logs in or profile changes, sync with remote wishlist
  useEffect(() => {
    if (isAuthenticated && customer?.wishlist && Array.isArray(customer.wishlist)) {
      setWishlistIds((prev) => {
        // Merge guest wishlist with customer's existing remote wishlist
        const merged = Array.from(new Set([...customer.wishlist!, ...prev]));
        try {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      });
    }
  }, [isAuthenticated, customer?.wishlist]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const isPresent = prev.includes(productId);
      const next = isPresent ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (!isPresent && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('gardenvaly:wishlist-add', {
            detail: { productId },
          })
        );
      }
      return next;
    });

    if (isAuthenticated) {
      customerService.toggleWishlist(productId).catch((err) => {
        loggerService.warn('Could not sync wishlist with server', 'WishlistContext');
      });
    }
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
