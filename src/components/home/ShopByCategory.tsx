/**
 * @file ShopByCategory.tsx
 * @description Category showcases that navigate to dedicated category listing pages.
 */

import React, { useState } from 'react';
import { Leaf, Sparkles, ArrowRight, Wrench } from 'lucide-react';
import { Category, ProductCategoryType } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { formatNumeral } from '../../utils/formatters';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import { PlantFinderModal } from './PlantFinderModal';

interface ShopByCategoryProps {
  categories: Category[];
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ categories }) => {
  const { language, t } = useLanguage();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<ProductCategoryType>('plant');
  const [isFinderOpen, setIsFinderOpen] = useState(false);

  const filtered = categories.filter((c) => c.type === activeTab);

  return (
    <section id="categories" className="pt-8 sm:pt-12 pb-14 sm:pb-18 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C8D50] mb-2">
              <Leaf className="w-4 h-4" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
              {t('shopByCategoryTitle')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
              {t('shopByCategorySubtitle')}
            </p>
          </div>

          {/* 3 Menus Side-by-Side (গাছপালার ক্যাটাগরি, বীজের ক্যাটাগরি, স্মার্ট ম্যাচ) */}
          {/* Menus (গাছপালার ক্যাটাগরি, বীজের ক্যাটাগরি, বাগান সামগ্রী, স্মার্ট ম্যাচ) */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar py-0.5 self-start md:self-auto">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-200/70 dark:bg-[#0C2018] p-1 sm:p-1.5 rounded-2xl border border-stone-300/60 dark:border-[#1B3B2E] w-max shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('plant')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'plant'
                    ? 'bg-[#174D35] dark:bg-[#1B3B2E] text-white shadow-xs dark:border dark:border-[#34D399]/30'
                    : 'text-stone-700 dark:text-[#CBD5E1] hover:text-[#174D35] dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-[#10261E]'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{t('plantCategoriesTab')}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seed')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'seed'
                    ? 'bg-[#174D35] dark:bg-[#1B3B2E] text-white shadow-xs dark:border dark:border-[#34D399]/30'
                    : 'text-stone-700 dark:text-[#CBD5E1] hover:text-[#174D35] dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-[#10261E]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{t('seedCategoriesTab')}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tool')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'tool'
                    ? 'bg-[#174D35] dark:bg-[#1B3B2E] text-white shadow-xs dark:border dark:border-[#34D399]/30'
                    : 'text-stone-700 dark:text-[#CBD5E1] hover:text-[#174D35] dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-[#10261E]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{language === 'bn' ? 'বাগান সামগ্রী' : 'Gardening Supplies'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFinderOpen(true)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-stone-700 dark:text-[#CBD5E1] hover:text-[#174D35] dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-[#10261E] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{language === 'bn' ? 'স্মার্ট ম্যাচ' : 'Smart Match'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div
          className={`grid gap-5 sm:gap-6 ${
            activeTab === 'plant'
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
              : activeTab === 'seed'
              ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-3'
          }`}
        >
          {filtered.map((cat) => {
            const name = language === 'bn' ? cat.nameBn : cat.nameEn;
            const desc = language === 'bn' ? cat.descriptionBn : cat.descriptionEn;

            return (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/category/${cat.slug}`);
                }}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer block"
              >
                <div className="relative h-36 sm:h-44 overflow-hidden bg-stone-100">
                  <img
                    src={getSafeImageUrl(cat.imageUrl, { type: cat.type, categorySlug: cat.slug })}
                    alt={`${name} collection - Gardenvaly`}
                    width={300}
                    height={200}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => handleImageError(e, getProductFallbackImage({ type: cat.type, categorySlug: cat.slug }))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[#174D35] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {formatNumeral(cat.itemCount, language)}
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-botanical font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#174D35] transition-colors line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-[#174D35]">
                    <span>{language === 'bn' ? 'দেখুন' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <PlantFinderModal isOpen={isFinderOpen} onClose={() => setIsFinderOpen(false)} />
    </section>
  );
};
