/**
 * @file FilterSidebar.tsx
 * @description Desktop sidebar filter controls for category, price, type, and stock.
 */

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Category, ProductFilterState, ProductCategoryType, IndoorOutdoorType } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral, formatPrice } from '../../utils/formatters';

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
  const { language, t } = useLanguage();

  return (
    <aside className="w-64 shrink-0 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
          <Filter className="w-4 h-4 text-[#174D35]" />
          <span>{t('filters')}</span>
        </div>
        <button
          onClick={onClearFilters}
          className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('clearFilters')}</span>
        </button>
      </div>

      {/* Product Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5C8D50]">
          {t('filterType')}
        </label>
        <div className="space-y-1 text-xs">
          {(['all', 'plant', 'seed', 'tool'] as const).map((typeKey) => {
            const isSelected = typeKey === 'all' ? !filters.type : filters.type === typeKey;
            const label =
              typeKey === 'all'
                ? t('allTypes')
                : typeKey === 'plant'
                ? t('plantsOnly')
                : typeKey === 'seed'
                ? t('seedsOnly')
                : (language === 'bn' ? 'বাগান সামগ্রী' : 'Gardening Supplies');

            return (
              <button
                key={typeKey}
                onClick={() => onFilterChange({ type: typeKey === 'all' ? undefined : (typeKey as ProductCategoryType) })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#174D35] text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5C8D50]">
          {t('filterCategory')}
        </label>
        <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ categorySlug: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              !filters.categorySlug ? 'bg-[#174D35] text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('allCategories')}
          </button>
          {categories
            .filter((cat) => {
              if (!filters.type) return true;
              if (filters.type === 'tool') return cat.type === 'tool' || cat.type === 'care';
              return cat.type === filters.type;
            })
            .map((cat) => {
              const isSelected = filters.categorySlug === cat.slug;
              const name = language === 'bn' ? cat.nameBn : cat.nameEn;
              return (
              <button
                key={cat.slug}
                onClick={() => onFilterChange({ categorySlug: cat.slug })}
                className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#174D35] text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">{name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-stone-200' : 'text-stone-400'}`}>
                  {formatNumeral(cat.itemCount, language)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5C8D50]">
          {t('priceRange')}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="2500"
            step="50"
            value={filters.maxPrice || 2500}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#174D35]"
          />
        </div>
        <div className="flex justify-between text-[11px] text-stone-500">
          <span>{formatPrice(0, language)}</span>
          <span>{formatPrice(filters.maxPrice || 2500, language)}</span>
        </div>
      </div>

      {/* Indoor / Outdoor Placement Filter */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5C8D50]">
          {t('indoorOutdoor')}
        </label>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {(['indoor', 'outdoor'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => onFilterChange({ indoorOutdoor: filters.indoorOutdoor === opt ? undefined : opt })}
              className={`px-2 py-1.5 rounded-lg text-center transition-colors cursor-pointer ${
                filters.indoorOutdoor === opt
                  ? 'bg-[#174D35] text-white font-semibold'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {opt === 'indoor' ? t('indoor') : t('outdoor')}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability Toggle */}
      <div className="pt-2 border-t border-stone-100">
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="rounded text-[#174D35] focus:ring-[#174D35] w-4 h-4 cursor-pointer"
          />
          <span>{t('inStockOnly')}</span>
        </label>
      </div>
    </aside>
  );
};
