import React, { useEffect } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Category, ProductFilterState, ProductCategoryType, IndoorOutdoorType } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { CategoryHierarchyFilter } from './CategoryHierarchyFilter';

interface FilterMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  filters: ProductFilterState;
  onFilterChange: (updated: Partial<ProductFilterState>) => void;
  onClearFilters: () => void;
}

export const FilterMobileDrawer: React.FC<FilterMobileDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { language, t } = useLanguage();

  // Lock body scroll when filter drawer is open
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
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catalogue Filters"
      className="fixed inset-0 z-50 flex justify-end md:hidden"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-base">
            <Filter className="w-5 h-5 text-[#174D35]" />
            <span>{t('filters')}</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#174D35]"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-5 flex-1">
          {/* Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C8D50]">
              {t('filterType')}
            </label>
            <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-1.5 text-xs">
              {(['all', 'plant', 'seed', 'tool'] as const).map((tk) => (
                <button
                  key={tk}
                  onClick={() => onFilterChange({ type: tk === 'all' ? undefined : (tk as ProductCategoryType) })}
                  className={`py-2 px-1 rounded-lg text-center font-medium ${
                    (tk === 'all' && !filters.type) || filters.type === tk
                      ? 'bg-[#174D35] text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {tk === 'all'
                    ? t('allTypes')
                    : tk === 'plant'
                    ? t('plantsOnly')
                    : tk === 'seed'
                    ? t('seedsOnly')
                    : (language === 'bn' ? 'বাগান সামগ্রী' : 'Supplies')}
                </button>
              ))}
            </div>
          </div>

          {/* Hierarchical Categories */}
          <CategoryHierarchyFilter
            categories={categories}
            selectedSlugs={selectedSlugs}
            activeType={filters.type}
            onToggleSlug={handleToggleSlug}
          />

          {/* Placement */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C8D50]">
              {t('indoorOutdoor')}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['indoor', 'outdoor'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => onFilterChange({ indoorOutdoor: filters.indoorOutdoor === opt ? undefined : (opt as IndoorOutdoorType) })}
                  className={`py-2 rounded-lg text-center ${
                    filters.indoorOutdoor === opt ? 'bg-[#174D35] text-white font-semibold' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {opt === 'indoor' ? t('indoor') : t('outdoor')}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Only */}
          <label className="flex items-center gap-2 text-xs text-stone-800">
            <input
              type="checkbox"
              checked={!!filters.inStockOnly}
              onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
              className="rounded text-[#174D35] w-4 h-4"
            />
            <span>{t('inStockOnly')}</span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-200 flex gap-2">
          <Button variant="outline" size="sm" fullWidth onClick={onClearFilters}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            {t('clearFilters')}
          </Button>
          <Button variant="primary" size="sm" fullWidth onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </div>
    </div>
  );
};
