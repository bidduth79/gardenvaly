/**
 * @file CategoryChipsBar.tsx
 * @description Horizontal scrollable category & subcategory quick-chips bar with instant filtering.
 */

import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Category, Subcategory } from '../../types/product';
import { CategoryIcon } from '../common/CategoryIcon';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

interface CategoryChipsBarProps {
  categories: Category[];
  selectedSlugs: string[];
  onToggleSlug: (slug: string) => void;
  onClearAll: () => void;
}

export const CategoryChipsBar: React.FC<CategoryChipsBarProps> = ({
  categories,
  selectedSlugs,
  onToggleSlug,
  onClearAll,
}) => {
  const { language } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const isAllSelected = selectedSlugs.length === 0;

  // Active parent category if one is selected
  const activeParent = categories.find(
    (c) => selectedSlugs.includes(c.slug) || c.subcategories?.some((s) => selectedSlugs.includes(s.slug))
  );

  return (
    <div className="w-full space-y-2 mb-4">
      {/* Primary Category Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
      >
        {/* 'All' button */}
        <button
          type="button"
          onClick={onClearAll}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
            isAllSelected
              ? 'bg-[#174D35] text-white shadow-xs'
              : 'bg-white/90 text-stone-700 hover:bg-stone-100 border border-stone-200/80 shadow-2xs'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সব পণ্য' : 'All Products'}</span>
        </button>

        {/* Categories */}
        {categories.map((cat) => {
          const isSelected =
            selectedSlugs.includes(cat.slug) ||
            cat.subcategories?.some((s) => selectedSlugs.includes(s.slug));

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleSlug(cat.slug)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#174D35] text-white shadow-xs font-semibold'
                  : 'bg-white/90 text-stone-700 hover:bg-stone-100 border border-stone-200/80 shadow-2xs font-medium'
              }`}
            >
              <CategoryIcon
                icon={cat.iconName}
                className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500'}`}
              />
              <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {formatNumeral(cat.itemCount, language)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Subcategories Row (revealed when a parent is active) */}
      {activeParent && Array.isArray(activeParent.subcategories) && activeParent.subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 pl-2 border-l-2 border-[#174D35]/30">
          <span className="text-[11px] font-bold text-[#174D35] shrink-0 mr-1">
            {language === 'bn' ? 'উপ-বিভাগ:' : 'Sub:'}
          </span>
          {activeParent.subcategories.map((sub: Subcategory) => {
            const isSubSelected = selectedSlugs.includes(sub.slug);
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => onToggleSlug(sub.slug)}
                className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer select-none ${
                  isSubSelected
                    ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                    : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200/80 border border-stone-200/60 font-medium'
                }`}
              >
                <span>{language === 'bn' ? sub.nameBn : sub.nameEn}</span>
                <span className={`text-[10px] font-mono ${isSubSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                  ({formatNumeral(sub.itemCount, language)})
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
