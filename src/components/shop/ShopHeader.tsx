/**
 * @file ShopHeader.tsx
 * @description Header toolbar for product listings with live search, sort dropdown, and result counter.
 */

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

interface ShopHeaderProps {
  title: string;
  totalResults: number;
  searchQuery: string;
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onOpenMobileFilters: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  totalResults,
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
  onOpenMobileFilters,
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-4 mb-6">
      {/* Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {language === 'bn'
            ? `${formatNumeral(totalResults, language)} টি পণ্য পাওয়া গেছে`
            : `${formatNumeral(totalResults, language)} botanical items found`}
        </p>
      </div>

      {/* Search Bar & Sorting Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        {/* Sort Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <button
            onClick={onOpenMobileFilters}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#174D35]" />
            <span>{t('filters')}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-stone-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent font-medium text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="newest">{t('sortNewest')}</option>
              <option value="price-asc">{t('sortPriceLow')}</option>
              <option value="price-desc">{t('sortPriceHigh')}</option>
              <option value="name-asc">{t('sortNameAsc')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
