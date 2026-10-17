/**
 * @file PromotionalBanner.tsx
 * @description Distinctive seasonal promotional banner for botanical living.
 */

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export const PromotionalBanner: React.FC = () => {
  const { language, t } = useLanguage();

  const handleNavigate = () => {
    const el = document.getElementById('plants');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#174D35] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-[#174D35]/30">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#5C8D50]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মৌসুমি বাগান উৎসব' : 'Seasonal Green Living'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif-botanical font-bold tracking-tight leading-tight">
              {t('promoTitle')}
            </h2>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl">
              {t('promoSubtitle')}
            </p>

            <div className="pt-2">
              <Button
                variant="gold"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNavigate}
              >
                {t('promoCta')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
