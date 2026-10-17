/**
 * @file MobileCategoryAccordion.tsx
 * @description Mobile accordion tree for exploring hierarchical categories and subcategories.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { Category } from '../../types/product';
import { CategoryIcon } from '../common/CategoryIcon';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

interface MobileCategoryAccordionProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

export const MobileCategoryAccordion: React.FC<MobileCategoryAccordionProps> = ({
  categories,
  onSelectCategory,
}) => {
  const { language } = useLanguage();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const plantCategories = categories.filter((c) => c.type === 'plant' || !c.type);

  const toggleExpand = (slug: string) => {
    setExpandedCat((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="my-2 p-2.5 rounded-2xl bg-white/90 border border-stone-200/80 shadow-2xs">
      <div className="flex items-center gap-2 px-2 py-1 mb-1 text-xs font-bold text-[#174D35] uppercase tracking-wider">
        <Layers className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'ক্যাটাগরি ও সাব-ক্যাটাগরি' : 'Categories & Subcategories'}</span>
      </div>

      <div className="space-y-1">
        {plantCategories.map((cat) => {
          const isExpanded = expandedCat === cat.slug;
          const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;

          return (
            <div key={cat.id} className="rounded-xl overflow-hidden">
              {/* Parent row */}
              <div
                className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                  isExpanded ? 'bg-[#174D35]/10 text-[#174D35]' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                >
                  <CategoryIcon
                    icon={cat.iconName}
                    className={`w-4 h-4 shrink-0 ${isExpanded ? 'text-[#174D35]' : 'text-stone-500'}`}
                  />
                  <span className="text-xs font-bold truncate">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    ({formatNumeral(cat.itemCount, language)})
                  </span>
                </button>

                {hasSubs && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(cat.slug)}
                    aria-label={`Toggle ${cat.nameEn} subcategories`}
                    className="p-1 rounded-md text-stone-500 hover:text-[#174D35] hover:bg-stone-200/50 transition-colors ml-1"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {hasSubs && isExpanded && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-stone-50/60 rounded-b-xl border-l-2 border-[#174D35]/30 ml-3 my-1">
                  {cat.subcategories!.map((sub) => (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => onSelectCategory(sub.slug)}
                      className="w-full flex items-center justify-between py-1.5 px-2 text-left rounded-lg text-xs text-stone-600 hover:text-[#174D35] hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="truncate">{language === 'bn' ? sub.nameBn : sub.nameEn}</span>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0 ml-1">
                        {formatNumeral(sub.itemCount, language)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
