/**
 * @file MegaMenu.tsx
 * @description DesignMingle-inspired 2-column botanical dropdown menu (.dd-panel)
 * featuring a warm spotlight launch card (.dd-launch) on the left and interactive
 * icon-animated category items (.dm-dd-item / .dm-dd-ico) on the right.
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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
  const isBn = language === 'bn';

  const plantCategories = categories.filter((c) => c.type === 'plant' || !c.type);

  const handleCategoryClick = (slug: string) => {
    onClose();
    navigate(`/category/${slug}`);
  };

  return (
    <div
      role="menu"
      aria-label={isBn ? 'গাছপালার মেনু' : 'Plants Menu'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3.5 z-50 transition-all duration-250 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        isOpen
          ? 'opacity-100 visible translate-y-0 pointer-events-auto'
          : 'opacity-0 invisible translate-y-2 pointer-events-none'
      }`}
    >
      <div className="w-[92vw] max-w-[740px] bg-white dark:bg-[#0C2018] border border-stone-200/80 dark:border-[#1B3B2E] rounded-[26px] p-3.5 shadow-[0_30px_60px_-24px_rgba(18,17,17,0.28)] grid grid-cols-12 gap-2.5">
        {/* Left Spotlight Column (.dd-launch style from DesignMingle) */}
        <div className="col-span-5 bg-[#FFF5CC] dark:bg-[#112A1F] rounded-[18px] p-3 flex flex-col justify-between">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B5A1E] dark:text-[#FDE047] px-2 pt-1 pb-2">
            {isBn ? 'আপনার সবুজ বাগান সাজান' : 'Launch Your Green Sanctuary'}
          </span>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/plants');
            }}
            className="group w-full flex flex-col gap-3 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-full h-[215px] rounded-[16px] overflow-hidden bg-white dark:bg-[#091812] shadow-[0_14px_30px_-18px_rgba(107,90,30,0.45)]">
              <img
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80"
                alt={isBn ? 'গার্ডেনভ্যালি চারা কালেকশন' : 'Gardenvaly Botanical Collection'}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>

            {/* DesignMingle .ov-btn Pill CTA */}
            <span className="w-full h-12 pl-4 pr-1.5 rounded-full bg-[#121111] dark:bg-[#174D35] group-hover:bg-[#174D35] dark:group-hover:bg-[#22C55E] text-white dark:group-hover:text-[#061810] flex items-center justify-between gap-2 text-[13.5px] font-medium transition-all duration-300">
              <span className="truncate">
                {isBn ? 'সব গাছপালা ও চারা দেখুন' : 'Complete Plant Collection'}
              </span>
              <span className="w-9 h-9 rounded-full bg-white/15 dark:group-hover:bg-[#061810]/15 grid place-items-center shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </span>
          </button>
        </div>

        {/* Right Individual Categories Column (.dd-col style from DesignMingle) */}
        <div className="col-span-7 flex flex-col justify-between py-0.5">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400 dark:text-[#8FA89B] px-3 pt-1.5 pb-1.5">
              {isBn ? 'বিভাগ অনুযায়ী গাছপালা' : 'Individual Plant Categories'}
            </span>

            <div className="flex flex-col gap-0.5">
              {plantCategories.slice(0, 5).map((cat) => {
                const subNames = Array.isArray(cat.subcategories)
                  ? cat.subcategories
                      .slice(0, 3)
                      .map((s) => (isBn ? s.nameBn : s.nameEn))
                      .join(' • ')
                  : '';

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="dm-dd-item w-full flex items-start gap-3 px-3 py-2.5 rounded-[12px] hover:bg-stone-100/85 dark:hover:bg-[#132E22] transition-colors text-left cursor-pointer group"
                  >
                    <span className="dm-dd-ico w-[34px] h-[34px] rounded-[10px] bg-[#F2F1F3] dark:bg-[#153427] text-[#3A3540] dark:text-[#34D399] grid place-items-center shrink-0 mt-0.5">
                      <CategoryIcon icon={cat.iconName} className="w-[17px] h-[17px]" />
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        <b className="block text-[14px] font-semibold text-stone-900 dark:text-white leading-snug truncate">
                          {isBn ? cat.nameBn : cat.nameEn}
                        </b>
                        <span className="text-[11px] font-medium text-stone-400 dark:text-[#8FA89B] group-hover:text-[#174D35] dark:group-hover:text-[#34D399] shrink-0">
                          {formatNumeral(cat.itemCount, language)} {isBn ? 'টি' : 'items'}
                        </span>
                      </span>
                      <small className="block text-[12.5px] text-stone-500 dark:text-[#9CB5A7] leading-snug mt-0.5 truncate">
                        {subNames || (isBn ? cat.descriptionBn : cat.descriptionEn)}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
