/**
 * @file SeedToTreeJourney.tsx
 * @description Interactive scrollytelling parallax section: Journey from Heirloom Seed to Fruiting Tree.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Sparkles, ArrowRight, Sun, Droplets, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { SeedGrowthVisual } from './SeedGrowthVisual';

interface StageData {
  id: string;
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  metaBn: string;
  metaEn: string;
  icon: React.ElementType;
}

const STAGES: StageData[] = [
  {
    id: 'seed',
    badgeBn: 'ধাপ ১: নতুন জীবনের সূচনা',
    badgeEn: 'Phase 1: Dormancy & Awakening',
    titleBn: 'খাঁটি বীজ ও উর্বর মাটি',
    titleEn: 'Heirloom Seed & Fertile Loam',
    descBn: 'একটি সুস্থ বীজের ভেতরেই সুপ্ত থাকে আগামীর বিশাল বৃক্ষের সম্ভাবনা। সঠিক আর্দ্রতা, তাপমাত্রা ও সুষম জৈব পুষ্টিতে শুরু হয় নতুন প্রাণের যাত্রা।',
    descEn: 'Within every tested heirloom seed rests the quiet promise of a flourishing canopy. Enveloped by damp, nutrient-dense organic compost, life awakens.',
    metaBn: 'অঙ্কুরোদগম হার: ৯৫%+',
    metaEn: 'Germination Rate: 95%+',
    icon: Droplets,
  },
  {
    id: 'sprout',
    badgeBn: 'ধাপ ২: আলোর অভিমুখে বৃদ্ধি',
    badgeEn: 'Phase 2: Reaching for Sun',
    titleBn: 'কচি কান্ড ও সবুজ অঙ্কুর',
    titleEn: 'Tender Stem & Emerald Leaves',
    descBn: 'মাটি ভেদ করে সূর্যের আলোর স্পর্শে মেলে ধরে কচি দুটি পাতা। শেকড়গুলো ক্রমশ ছড়িয়ে পড়ে মাটির গভীরে, যা চারাকে দেয় মজবুত অবলম্বন।',
    descEn: 'Breaking gently through the loam, two tender emerald leaves reach toward morning rays as rootlets anchor deep into the nourishment below.',
    metaBn: 'দৈনিক সূর্যালোক: ৪-৬ ঘণ্টা',
    metaEn: 'Daily Sunlight: 4–6 hrs',
    icon: Sun,
  },
  {
    id: 'tree',
    badgeBn: 'ধাপ ৩: প্রকৃতির পূর্ণ বিকাশ',
    badgeEn: 'Phase 3: Abundant Fruition',
    titleBn: 'ফুল, মিষ্টি ফল ও ছায়াভরা বৃক্ষ',
    titleEn: 'Fragrant Blooms & Golden Fruits',
    descBn: 'পরম যত্ন ও ভালোবাসার পরণতিতে আজ সেটি মিষ্টি ফল ও স্নিগ্ধ ছায়ায় ভরা বৃক্ষ। গার্ডেনভ্যালির সাথে আপনার বারান্দা বা ছাদবাগানেও ফুটুক এই আনন্দ।',
    descEn: 'Crowned with vibrant foliage, delicate blossoms, and succulent organic fruits. Bring this natural wonder to your balcony or rooftop haven.',
    metaBn: 'গাছের প্রকৃতি: দীর্ঘজীবী বহুবর্ষজীবী',
    metaEn: 'Plant Type: Long-lived Perennial',
    icon: Heart,
  },
];

export const SeedToTreeJourney: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useRouter();
  const [activeStage, setActiveStage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Dynamic Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress across the section viewport
      if (rect.top <= windowHeight * 0.7 && rect.bottom >= windowHeight * 0.3) {
        const totalDist = windowHeight * 0.8 + rect.height;
        const currentProgress = (windowHeight * 0.7 - rect.top) / totalDist;
        const bounded = Math.max(0, Math.min(1, currentProgress));

        if (bounded < 0.35) setActiveStage(0);
        else if (bounded < 0.7) setActiveStage(1);
        else setActiveStage(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cur = STAGES[activeStage];
  const isBn = language === 'bn';

  return (
    <section
      ref={sectionRef}
      id="seed-journey"
      className="relative py-16 sm:py-24 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-bold uppercase tracking-wider mb-3">
            <Sprout className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্রকৃতির রূপান্তর' : 'The Botanical Cycle'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif-botanical font-bold text-stone-900 tracking-tight">
            {isBn ? 'একটি বীজের রূপকথা: বীজ থেকে ফলবান বৃক্ষ' : 'Journey of a Seed: From Grain to Fruiting Tree'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {isBn
              ? 'স্ক্রল করে বা নিচের ধাপে ক্লিক করে প্রত্যক্ষ করুন নতুন জীবনের এই চমৎকার বিকাশ।'
              : 'Scroll down or select any phase below to experience nature unfolding step by step.'}
          </p>

          {/* Interactive Phase Selectors */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 mt-6">
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStage(idx)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#174D35] dark:bg-[#1B3B2E] text-white shadow-md scale-105 border border-[#34D399]/40'
                      : 'bg-white/80 dark:bg-[#0C2018] text-stone-600 dark:text-[#CBD5E1] hover:text-[#174D35] dark:hover:text-[#34D399] hover:bg-stone-100 dark:hover:bg-[#10261E] border border-stone-200/60 dark:border-[#1B3B2E]'
                  }`}
                >
                  <s.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-stone-400 dark:text-[#8FA89B]'}`} />
                  <span>{isBn ? s.titleBn.split(' ')[0] : s.titleEn.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Box & Visual Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white/90 dark:bg-[#0C2018] backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#174D35]/10 dark:border-[#1B3B2E] shadow-lg">
          {/* Visual Canvas Column */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <SeedGrowthVisual stage={activeStage} />
          </div>

          {/* Stage Details Column */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg">
              {isBn ? cur.badgeBn : cur.badgeEn}
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-[#174D35] dark:text-white leading-snug">
              {isBn ? cur.titleBn : cur.titleEn}
            </h3>

            <p className="text-sm sm:text-base text-stone-600 dark:text-[#CBD5E1] leading-relaxed">
              {isBn ? cur.descBn : cur.descEn}
            </p>

            <div className="p-4 rounded-2xl bg-[#F7F5EC] dark:bg-[#10261E] border border-[#174D35]/10 dark:border-[#1B3B2E] flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-[#E2E8F0]">
                {isBn ? cur.metaBn : cur.metaEn}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(activeStage === 0 ? '/seeds' : '/plants')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2b] dark:bg-[#1B3B2E] dark:hover:bg-[#234d3c] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <span>{activeStage === 0 ? (isBn ? 'খাঁটি বীজ কিনুন' : 'Explore Seeds') : (isBn ? 'গাছপালা কিনুন' : 'Explore Plants')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const tips = document.getElementById('tips');
                  if (tips) tips.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#10261E] dark:hover:bg-[#1B3B2E] text-stone-700 dark:text-[#CBD5E1] dark:border dark:border-[#1B3B2E] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>{isBn ? 'পরিচর্যার টিপস' : 'Gardening Tips'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
