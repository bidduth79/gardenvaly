/**
 * @file SearchDrawer.tsx
 * @description Interactive search drawer for live plant and seed catalogue lookup.
 */

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const data = await productService.searchProducts(query);
      setResults(data);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Lock body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catalogue Search Drawer"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#174D35]" />
            <h3 className="font-semibold text-stone-900 text-base">{t('searchPlants')}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#174D35]"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-stone-100 bg-[#F7F5EC]/50">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 bg-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 absolute right-1.5 top-1.5 rounded-lg"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <p className="text-sm text-stone-500 text-center py-10">
              {language === 'bn' ? 'গাছ বা বীজের নাম লিখে খুঁজুন...' : 'Type plant or seed name to search...'}
            </p>
          ) : isSearching ? (
            <p className="text-sm text-stone-500 text-center py-10">
              {language === 'bn' ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching catalogue...'}
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-stone-500 text-center py-10">
              {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি।' : 'No botanical items found.'}
            </p>
          ) : (
            results.map((product) => {
              const name = language === 'bn' ? product.nameBn : product.nameEn;
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-[#174D35]/30 hover:bg-[#F7F5EC]/30 transition-all cursor-pointer"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getSafeImageUrl(product.imageUrl, { type: product.type, categorySlug: product.categorySlug })}
                      alt={name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => handleImageError(e, getProductFallbackImage(product))}
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">{name}</h4>
                      <p className="text-xs font-semibold text-[#174D35] mt-0.5">
                        {formatPrice(product.price, language)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
