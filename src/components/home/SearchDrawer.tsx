/**
 * @file SearchDrawer.tsx
 * @description Interactive search drawer with Web Speech API voice search (Bengali/English),
 * popular search tags, and live plant/seed catalogue lookup.
 */

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Mic, MicOff, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const POPULAR_SEARCHES_BN = ['মনস্টেরা', 'হাসনাহেনা', 'গোলাপ', 'মানি প্ল্যান্ট', 'অর্গানিক বীজ', 'ভার্মিকম্পোস্ট'];
const POPULAR_SEARCHES_EN = ['Monstera', 'Hasna Hena', 'Rose', 'Money Plant', 'Organic Seeds', 'Vermicompost'];

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const isBn = language === 'bn';

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

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setQuery(transcript);
      }
    };

    recognition.start();
  };

  if (!isOpen) return null;

  const popularTags = isBn ? POPULAR_SEARCHES_BN : POPULAR_SEARCHES_EN;

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

        <div className="p-4 border-b border-stone-100 bg-[#F7F5EC]/50 space-y-2.5">
          <div className="relative flex items-center gap-1.5">
            <div className="relative flex-1">
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

            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-white text-stone-600 hover:text-[#174D35] border-stone-300 hover:border-[#174D35]'
              }`}
              title={isBn ? 'ভয়েস সার্চ (মুখে বলে খুঁজুন)' : 'Voice Search'}
              aria-label="Voice Search"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {isListening && (
            <p className="text-xs text-rose-600 font-semibold animate-pulse">
              {isBn ? '🎙️ শুনছি... গাছ বা বীজের নাম বলুন' : '🎙️ Listening... Speak plant or seed name'}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{isBn ? 'জনপ্রিয় অনুসন্ধান' : 'Popular Searches'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#174D35] text-stone-700 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 pt-4 text-center">
                {isBn
                  ? 'গাছ, বীজ বা বাগান সরঞ্জামের নাম লিখে অথবা ভয়েস বাটনে ট্যাপ করে খুঁজুন।'
                  : 'Type or use voice search to find plants, seeds, and gardening supplies.'}
              </p>
            </div>
          ) : isSearching ? (
            <p className="text-sm text-stone-500 text-center py-10">
              {isBn ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching catalogue...'}
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-stone-500 text-center py-10">
              {isBn ? 'কোনো ফলাফল পাওয়া যায়নি।' : 'No botanical items found.'}
            </p>
          ) : (
            results.map((product) => {
              const name = isBn ? product.nameBn : product.nameEn;
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
