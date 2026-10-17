/**
 * @file GardeningTips.tsx
 * @description Gardening wisdom and care guides section by Hasna Hena.
 */

import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { MOCK_TIPS } from '../../data/mockTips';
import { GardenTip } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

export const GardeningTips: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedTip, setSelectedTip] = useState<GardenTip | null>(null);

  return (
    <section id="tips" className="py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C8D50] mb-2">
            <BookOpen className="w-4 h-4" />
            <span>{t('horticulturalWisdom')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
            {t('gardeningTipsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {t('gardeningTipsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TIPS.map((tip) => {
            const title = language === 'bn' ? tip.titleBn : tip.titleEn;
            const excerpt = language === 'bn' ? tip.excerptBn : tip.excerptEn;
            const readTime = language === 'bn' ? tip.readTimeBn : tip.readTimeEn;
            const category = language === 'bn' ? tip.categoryBn : tip.categoryEn;

            return (
              <article
                key={tip.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tip.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#174D35] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                    {category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{readTime}</span>
                    </div>

                    <h3 className="font-serif-botanical font-bold text-lg text-stone-900 line-clamp-2 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <button
                      onClick={() => setSelectedTip(tip)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174D35] hover:text-[#5C8D50] transition-colors cursor-pointer"
                    >
                      <span>{t('readMore')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedTip && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-stone-100">
            <button
              onClick={() => setSelectedTip(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-[#5C8D50]">
              {language === 'bn' ? selectedTip.categoryBn : selectedTip.categoryEn}
            </span>
            <h3 className="font-serif-botanical font-bold text-xl text-stone-900 mt-1">
              {language === 'bn' ? selectedTip.titleBn : selectedTip.titleEn}
            </h3>
            <img
              src={selectedTip.imageUrl}
              alt="Tip banner"
              className="w-full h-44 object-cover rounded-2xl my-4"
            />
            <p className="text-sm text-stone-600 leading-relaxed">
              {language === 'bn' ? selectedTip.excerptBn : selectedTip.excerptEn}
            </p>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedTip(null)}>
                {t('close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
