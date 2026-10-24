/**
 * @file CategoryShowcase.tsx
 * @description Curated Plant and Seed category showcases.
 */

import React from 'react';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { Category, ProductCategoryType } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

interface CategoryShowcaseProps {
  categories: Category[];
  type: ProductCategoryType;
  id: string;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories, type, id }) => {
  const { language, t } = useLanguage();
  const isPlants = type === 'plant';

  const filtered = categories.filter((c) => c.type === type);
  const title = isPlants ? t('plantsCategoryTitle') : t('seedsCategoryTitle');
  const subtitle = isPlants ? t('plantsCategorySubtitle') : t('seedsCategorySubtitle');

  return (
    <section id={id} className="py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C8D50] mb-2">
              {isPlants ? <Leaf className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{isPlants ? 'Botanical Foliage' : 'Heirloom Germination'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">{subtitle}</p>
          </div>

          <a
            href={`#${id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174D35] hover:text-[#5C8D50] transition-colors group self-start md:self-auto"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((cat) => {
            const name = language === 'bn' ? cat.nameBn : cat.nameEn;
            const desc = language === 'bn' ? cat.descriptionBn : cat.descriptionEn;

            return (
              <div
                key={cat.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-[#22C55E]/50 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={cat.imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Floating Botanical Spores / Dew Particles on Hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden"
                  >
                    <span className="absolute bottom-4 left-6 w-2 h-2 rounded-full bg-[#4ADE80] animate-spore-rise" />
                    <span
                      style={{ animationDelay: '0.6s' }}
                      className="absolute bottom-6 left-1/2 w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-spore-rise"
                    />
                    <span
                      style={{ animationDelay: '1.1s' }}
                      className="absolute bottom-3 right-8 w-2 h-2 rounded-full bg-[#A7F3D0] animate-spore-rise"
                    />
                  </div>

                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/92 backdrop-blur-xs text-[#174D35] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs group-hover:scale-105 group-hover:bg-[#174D35] group-hover:text-white transition-all duration-300">
                    <Leaf className="w-3 h-3 text-[#22C55E] group-hover:rotate-12 transition-transform" />
                    <span>
                      {formatNumeral(cat.itemCount, language)} {language === 'bn' ? 'আইটেম' : 'varieties'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-botanical font-bold text-lg text-stone-900 group-hover:text-[#174D35] transition-colors">
                      {name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#174D35]">
                    <span>{language === 'bn' ? 'সংগ্রহ দেখুন' : 'Explore Category'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
