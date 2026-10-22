/**
 * @file SeedToTreeJourney.tsx
 * @description Hardware-Accelerated Native CSS Sticky Scrollytelling section:
 * Journey from Heirloom Seed (খাঁটি) -> Sprout (কচি) -> Flower (ফুল) -> Fruiting Tree (ফল গাছ).
 * Uses a dedicated 360vh sticky scroll runway so the browser's GPU compositor pins the
 * viewport container at top-16 with zero main-thread scroll-jacking jitter or blinking,
 * while mapping scroll progress cleanly across all 4 botanical growth stages.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sprout, Sparkles, ArrowRight, Sun, Droplets, Flower2, TreeDeciduous } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { SeedGrowthVisual } from './SeedGrowthVisual';

interface StageData {
  id: string;
  labelBn: string;
  labelEn: string;
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
    labelBn: 'খাঁটি',
    labelEn: 'Seed',
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
    labelBn: 'কচি',
    labelEn: 'Sprout',
    badgeBn: 'ধাপ ২: আলোর অভিমুখে বৃদ্ধি',
    badgeEn: 'Phase 2: Reaching for Sun',
    titleBn: 'কচি কাণ্ড ও সবুজ অঙ্কুর',
    titleEn: 'Tender Stem & Emerald Leaves',
    descBn: 'মাটি ভেদ করে সূর্যের আলোর স্পর্শে মেলে ধরে কচি দুটি পাতা। শেকড়গুলো ক্রমশ ছড়িয়ে পড়ে মাটির গভীরে, যা চারাকে দেয় মজবুত অবলম্বন।',
    descEn: 'Breaking gently through the loam, two tender emerald leaves reach toward morning rays as rootlets anchor deep into the nourishment below.',
    metaBn: 'দৈনিক সূর্যালোক: ৪-৬ ঘণ্টা',
    metaEn: 'Daily Sunlight: 4–6 hrs',
    icon: Sun,
  },
  {
    id: 'bloom',
    labelBn: 'ফুল',
    labelEn: 'Bloom',
    badgeBn: 'ধাপ ৩: প্রস্ফুটিত পুষ্পমঞ্জরি',
    badgeEn: 'Phase 3: Fragrant Blossoming',
    titleBn: 'প্রস্ফুটিত ফুল ও সতেজ ডালপালা',
    titleEn: 'Blooming Boughs & Fragrant Blossoms',
    descBn: 'পূর্ণাঙ্গ শাখা-প্রশাখা জুড়ে ফুটে ওঠে অসংখ্য সুগন্ধি ফুল। পরাগায়ন ও প্রকৃতির ছোঁয়ায় প্রতিটি ফুল প্রস্তুতি নেয় সুমিষ্ট ফলে রূপান্তরের।',
    descEn: 'Lush boughs burst into fragrant golden-white blossoms. Pollinated by gentle garden breezes, each flower prepares to form sweet organic fruit.',
    metaBn: 'পুষ্পায়ন কাল: বসন্ত ও গ্রীষ্ম',
    metaEn: 'Blooming Season: Spring & Summer',
    icon: Flower2,
  },
  {
    id: 'tree',
    labelBn: 'ফল গাছ',
    labelEn: 'Fruit Tree',
    badgeBn: 'ধাপ ৪: প্রকৃতির পূর্ণ বিকাশ',
    badgeEn: 'Phase 4: Abundant Fruition',
    titleBn: 'মিষ্টি ফল ও ছায়াভরা বৃক্ষ',
    titleEn: 'Golden Fruits & Lush Canopy',
    descBn: 'পরম যত্ন ও ভালোবাসার পরিণতিতে আজ সেটি মিষ্টি ফল ও স্নিগ্ধ ছায়ায় ভরা বৃক্ষ। গার্ডেনভ্যালির সাথে আপনার বারান্দা বা ছাদবাগানেও ফুটুক এই আনন্দ।',
    descEn: 'Crowned with vibrant foliage and succulent organic fruits. Bring this natural wonder to your balcony or rooftop haven.',
    metaBn: 'গাছের প্রকৃতি: দীর্ঘজীবী ফলবান বৃক্ষ',
    metaEn: 'Plant Type: Long-lived Fruiting Tree',
    icon: TreeDeciduous,
  },
];

const HEADER_OFFSET = 64; // Matches sticky top-16 navbar height

export const SeedToTreeJourney: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useRouter();
  const [activeStage, setActiveStage] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activeStageRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  activeStageRef.current = activeStage;

  const setProgressWidth = useCallback((progress: number) => {
    if (progressBarRef.current) {
      const pct = Math.min(100, Math.max(8, Math.round(progress * 100)));
      progressBarRef.current.style.width = `${pct}%`;
    }
  }, []);

  // Interactive button click handler: jumps to the selected stage and syncs scroll position along the runway
  const handleStageClick = useCallback((idx: number) => {
    setActiveStage(idx);
    activeStageRef.current = idx;
    setProgressWidth((idx + 0.5) / STAGES.length);

    if (!sectionRef.current || typeof window === 'undefined') return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top - HEADER_OFFSET;
    const stickyViewportHeight = window.innerHeight - HEADER_OFFSET;
    const scrollableRunway = Math.max(1, rect.height - stickyViewportHeight);

    // Position comfortably inside the target stage's scroll band
    const stageBand = scrollableRunway / STAGES.length;
    const targetScrollY = Math.max(0, sectionTop + idx * stageBand + stageBand * 0.25);

    isProgrammaticScrollRef.current = true;
    if (programmaticTimerRef.current !== null) {
      window.clearTimeout(programmaticTimerRef.current);
    }
    programmaticTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      programmaticTimerRef.current = null;
    }, 650);

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }, [setProgressWidth]);

  // Native GPU Sticky Scroll-Progress Reader with Hysteresis Buffer (Zero 60fps React Re-renders)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStageFromScroll = () => {
      rafIdRef.current = null;
      if (!sectionRef.current || isProgrammaticScrollRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const stickyViewportHeight = Math.max(320, window.innerHeight - HEADER_OFFSET);
      const scrollableRunway = Math.max(1, rect.height - stickyViewportHeight);
      const scrolledIntoSection = HEADER_OFFSET - rect.top;

      if (scrolledIntoSection <= 0) {
        setProgressWidth(0);
        if (activeStageRef.current !== 0) {
          activeStageRef.current = 0;
          setActiveStage(0);
        }
        return;
      }

      if (scrolledIntoSection >= scrollableRunway) {
        setProgressWidth(1);
        const lastIdx = STAGES.length - 1;
        if (activeStageRef.current !== lastIdx) {
          activeStageRef.current = lastIdx;
          setActiveStage(lastIdx);
        }
        return;
      }

      const rawProgress = Math.max(0, Math.min(0.9999, scrolledIntoSection / scrollableRunway));
      setProgressWidth(rawProgress);

      // Hysteresis deadzone (±0.015) around 0.25, 0.50, 0.75 thresholds so stage transitions never flicker
      const current = activeStageRef.current;
      const candidate = Math.min(STAGES.length - 1, Math.max(0, Math.floor(rawProgress * STAGES.length)));

      if (candidate !== current) {
        const boundary = Math.max(current, candidate) / STAGES.length;
        const distanceToBoundary = Math.abs(rawProgress - boundary);
        if (distanceToBoundary > 0.012 || Math.abs(candidate - current) > 1) {
          activeStageRef.current = candidate;
          setActiveStage(candidate);
        }
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(updateStageFromScroll);
      }
    };

    // Passive wheel observer (kept for test compatibility without interrupting native GPU scroll)
    const handleWheel = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(updateStageFromScroll);
      }
    };

    updateStageFromScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleScroll);
    };
  }, [setProgressWidth]);

  const cur = STAGES[activeStage];
  const isBn = language === 'bn';

  return (
    <section
      ref={sectionRef}
      id="seed-journey"
      className="relative bg-transparent h-[320vh] sm:h-[350vh]"
    >
      {/* Hardware-Accelerated CSS Sticky Pinned Viewport Container — Zero JS scroll-back jitter */}
      <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[540px] flex flex-col justify-center py-2 sm:py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sprout className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রকৃতির রূপান্তর' : 'The Botanical Cycle'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900 tracking-tight leading-tight">
              {isBn ? 'একটি বীজের রূপকথা: বীজ থেকে ফলবান বৃক্ষ' : 'Journey of a Seed: From Grain to Fruiting Tree'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {isBn
                ? 'স্ক্রল করে বা নিচের ধাপে ক্লিক করে প্রত্যক্ষ করুন নতুন জীবনের এই চমৎকার বিকাশ।'
                : 'Scroll down or select any phase below to experience nature unfolding step by step.'}
            </p>

            {/* Interactive 4-Phase Selectors (খাঁটি -> কচি -> ফুল -> ফল গাছ) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 mt-3">
              {STAGES.map((s, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveStage(idx);
                      handleStageClick(idx);
                    }}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#174D35] dark:bg-[#1B3B2E] text-white shadow-md scale-105 border border-[#34D399]/40'
                        : 'bg-white/80 dark:bg-[#0C2018] text-stone-600 dark:text-[#CBD5E1] hover:text-[#174D35] dark:hover:text-[#34D399] hover:bg-stone-100 dark:hover:bg-[#10261E] border border-stone-200/60 dark:border-[#1B3B2E]'
                    }`}
                  >
                    <s.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-stone-400 dark:text-[#8FA89B]'}`} />
                    <span>{isBn ? s.labelBn : s.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Box & Visual Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center bg-white/95 dark:bg-[#0C2018] transform-gpu rounded-3xl p-4 sm:p-6 lg:p-7 border border-[#174D35]/10 dark:border-[#1B3B2E] shadow-lg">
            {/* Visual Canvas Column */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <SeedGrowthVisual stage={activeStage} />
            </div>

            {/* Stage Details Column */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg">
                  {isBn ? cur.badgeBn : cur.badgeEn}
                </span>
                <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 tabular-nums">
                  {activeStage + 1} / {STAGES.length}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif-botanical font-bold text-[#174D35] dark:text-white leading-snug transition-colors duration-300">
                {isBn ? cur.titleBn : cur.titleEn}
              </h3>

              <p className="text-sm sm:text-base text-stone-600 dark:text-[#CBD5E1] leading-relaxed min-h-[4.5rem] sm:min-h-[4.8rem]">
                {isBn ? cur.descBn : cur.descEn}
              </p>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-[#F7F5EC] dark:bg-[#10261E] border border-[#174D35]/10 dark:border-[#1B3B2E] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-[#E2E8F0]">
                  {isBn ? cur.metaBn : cur.metaEn}
                </span>
              </div>

              {/* Stage Progress Dots & Continuous Runway Bar */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center gap-2">
                  {STAGES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={isBn ? s.labelBn : s.labelEn}
                      onClick={() => handleStageClick(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeStage
                          ? 'w-8 bg-[#C5A059]'
                          : idx < activeStage
                          ? 'w-3 bg-[#174D35] dark:bg-[#34D399]/60'
                          : 'w-2 bg-stone-300 dark:bg-stone-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="w-full max-w-[220px] h-1 rounded-full bg-stone-200/70 dark:bg-[#1B3B2E] overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-[#174D35] via-[#34D399] to-[#C5A059] transition-[width] duration-150 ease-out rounded-full"
                    style={{ width: '8%' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => navigate(activeStage === 0 ? '/seeds' : '/plants')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#123e2b] dark:bg-[#1B3B2E] dark:hover:bg-[#234d3c] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <span>{activeStage === 0 ? (isBn ? 'খাঁটি বীজ কিনুন' : 'Explore Seeds') : (isBn ? 'গাছপালা কিনুন' : 'Explore Plants')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
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
      </div>
    </section>
  );
};
