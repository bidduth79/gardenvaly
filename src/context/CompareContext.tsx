/**
 * @file CompareContext.tsx
 * @description State management for comparing up to 3 plants/seeds side-by-side.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/product';

interface CompareContextType {
  compareItems: Product[];
  isInCompare: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const isInCompare = (productId: string): boolean => {
    return compareItems.some((p) => p.id === productId);
  };

  const toggleCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
    setIsCompareModalOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        isInCompare,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
