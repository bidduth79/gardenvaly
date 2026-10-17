/**
 * @file FeaturedSupplies.tsx
 * @description Dedicated showcase for Gardening Supplies, Tools, and Plant Care essentials.
 */

import React from 'react';
import { Wrench, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';

interface FeaturedSuppliesProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const FeaturedSupplies: React.FC<FeaturedSuppliesProps> = ({ products, onQuickView }) => {
  const { language, t } = useLanguage();
  const { navigate } = useRouter();
  const supplies = products.filter((p) => p.type === 'tool' || p.type === 'care');

  if (supplies.length === 0) return null;

  return (
    <section id="supplies" className="py-14 sm:py-18 bg-[#F3EFE6]/60 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174D35] mb-2">
              <Wrench className="w-4 h-4 text-[#5C8D50]" />
              <span>Essential Garden Gear</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
              {language === 'bn' ? 'প্রয়োজনীয় বাগান সামগ্রী' : 'Gardening Supplies & Tools'}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
              {language === 'bn'
                ? 'গাছের সুস্বাস্থ্য, ছাদবাগানের পরিচর্যা ও সুন্দর টবের জন্য বাছাইকৃত সেরা টুলস ও জৈব উপাদান।'
                : 'Premium pruning tools, pressure sprayers, organic compost, and pots to nourish your garden.'}
            </p>
          </div>

          <a
            href="/supplies"
            onClick={(e) => {
              e.preventDefault();
              navigate('/supplies');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#174D35] hover:text-[#5C8D50] transition-colors group self-start md:self-auto cursor-pointer"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Supplies responsive grid */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {supplies.slice(0, 8).map((product) => (
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
