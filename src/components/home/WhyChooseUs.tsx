/**
 * @file WhyChooseUs.tsx
 * @description 4 Clean feature value cards without unsupported commercial claims.
 */

import React from 'react';
import { ShieldCheck, Sprout, BookOpen, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { language, t } = useLanguage();

  const features = [
    {
      id: 'selected-plants',
      icon: <Sprout className="w-6 h-6 text-[#5C8D50]" />,
      titleEn: 'Carefully Selected Plants',
      titleBn: 'যত্নে নির্বাচিত গাছ',
      descEn: 'Healthy botanical varieties curated by Hasna Hena for home spaces.',
      descBn: 'ঘরের পরিবেশ ও আবহাওয়া অনুযায়ী হাসনাহেনার পরম যত্নে বাছাইকৃত সুস্থ গাছ।',
    },
    {
      id: 'quality-seeds',
      icon: <ShieldCheck className="w-6 h-6 text-[#174D35]" />,
      titleEn: 'Quality Seeds',
      titleBn: 'মানসম্মত বীজ',
      descEn: 'Fresh, tested vegetable and flower seeds from reliable domestic sources.',
      descBn: 'বিশ্বস্ত দেশি-বিদেশি উৎস থেকে সংগৃহীত তাজা ও খাঁটি জাতের বীজ।',
    },
    {
      id: 'gardening-guidance',
      icon: <BookOpen className="w-6 h-6 text-[#C5A059]" />,
      titleEn: 'Gardening Guidance',
      titleBn: 'বাগান পরিচর্যার পরামর্শ',
      descEn: 'Practical watering, sunlight, and organic soil tips for beginners.',
      descBn: 'পানি, রোদ ও সার প্রয়োগের সঠিক নিয়মে বাগান করার সহজ নির্দেশনা।',
    },
    {
      id: 'convenient-ordering',
      icon: <Truck className="w-6 h-6 text-[#174D35]" />,
      titleEn: 'Convenient Ordering',
      titleBn: 'সহজে অর্ডার',
      descEn: 'Smooth plant browsing and responsive customer support for every gardener.',
      descBn: 'সহজেই পছন্দের গাছ বাছাই এবং সার্বক্ষণিক সহায়ক গ্রাহক পরামর্শ।',
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-white/60 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
            {t('whyChooseTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {t('whyChooseSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const title = language === 'bn' ? feat.titleBn : feat.titleEn;
            const desc = language === 'bn' ? feat.descBn : feat.descEn;

            return (
              <div
                key={feat.id}
                className="bg-[#F7F5EC]/70 p-6 rounded-2xl border border-stone-200/80 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="font-serif-botanical font-bold text-base text-stone-900">
                    {title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
