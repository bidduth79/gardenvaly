/**
 * @file GardeningTips.tsx
 * @description Gardening wisdom and care guides section by Hasna Hena.
 * Features a full-viewport-aligned section (#tips), left/right horizontal carousel with navigation arrows,
 * and a Full-Page Editorial Document Reader when clicking "বিস্তারিত পড়ুন".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Calendar,
  Printer,
  Share2,
  Sprout,
} from 'lucide-react';
import { GardenTip } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { guideService, GUIDES_UPDATED_EVENT } from '../../services/guideService';
import { DEFAULT_FALLBACK_IMAGE, handleImageError } from '../../utils/imageFallback';
import { formatNumeral } from '../../utils/formatters';

export const GardeningTips: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [guides, setGuides] = useState<GardenTip[]>(() => guideService.getGuides());
  const [selectedTip, setSelectedTip] = useState<GardenTip | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const documentContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync with guideService when Admin updates guides
  useEffect(() => {
    const refreshGuides = () => {
      setGuides(guideService.getGuides());
    };
    window.addEventListener(GUIDES_UPDATED_EVENT, refreshGuides);
    window.addEventListener('storage', refreshGuides);
    return () => {
      window.removeEventListener(GUIDES_UPDATED_EVENT, refreshGuides);
      window.removeEventListener('storage', refreshGuides);
    };
  }, []);

  // Update left/right arrow states based on horizontal scroll position
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);

    // Estimate active card index
    const firstCard = el.querySelector('article');
    if (firstCard) {
      const cardWidth = firstCard.getBoundingClientRect().width + 24; // 24px gap
      const idx = Math.round(scrollLeft / Math.max(1, cardWidth));
      setActiveIndex(Math.min(guides.length - 1, Math.max(0, idx)));
    }
  }, [guides.length]);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons, guides]);

  // Lock body scroll when full-page document is open & support Escape key
  useEffect(() => {
    if (selectedTip) {
      document.body.style.overflow = 'hidden';
      if (documentContainerRef.current) {
        documentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedTip]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTip) {
        setSelectedTip(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTip]);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.querySelector('article');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 24 : 380;
    const offset = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.querySelector('article');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 24 : 380;
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  const handleShareGuide = async (tip: GardenTip) => {
    const title = isBn ? tip.titleBn : tip.titleEn;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} — Gardenvaly`,
          text: isBn ? tip.excerptBn : tip.excerptEn,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 2500);
      }
    } catch {
      // Ignore share cancellation
    }
  };

  return (
    <section
      id="tips"
      className="scroll-mt-16 sm:scroll-mt-20 min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:py-16 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C8D50] mb-2 animate-fade-up-1">
            <BookOpen className="w-4 h-4" />
            <span>{t('horticulturalWisdom')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900 animate-fade-up-2">
            {t('gardeningTipsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 animate-fade-up-3">
            {t('gardeningTipsSubtitle')}
          </p>
        </div>

        {/* Carousel Wrapper with Left & Right Navigation Arrows */}
        <div className="relative group/carousel">
          {/* Left Floating Arrow Button */}
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            disabled={!canScrollLeft}
            aria-label={isBn ? 'বামে স্ক্রল করুন' : 'Scroll left'}
            className={`hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border shadow-xl transition-all duration-200 ${
              canScrollLeft
                ? 'bg-white dark:bg-[#0E241B] text-[#174D35] dark:text-[#34D399] border-stone-200 dark:border-[#1B3B2E] hover:bg-[#174D35] hover:text-white dark:hover:bg-[#34D399] dark:hover:text-[#06120D] hover:scale-105 cursor-pointer opacity-95'
                : 'bg-stone-100/60 dark:bg-[#0C2018]/50 text-stone-300 dark:text-stone-600 border-stone-200/50 dark:border-[#1B3B2E]/40 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Floating Arrow Button */}
          <button
            type="button"
            onClick={() => scrollByCard('right')}
            disabled={!canScrollRight}
            aria-label={isBn ? 'ডানে স্ক্রল করুন' : 'Scroll right'}
            className={`hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border shadow-xl transition-all duration-200 ${
              canScrollRight
                ? 'bg-white dark:bg-[#0E241B] text-[#174D35] dark:text-[#34D399] border-stone-200 dark:border-[#1B3B2E] hover:bg-[#174D35] hover:text-white dark:hover:bg-[#34D399] dark:hover:text-[#06120D] hover:scale-105 cursor-pointer opacity-95'
                : 'bg-stone-100/60 dark:bg-[#0C2018]/50 text-stone-300 dark:text-stone-600 border-stone-200/50 dark:border-[#1B3B2E]/40 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Horizontal Scrollable Track */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollButtons}
            className="flex items-stretch gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2 px-0.5"
          >
            {guides.map((tip) => {
              const title = isBn ? tip.titleBn : tip.titleEn;
              const excerpt = isBn ? tip.excerptBn : tip.excerptEn;
              const readTime = isBn ? tip.readTimeBn : tip.readTimeEn;
              const category = isBn ? tip.categoryBn : tip.categoryEn;

              return (
                <article
                  key={tip.id}
                  onClick={() => setSelectedTip(tip)}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start bg-white dark:bg-[#0C2018] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-[#1B3B2E] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer group/card"
                >
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100 dark:bg-[#10261E]">
                    <img
                      src={tip.imageUrl || DEFAULT_FALLBACK_IMAGE}
                      alt={title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#174D35]/95 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs border border-white/15">
                      {category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{readTime}</span>
                      </div>

                      <h3 className="font-serif-botanical font-bold text-lg text-stone-900 group-hover/card:text-[#174D35] dark:group-hover/card:text-[#34D399] transition-colors line-clamp-2 leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                        {excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 dark:border-[#1B3B2E] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTip(tip);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#174D35] dark:text-[#34D399] hover:text-[#5C8D50] transition-colors cursor-pointer"
                      >
                        <span>{t('readMore')}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
                      </button>

                      <span className="text-[11px] text-stone-400 font-medium">
                        {isBn ? 'ফুল ডকুমেন্ট' : 'Full Guide'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Carousel Navigation Bar (Dots + Left/Right Buttons for Mobile & Desktop) */}
          {guides.length > 1 && (
            <div className="mt-6 flex items-center justify-between sm:justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollByCard('left')}
                disabled={!canScrollLeft}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  canScrollLeft
                    ? 'bg-white dark:bg-[#0C2018] text-stone-800 dark:text-stone-200 border-stone-200 dark:border-[#1B3B2E] hover:border-[#174D35] cursor-pointer shadow-2xs'
                    : 'bg-stone-100/50 dark:bg-[#0C2018]/40 text-stone-400 dark:text-stone-600 border-stone-200/40 dark:border-[#1B3B2E]/40 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isBn ? 'পূর্ববর্তী' : 'Prev'}</span>
              </button>

              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {guides.map((g, idx) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    aria-label={`${isBn ? 'নির্দেশিকা' : 'Guide'} ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex
                        ? 'w-6 bg-[#174D35] dark:bg-[#34D399]'
                        : 'w-2 bg-stone-300 dark:bg-[#1B3B2E] hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollByCard('right')}
                disabled={!canScrollRight}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  canScrollRight
                    ? 'bg-white dark:bg-[#0C2018] text-stone-800 dark:text-stone-200 border-stone-200 dark:border-[#1B3B2E] hover:border-[#174D35] cursor-pointer shadow-2xs'
                    : 'bg-stone-100/50 dark:bg-[#0C2018]/40 text-stone-400 dark:text-stone-600 border-stone-200/40 dark:border-[#1B3B2E]/40 cursor-not-allowed opacity-50'
                }`}
              >
                <span>{isBn ? 'পরবর্তী' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── FULL-PAGE EDITORIAL DOCUMENT READER ─────────────────────────── */}
      {selectedTip &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={documentContainerRef}
            role="dialog"
            aria-modal="true"
            aria-label={isBn ? selectedTip.titleBn : selectedTip.titleEn}
            className="fixed inset-0 z-[100] bg-[#F7F5EC] dark:bg-[#06120D] text-stone-900 dark:text-stone-100 overflow-y-auto animate-fade-up-1"
          >
            {/* Sticky Document Top Toolbar */}
            <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0C2018]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-[#1B3B2E] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTip(null)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-[#10261E] hover:bg-[#174D35] hover:text-white dark:hover:bg-[#34D399] dark:hover:text-[#06120D] text-stone-800 dark:text-stone-100 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isBn ? 'বাগান নির্দেশিকায় ফিরে যান' : 'Back to Gardening Guides'}</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleShareGuide(selectedTip)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-[#1B3B2E] bg-white dark:bg-[#10261E] text-xs font-semibold text-stone-700 dark:text-stone-200 hover:border-[#174D35] transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>
                      {copiedNotice
                        ? isBn
                          ? 'লিংক কপি হয়েছে!'
                          : 'Link Copied!'
                        : isBn
                        ? 'শেয়ার করুন'
                        : 'Share'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#174D35] text-white text-xs font-semibold hover:bg-[#123c29] transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isBn ? 'প্রিন্ট / PDF' : 'Print Guide'}</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Main Full-Page Document Container */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <article className="bg-white dark:bg-[#0C2018] rounded-3xl border border-stone-200/90 dark:border-[#1B3B2E] shadow-xl overflow-hidden">
                {/* Document Hero Cover Banner */}
                <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-stone-900">
                  <img
                    src={selectedTip.imageUrl || DEFAULT_FALLBACK_IMAGE}
                    alt={isBn ? selectedTip.titleBn : selectedTip.titleEn}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mb-3">
                      <span className="px-3 py-1 rounded-full bg-[#5C8D50] text-white">
                        {isBn ? selectedTip.categoryBn : selectedTip.categoryEn}
                      </span>
                      <span className="inline-flex items-center gap-1 text-stone-200">
                        <Clock className="w-3.5 h-3.5" />
                        {isBn ? selectedTip.readTimeBn : selectedTip.readTimeEn}
                      </span>
                      {selectedTip.publishedDate && (
                        <span className="inline-flex items-center gap-1 text-stone-300">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatNumeral(selectedTip.publishedDate, language)}
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-botanical font-bold text-white leading-tight">
                      {isBn ? selectedTip.titleBn : selectedTip.titleEn}
                    </h1>
                  </div>
                </div>

                {/* Author & Editorial Metadata Bar */}
                <div className="px-6 sm:px-10 py-5 bg-stone-50 dark:bg-[#10261E] border-b border-stone-200/80 dark:border-[#1B3B2E] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#174D35] text-white flex items-center justify-center font-bold">
                      <Sprout className="w-5 h-5 text-[#A3E635]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-stone-900">
                        {isBn ? 'হাসনাহেনা (Hasna Hena)' : 'Hasna Hena'}
                      </p>
                      <p className="text-[11px] sm:text-xs text-stone-500">
                        {isBn
                          ? 'প্রতিষ্ঠাতা ও প্রধান উদ্যানতত্ত্ব পরামর্শক • গার্ডেনভ্যালি'
                          : 'Founder & Chief Horticultural Advisor • Gardenvaly'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#174D35] dark:text-[#34D399]">
                    {isBn ? '📖 সম্পূর্ণ বাগান পরিচর্যা ডকুমেন্ট' : '📖 Complete Botanical Care Document'}
                  </span>
                </div>

                {/* Document Body Content */}
                <div className="p-6 sm:p-10 space-y-8">
                  {/* Executive Summary Lead Box */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-[#10261E] border-l-4 border-[#174D35] dark:border-[#34D399]">
                    <p className="text-sm sm:text-base font-medium text-stone-800 dark:text-stone-200 leading-relaxed">
                      {isBn ? selectedTip.excerptBn : selectedTip.excerptEn}
                    </p>
                  </div>

                  {/* Detailed Editorial Paragraphs */}
                  <div className="space-y-4 text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                    {((isBn ? selectedTip.contentBn : selectedTip.contentEn) ||
                      (isBn ? selectedTip.excerptBn : selectedTip.excerptEn))
                      .split('\n\n')
                      .map((paragraph, pIdx) => (
                        <p key={pIdx} className="leading-8">
                          {paragraph}
                        </p>
                      ))}
                  </div>

                  {/* Step-by-Step Care Instructions */}
                  {((isBn ? selectedTip.stepsBn : selectedTip.stepsEn) || []).length > 0 && (
                    <div className="pt-4">
                      <h2 className="text-xl sm:text-2xl font-serif-botanical font-bold text-stone-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-[#174D35] dark:text-[#34D399]" />
                        <span>
                          {isBn
                            ? 'ধাপে ধাপে করণীয় নির্দেশিকা (Step-by-Step Guide)'
                            : 'Step-by-Step Care Instructions'}
                        </span>
                      </h2>

                      <div className="grid grid-cols-1 gap-3.5">
                        {((isBn ? selectedTip.stepsBn : selectedTip.stepsEn) || []).map(
                          (step, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 dark:bg-[#10261E] border border-stone-200/70 dark:border-[#1B3B2E]"
                            >
                              <span className="w-7 h-7 rounded-full bg-[#174D35] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {formatNumeral(idx + 1, language)}
                              </span>
                              <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                                {step}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hasna Hena's Special Pro Tip Callout */}
                  {(isBn ? selectedTip.proTipBn : selectedTip.proTipEn) && (
                    <div className="p-6 rounded-2xl bg-amber-50/90 dark:bg-[#10261E] border border-amber-200/80 dark:border-[#1B3B2E] flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                          {isBn ? 'হাসনাহেনার বিশেষ পরামর্শ (Expert Pro Tip)' : "Hasna Hena's Pro Tip"}
                        </h3>
                        <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                          {isBn ? selectedTip.proTipBn : selectedTip.proTipEn}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer of the Full-Page Document with Other Guides */}
                <div className="px-6 sm:px-10 py-8 bg-stone-50 dark:bg-[#10261E] border-t border-stone-200/80 dark:border-[#1B3B2E]">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base sm:text-lg font-serif-botanical font-bold text-stone-900">
                      {isBn ? 'অন্যান্য বাগান নির্দেশিকা পড়ুন' : 'Explore More Gardening Guides'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedTip(null)}
                      className="text-xs sm:text-sm font-bold text-[#174D35] dark:text-[#34D399] hover:underline cursor-pointer"
                    >
                      {isBn ? 'সবগুলো দেখুন →' : 'View All →'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guides
                      .filter((g) => g.id !== selectedTip.id)
                      .slice(0, 2)
                      .map((other) => (
                        <button
                          key={other.id}
                          type="button"
                          onClick={() => setSelectedTip(other)}
                          className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-[#0C2018] border border-stone-200/80 dark:border-[#1B3B2E] hover:border-[#174D35] transition-all text-left cursor-pointer group/other"
                        >
                          <img
                            src={other.imageUrl || DEFAULT_FALLBACK_IMAGE}
                            alt={isBn ? other.titleBn : other.titleEn}
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-[#5C8D50] uppercase">
                              {isBn ? other.categoryBn : other.categoryEn}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover/other:text-[#174D35] dark:group-hover/other:text-[#34D399] line-clamp-2 mt-0.5">
                              {isBn ? other.titleBn : other.titleEn}
                            </h4>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </article>
            </main>
          </div>,
          document.body
        )}
    </section>
  );
};
