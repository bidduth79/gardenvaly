/**
 * @file FilterSidebar.tsx
 * @description Desktop sidebar filter matching exact user reference layout & category tree hierarchy.
 */

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Category, ProductFilterState, ProductCategoryType } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';
import { CategoryHierarchyFilter } from './CategoryHierarchyFilter';

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilterState;
  onFilterChange: (updated: Partial<ProductFilterState>) => void;
  onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { language } = useLanguage();

  const selectedSlugs = filters.categorySlugs && filters.categorySlugs.length > 0
    ? filters.categorySlugs
    : filters.categorySlug
    ? [filters.categorySlug]
    : [];

  const handleToggleSlug = (slug: string) => {
    const nextSlugs = selectedSlugs.includes(slug)
      ? selectedSlugs.filter((s) => s !== slug)
      : [...selectedSlugs, slug];
    onFilterChange({
      categorySlugs: nextSlugs,
      categorySlug: nextSlugs.length === 1 ? nextSlugs[0] : undefined,
    });
  };

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#0C2018] p-5 rounded-2xl border border-stone-200/80 dark:border-[#1B3B2E] shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-[#1B3B2E]">
        <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white text-base">
          <Filter className="w-4.5 h-4.5 text-[#174D35] dark:text-[#34D399]" />
          <span>{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
        </div>
        <button
          onClick={onClearFilters}
          className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ফিল্টার মুছুন' : 'Clear Filters'}</span>
        </button>
      </div>

      {/* Product Type Filter */}
      <div className="space-y-2">
        <label className="text-xs sm:text-[13px] font-bold text-[#3B7A57] dark:text-[#34D399] tracking-tight block">
          {language === 'bn' ? 'পণ্যের ধরন' : 'Product Type'}
        </label>
        <div className="space-y-1 text-xs sm:text-[13px]">
          {(['all', 'plant', 'seed', 'tool'] as const).map((typeKey) => {
            const isSelected = typeKey === 'all' ? !filters.type : filters.type === typeKey;
            const label =
              typeKey === 'all'
                ? (language === 'bn' ? 'সব ধরনের' : 'All Types')
                : typeKey === 'plant'
                ? (language === 'bn' ? 'গাছপালা ও চারা' : 'Plants & Seedlings')
                : typeKey === 'seed'
                ? (language === 'bn' ? 'অর্গানিক বীজ' : 'Organic Seeds')
                : (language === 'bn' ? 'বাগান সামগ্রী' : 'Gardening Supplies');

            return (
              <button
                key={typeKey}
                onClick={() => onFilterChange({ type: typeKey === 'all' ? undefined : (typeKey as ProductCategoryType) })}
                className={`w-full text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#174D35] dark:bg-[#1B3B2E] text-white font-bold py-2 px-3.5 rounded-xl shadow-2xs dark:border dark:border-[#34D399]/30'
                    : 'text-stone-600 dark:text-[#CBD5E1] hover:text-[#174D35] dark:hover:text-white py-1.5 px-3.5 rounded-xl hover:bg-stone-50 dark:hover:bg-[#10261E]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hierarchical Categories Filter with Subcategories & Custom Scrollbar */}
      <CategoryHierarchyFilter
        categories={categories}
        selectedSlugs={selectedSlugs}
        activeType={filters.type}
        onToggleSlug={handleToggleSlug}
      />

      {/* Divider */}
      <div className="border-t border-stone-200/80 dark:border-[#1B3B2E]" />

      {/* Price Range Filter */}
      <div className="space-y-2.5">
        <label className="text-xs sm:text-[13px] font-bold text-[#3B7A57] dark:text-[#34D399] tracking-tight block">
          {language === 'bn' ? 'মূল্য পরিসীমা' : 'Price Range'}
        </label>
        <input
          type="number"
          min="0"
          max="2500"
          step="50"
          value={filters.maxPrice || 2500}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-[#1B3B2E] bg-white dark:bg-[#0E241B] text-xs sm:text-sm font-semibold text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#174D35]"
        />
        <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium font-mono">
          <span>{formatPrice(0, language)}</span>
          <span>{formatPrice(filters.maxPrice || 2500, language)}</span>
        </div>
      </div>
    </aside>
  );
};
