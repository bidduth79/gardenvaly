/**
 * @file CategoryHierarchyFilter.tsx
 * @description Hierarchical category & subcategory accordion filter with custom checkboxes.
 */

import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Category, Subcategory, ProductCategoryType } from '../../types/product';
import { CategoryIcon } from '../common/CategoryIcon';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

interface CategoryHierarchyFilterProps {
  categories: Category[];
  selectedSlugs: string[];
  activeType?: ProductCategoryType;
  onToggleSlug: (slug: string) => void;
}

export const CategoryHierarchyFilter: React.FC<CategoryHierarchyFilterProps> = ({
  categories,
  selectedSlugs,
  activeType,
  onToggleSlug,
}) => {
  const { language } = useLanguage();
  // Fruit plants starts expanded matching reference UI; user can toggle any category
  const [expandedSlugs, setExpandedSlugs] = useState<string[]>(['fruit-plants']);

  const toggleExpand = (catSlug: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedSlugs((prev) =>
      prev.includes(catSlug) ? prev.filter((s) => s !== catSlug) : [...prev, catSlug]
    );
  };

  const handleRowClick = (cat: Category) => {
    const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;
    if (hasSubs) toggleExpand(cat.slug);
    else onToggleSlug(cat.slug);
  };

  const filteredCategories = categories.filter((cat) => {
    if (!activeType) return true;
    if (activeType === 'tool') return cat.type === 'tool' || cat.type === 'care';
    return cat.type === activeType;
  });

  return (
    <div className="space-y-3">
      <div className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
        {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
      </div>

      <div className="space-y-1.5 text-xs max-h-[380px] overflow-y-auto pr-1 category-filter-scroll">
        {filteredCategories.map((cat) => {
          const isCatSelected = selectedSlugs.includes(cat.slug);
          const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;
          const isExpanded = expandedSlugs.includes(cat.slug);

          return (
            <div key={cat.slug} className="space-y-1">
              {/* Parent Category Row */}
              <div
                onClick={() => handleRowClick(cat)}
                className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-all cursor-pointer select-none group ${
                  isCatSelected
                    ? 'bg-[#ECFDF5] border border-emerald-200/90 dark:bg-[#102D21] dark:border-[#34D399]/40 font-semibold shadow-2xs'
                    : 'hover:bg-stone-50 dark:hover:bg-[#10261E]/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    role="checkbox"
                    aria-checked={isCatSelected}
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); onToggleSlug(cat.slug); }}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggleSlug(cat.slug); } }}
                    className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                      isCatSelected
                        ? 'border-[#059669] bg-[#059669] dark:border-[#34D399] dark:bg-[#10B981] text-white'
                        : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-[#10261E] group-hover:border-stone-400'
                    }`}
                  >
                    {isCatSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <CategoryIcon
                    icon={cat.iconName}
                    className={`w-4 h-4 shrink-0 transition-colors ${isCatSelected ? 'text-[#059669] dark:text-[#34D399]' : 'text-stone-600 dark:text-[#9CB5A7]'}`}
                  />

                  <span className={`truncate text-[13px] ${isCatSelected ? 'text-emerald-950 dark:text-emerald-100 font-bold' : 'text-stone-800 dark:text-[#F8FAF8] font-medium'}`}>
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className={`text-[11px] font-mono ${isCatSelected ? 'text-emerald-700 dark:text-[#34D399] font-medium' : 'text-stone-400 dark:text-stone-500 font-normal'}`}>
                    {formatNumeral(cat.itemCount, language)}
                  </span>
                  {hasSubs && (
                    <button
                      type="button"
                      aria-label={`Toggle ${cat.nameEn} subcategories`}
                      onClick={(e) => toggleExpand(cat.slug, e)}
                      className="p-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-stone-500 dark:text-stone-300" /> : <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories Tree Branch */}
              {hasSubs && isExpanded && (
                <div className="ml-4 pl-3.5 space-y-1 border-l-2 border-stone-200/90 dark:border-[#1B3B2E] my-1">
                  {cat.subcategories!.map((sub: Subcategory) => {
                    const isSubSelected = selectedSlugs.includes(sub.slug);
                    return (
                      <div
                        key={sub.slug}
                        onClick={() => onToggleSlug(sub.slug)}
                        className={`w-full flex items-center justify-between py-1 px-2 rounded-lg transition-colors cursor-pointer select-none group ${
                          isSubSelected
                            ? 'border border-emerald-200 dark:border-[#34D399]/40 bg-[#ECFDF5]/80 dark:bg-[#102D21] font-medium text-emerald-900 dark:text-emerald-200'
                            : 'hover:bg-stone-50/80 dark:hover:bg-[#10261E]/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            role="checkbox"
                            aria-checked={isSubSelected}
                            tabIndex={0}
                            className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                              isSubSelected
                                ? 'border-[#059669] bg-[#059669] dark:border-[#34D399] dark:bg-[#10B981] text-white'
                                : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-[#10261E] group-hover:border-stone-400'
                            }`}
                          >
                            {isSubSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <CategoryIcon
                            icon={sub.iconName || cat.iconName}
                            className={`w-3.5 h-3.5 shrink-0 ${isSubSelected ? 'text-[#059669] dark:text-[#34D399]' : 'text-stone-400 dark:text-[#8FA89B]'}`}
                          />

                          <span className="truncate text-stone-700 dark:text-[#CBD5E1] text-[12.5px]">
                            {language === 'bn' ? sub.nameBn : sub.nameEn}
                          </span>
                        </div>

                        <span className="text-[11px] text-stone-400 dark:text-stone-500 font-mono shrink-0 ml-2">
                          {formatNumeral(sub.itemCount, language)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
