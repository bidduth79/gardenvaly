/**
 * @file FeaturedSeeds.tsx
 * @description Dedicated showcase for 4 high-yield Heirloom & Flower Seed varieties.
 */

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';

interface FeaturedSeedsProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export const FeaturedSeeds: React.FC<FeaturedSeedsProps> = ({ products, onQuickView }) => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const seeds = products.filter((p) => p.type === 'seed');

  return (
    <section id="seeds" className="py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2 animate-fade-up-1">
              <Sparkles className="w-4 h-4" />
              <span>Heirloom & Organic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900 animate-fade-up-2">
              {t('featuredSeedsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl animate-fade-up-3">
              {t('featuredSeedsSubtitle')}
            </p>
          </div>

          <a
            href="/seeds"
            onClick={(e) => {
              e.preventDefault();
              navigate('/seeds');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#174D35] hover:text-[#5C8D50] transition-colors group self-start md:self-auto"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 4 Seeds responsive grid */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {seeds.map((product) => (
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
