/**
 * @file MegaMenu.tsx
 * @description Premium desktop botanical mega menu with multi-column hierarchical categories.
 */

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../../types/product';
import { CategoryIcon } from '../common/CategoryIcon';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { formatNumeral } from '../../utils/formatters';

interface MegaMenuProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  categories,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { language } = useLanguage();
  const { navigate } = useRouter();

  if (!isOpen) return null;

  const plantCategories = categories.filter((c) => c.type === 'plant' || !c.type);

  const handleCategoryClick = (slug: string) => {
    onClose();
    navigate(`/category/${slug}`);
  };

  return (
    <div
      role="menu"
      aria-label={language === 'bn' ? 'গাছপালার মেগা মেনু' : 'Plants Mega Menu'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-1/2 -translate-x-1/2 w-[94vw] max-w-6xl mt-2 p-6 bg-[#FCFAF7] dark:bg-[#0C2018] backdrop-blur-xl border border-[#174D35]/15 dark:border-[#1B3B2E] shadow-2xl rounded-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Hierarchical Categories Columns (9 cols) */}
        <div className="col-span-9 grid grid-cols-3 gap-6 border-r border-[#174D35]/10 dark:border-[#1B3B2E] pr-6">
          {plantCategories.slice(0, 3).map((cat) => (
            <div key={cat.id} className="space-y-3">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className="w-full flex items-center gap-2 group text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] rounded-lg p-1 -ml-1 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#174D35]/10 dark:bg-[#1B3B2E] text-[#174D35] dark:text-[#34D399] flex items-center justify-center shrink-0 group-hover:bg-[#174D35] group-hover:text-white transition-colors">
                  <CategoryIcon icon={cat.iconName} className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-[#174D35] dark:group-hover:text-[#34D399] transition-colors leading-tight">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </h4>
                  <span className="text-[11px] font-medium text-stone-500 dark:text-[#9CB5A7]">
                    {formatNumeral(cat.itemCount, language)} {language === 'bn' ? 'টি চারা' : 'plants'}
                  </span>
                </div>
              </button>

              {/* Subcategories list */}
              {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 && (
                <ul className="space-y-1.5 pl-2 border-l border-stone-200/80 dark:border-[#1B3B2E]">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(sub.slug)}
                        className="w-full flex items-center justify-between text-left text-xs py-1.5 px-2 rounded-md font-medium text-stone-700 hover:text-[#174D35] hover:bg-[#174D35]/5 dark:text-[#E2E8F0] dark:hover:text-[#34D399] dark:hover:bg-[#174D35]/20 transition-colors cursor-pointer group"
                      >
                        <span className="truncate">{language === 'bn' ? sub.nameBn : sub.nameEn}</span>
                        <span className="text-[10px] text-stone-500 dark:text-[#8FA89B] group-hover:text-[#174D35] dark:group-hover:text-[#34D399] font-mono shrink-0 ml-1">
                          {formatNumeral(sub.itemCount, language)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Featured Promo & Spices/Medicinal Column (3 cols) */}
        <div className="col-span-3 flex flex-col justify-between space-y-4">
          {/* Medicinal & Spices Quick Links */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-[#8FA89B]">
              {language === 'bn' ? 'ভেষজ ও মশলা' : 'Herbal & Spices'}
            </h5>
            {plantCategories.slice(3, 5).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-stone-50 hover:bg-[#174D35]/10 text-stone-800 hover:text-[#174D35] dark:bg-[#10261E] dark:hover:bg-[#174D35]/30 dark:text-[#E2E8F0] dark:hover:text-[#34D399] transition-colors text-xs font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon icon={cat.iconName} className="w-3.5 h-3.5 text-stone-600 dark:text-[#34D399]" />
                  <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                </div>
                <span className="text-[10px] text-stone-500 dark:text-[#8FA89B] font-mono">
                  {formatNumeral(cat.itemCount, language)}
                </span>
              </button>
            ))}
          </div>

          {/* Featured Nursery Spotlight Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#174D35] to-[#256B4D] text-white shadow-md relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-[#C5A059] text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সেরা চারা অফার' : 'Top Plant Deal'}</span>
            </div>
            <h5 className="text-xs font-bold text-white leading-snug mb-1">
              {language === 'bn' ? 'বারোমাসি কলম চারা সংগ্রহ' : 'Grafted Fruit Varieties'}
            </h5>
            <p className="text-[11px] text-emerald-100/90 leading-relaxed mb-3">
              {language === 'bn' ? 'ছাদবাগান ও বারান্দার উপযোগী সেরা চারা।' : 'Ideal for rooftops & balconies.'}
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/plants');
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-[#174D35] hover:bg-stone-100 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>{language === 'bn' ? 'সব গাছপালা দেখুন' : 'Browse All Plants'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
