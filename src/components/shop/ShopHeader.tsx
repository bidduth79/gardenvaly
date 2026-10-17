/**
 * @file ShopHeader.tsx
 * @description Header toolbar for product listings with live search, sort dropdown, result counter, and active filter pills.
 */

import React, { useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Category, SortOption } from '../../types/product';
import { CategoryChipsBar } from './CategoryChipsBar';
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
  categories?: Category[];
  selectedCategorySlugs?: string[];
  onToggleCategorySlug?: (slug: string) => void;
  onRemoveCategorySlug?: (slug: string) => void;
  onClearCategorySlugs?: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  totalResults,
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
  onOpenMobileFilters,
  categories,
  selectedCategorySlugs,
  onToggleCategorySlug,
  onRemoveCategorySlug,
  onClearCategorySlugs,
}) => {
  const { language, t } = useLanguage();

  const activeFilterTags = useMemo(() => {
    if (!categories || !selectedCategorySlugs || selectedCategorySlugs.length === 0) return [];
    const tags: { slug: string; name: string }[] = [];
    selectedCategorySlugs.forEach((slug) => {
      const parent = categories.find((c) => c.slug === slug);
      if (parent) {
        tags.push({ slug, name: language === 'bn' ? parent.nameBn : parent.nameEn });
        return;
      }
      for (const cat of categories) {
        const sub = cat.subcategories?.find((s) => s.slug === slug);
        if (sub) {
          tags.push({ slug, name: language === 'bn' ? sub.nameBn : sub.nameEn });
          return;
        }
      }
    });
    return tags;
  }, [categories, selectedCategorySlugs, language]);

  return (
    <div className="space-y-4 mb-6">
      {/* Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium">
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
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs cursor-pointer"
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

      {/* Horizontal Scrollable Category Quick-Chips Bar */}
      {categories && categories.length > 0 && onToggleCategorySlug && (
        <div className="pt-2 border-t border-stone-100">
          <CategoryChipsBar
            categories={categories}
            selectedSlugs={selectedCategorySlugs || []}
            onToggleSlug={onToggleCategorySlug}
            onClearAll={() => onClearCategorySlugs?.()}
          />
        </div>
      )}

      {/* Active Filter Pills Bar */}
      {activeFilterTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-600">
            {language === 'bn' ? 'সক্রিয় ফিল্টার:' : 'Active Filters:'}
          </span>
          {activeFilterTags.map((tag) => (
            <span
              key={tag.slug}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-2xs"
            >
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => onRemoveCategorySlug?.(tag.slug)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-emerald-200/80 text-emerald-700 transition-colors cursor-pointer"
                aria-label={`Remove filter ${tag.name}`}
              >
                <X className="w-3 h-3 stroke-[2.5]" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onClearCategorySlugs}
            className="text-xs font-medium text-stone-400 hover:text-red-600 transition-colors underline cursor-pointer ml-1"
          >
            {language === 'bn' ? 'সব ফিল্টার মুছুন' : 'Clear all'}
          </button>
        </div>
      )}
    </div>
  );
};
