/**
 * @file MobileCategoryAccordion.tsx
 * @description Sleek dark-charcoal accordion tree for exploring hierarchical categories and subcategories inside the Mobile Bottom Sheet Menu.
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
    <div className="my-2.5 p-3 rounded-2xl bg-[#121418] border border-white/10 shadow-inner">
      <div className="flex items-center gap-2 px-1.5 py-1 mb-1.5 text-xs font-bold text-zinc-300 uppercase tracking-wider">
        <Layers className="w-3.5 h-3.5 text-zinc-400" />
        <span>{language === 'bn' ? 'ক্যাটাগরি ও সাব-ক্যাটাগরি' : 'Categories & Subcategories'}</span>
      </div>

      <div className="space-y-1.5">
        {plantCategories.map((cat) => {
          const isExpanded = expandedCat === cat.slug;
          const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;

          return (
            <div key={cat.id} className="rounded-xl overflow-hidden">
              {/* Parent row */}
              <div
                className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                  isExpanded
                    ? 'bg-white/12 text-white border border-white/25'
                    : 'bg-[#181A20] hover:bg-[#20232B] text-zinc-200 border border-white/6'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
                >
                  <CategoryIcon
                    icon={cat.iconName}
                    className={`w-4 h-4 shrink-0 ${isExpanded ? 'text-white' : 'text-zinc-400'}`}
                  />
                  <span className="text-xs font-bold truncate">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono tabular-nums">
                    ({formatNumeral(cat.itemCount, language)})
                  </span>
                </button>

                {hasSubs && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(cat.slug)}
                    aria-label={`Toggle ${cat.nameEn} subcategories`}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {hasSubs && isExpanded && (
                <div className="pl-5 pr-2 py-1.5 space-y-1 bg-[#0E1014] rounded-b-xl border-t border-white/8 mx-1 my-1">
                  {cat.subcategories!.map((sub) => (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => onSelectCategory(sub.slug)}
                      className="w-full flex items-center justify-between py-1.5 px-2.5 text-left rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
                    >
                      <span className="truncate">{language === 'bn' ? sub.nameBn : sub.nameEn}</span>
                      <span className="text-[10px] text-zinc-500 font-mono tabular-nums shrink-0 ml-1">
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
