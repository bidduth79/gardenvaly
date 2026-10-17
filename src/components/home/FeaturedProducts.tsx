/**
 * @file FeaturedProducts.tsx
 * @description Featured products collection grid with quick view modal trigger.
 */

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';

interface FeaturedProductsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onQuickView,
}) => {
  const { t } = useLanguage();
  const featuredList = products.filter((p) => p.isFeatured);

  return (
    <section id="featured" className="py-14 sm:py-18 bg-white/60 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Bestselling Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
              {t('featuredTitle')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
              {t('featuredSubtitle')}
            </p>
          </div>

          <a
            href="#featured"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174D35] hover:text-[#5C8D50] transition-colors group self-start md:self-auto"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredList.map((product) => (
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
