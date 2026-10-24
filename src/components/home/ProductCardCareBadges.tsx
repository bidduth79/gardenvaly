/**
 * @file ProductCardCareBadges.tsx
 * @description Compact botanical care badges for sunlight, water, and environment indicators.
 */

import React from 'react';
import { Sun, Droplet, Home } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCardCareBadgesProps {
  product: Product;
}

export const ProductCardCareBadges: React.FC<ProductCardCareBadgesProps> = ({ product }) => {
  const { language } = useLanguage();

  if (product.type !== 'plant') {
    return (
      <p className="mt-1 text-[10px] sm:text-[11px] text-stone-500 line-clamp-1">
        {language === 'bn' ? product.shortDescBn : product.shortDescEn}
      </p>
    );
  }

  const sunlight = language === 'bn' ? product.sunlightBn : product.sunlightEn;
  const water = language === 'bn' ? product.waterBn : product.waterEn;
  const isIndoor = product.indoorOutdoor === 'indoor' || product.tagsBn?.some((t) => t.includes('ইনডোর'));

  return (
    <div className="mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] whitespace-nowrap overflow-hidden w-full">
      {sunlight && (
        <span
          className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/35 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-700/40 min-w-0 flex-1 sm:flex-initial sm:shrink-0 sm:max-w-[102px] truncate transition-colors"
          title={sunlight}
        >
          <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 shrink-0 animate-sun-spin-slow" />
          <span className="truncate">{sunlight}</span>
        </span>
      )}
      {water && (
        <span
          className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/35 text-cyan-900 dark:text-cyan-200 border border-cyan-200/60 dark:border-cyan-700/40 min-w-0 flex-1 sm:flex-initial sm:shrink-0 sm:max-w-[102px] truncate transition-colors"
          title={water}
        >
          <Droplet className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-600 dark:text-cyan-400 shrink-0 animate-droplet-bob" />
          <span className="truncate">{water}</span>
        </span>
      )}
      {isIndoor && (
        <span
          className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/35 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-700/40 shrink-0 transition-colors"
          title={language === 'bn' ? 'ইনডোর উপযোগী' : 'Indoor Suitable'}
        >
          <Home className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 animate-indoor-pulse" />
          <span>{language === 'bn' ? 'ইনডোর' : 'Indoor'}</span>
        </span>
      )}
    </div>
  );
};
