/**
 * @file FeaturedPlants.tsx
 * @description Responsive grid displaying 8 Featured Plant varieties.
 */

import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';

interface FeaturedPlantsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const FeaturedPlants: React.FC<FeaturedPlantsProps> = ({ products, onQuickView }) => {
  const { t } = useLanguage();
  const plants = products.filter((p) => p.type === 'plant');

  const { navigate } = useRouter();

  return (
    <section id="plants" className="py-14 sm:py-18 bg-white/50 border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C8D50] mb-2">
              <Leaf className="w-4 h-4" />
              <span>Living Greenery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
              {t('featuredPlantsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
              {t('featuredPlantsSubtitle')}
            </p>
          </div>

          <a
            href="/plants"
            onClick={(e) => {
              e.preventDefault();
              navigate('/plants');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#174D35] hover:text-[#5C8D50] transition-colors group self-start md:self-auto"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 1 column on <=350px, 2 columns on phone, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {plants.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
