/**
 * @file CartContext.tsx
 * @description Shopping cart state management with local persistence and confirmation hooks.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/product';
import { CartItem, CartState } from '../types/cart';
import { isValidQuantity } from '../utils/validation';
import { loggerService } from '../services/loggerService';

const CART_STORAGE_KEY = 'gardenvaly_cart_items_v1';

const loadSavedCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(
          item &&
          item.product &&
          typeof item.product.id === 'string' &&
          typeof item.product.price === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
        )
    );
  } catch (err) {
    loggerService.warn('Failed to load cart from localStorage, fallback to empty', 'CartContext');
    return [];
  }
};

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadSavedCart);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      loggerService.warn('Failed to persist cart items to localStorage', 'CartContext');
    }
  }, [items]);

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1): void => {
    if (!isValidQuantity(quantity)) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('gardenvaly:cart-add', {
          detail: { product, quantity },
        })
      );
    }
    loggerService.info(`Added to cart: ${product.nameEn}`, 'CartContext');
  };

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (!isValidQuantity(quantity)) return;
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (productId: string): void => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    loggerService.info(`Removed item ${productId} from cart`, 'CartContext');
  };

  const clearCart = (): void => {
    setItems([]);
    loggerService.info('Cart cleared completely', 'CartContext');
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items, totalQuantity, subtotal },
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
