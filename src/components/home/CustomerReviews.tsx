/**
 * @file CustomerReviews.tsx
 * @description Customer testimonials featuring DesignMingle-inspired interactive
 * avatar face rotator (.ov-faces + .ov-quote, 6s auto-cycle + hover/click)
 * and the full review cards grid.
 */

import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, Info, Quote } from 'lucide-react';
import { reviewService, REVIEWS_UPDATED_EVENT } from '../../services/reviewService';
import { useLanguage } from '../../context/LanguageContext';

export const CustomerReviews: React.FC = () => {
  const { language, t } = useLanguage();
  const [reviews, setReviews] = useState(() => reviewService.getReviews());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setReviews(reviewService.getReviews());
    };
    window.addEventListener(REVIEWS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // DesignMingle 6s Auto-Rotating Testimonial Spotlight
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  const safeActiveIdx = activeIndex < reviews.length ? activeIndex : 0;
  const activeReview = reviews[safeActiveIdx];

  return (
    <section id="reviews" className="scroll-mt-20 pt-16 pb-6 sm:pt-20 sm:pb-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ov-rv text-center max-w-2xl mx-auto mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-1">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t('communityStories')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif-botanical font-bold text-stone-900 dark:text-white">
            {t('reviewsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-[#CBD5E1] mt-1">
            {t('reviewsSubtitle')}
          </p>

          {/* Transparent demo label */}
          <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-500 dark:text-[#9CB5A7] bg-white/70 dark:bg-[#0C2018] px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-[#1B3B2E]">
            <Info className="w-3 h-3 text-[#5C8D50]" />
            <span>{t('reviewsDemoNotice')}</span>
          </div>
        </div>

        {/* ─── DESIGNMINGLE INTERACTIVE FACES ROTATOR (.ov-faces + .ov-quote) ─── */}
        {activeReview && (
          <div
            className="ov-rv max-w-4xl mx-auto mb-5 sm:mb-6 bg-white dark:bg-[#0C2018] rounded-2xl sm:rounded-[24px] p-4 sm:p-5 border border-stone-200/85 dark:border-[#1B3B2E] shadow-md text-center relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Quote className="w-7 h-7 text-[#174D35]/15 dark:text-[#4ADE80]/15 mx-auto mb-1.5" />

            {/* Interactive Customer Avatar Faces Row */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-3.5 flex-wrap">
              {reviews.map((rev, idx) => {
                const isSelected = idx === safeActiveIdx;
                const name = language === 'bn' ? rev.authorBn : rev.authorEn;
                return (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`relative rounded-full p-0.5 transition-all duration-300 cursor-pointer focus:outline-none ${
                      isSelected
                        ? 'scale-110 ring-2 ring-[#22C55E] shadow-sm'
                        : 'opacity-55 hover:opacity-90 hover:scale-105'
                    }`}
                    title={name}
                    aria-label={name}
                  >
                    <img
                      src={rev.avatarUrl}
                      alt={name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Spotlight Quote (.ov-quote) */}
            <div key={activeReview.id} className="animate-fade-up-1 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
                {[...Array(activeReview.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <blockquote className="text-sm sm:text-base font-serif-botanical font-semibold text-stone-900 dark:text-white leading-snug italic">
                "{language === 'bn' ? activeReview.commentBn : activeReview.commentEn}"
              </blockquote>

              <div className="mt-2.5">
                <p className="text-xs sm:text-sm font-bold text-[#174D35] dark:text-[#4ADE80]">
                  {language === 'bn' ? activeReview.authorBn : activeReview.authorEn}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-[#9CB5A7]">
                  {language === 'bn' ? activeReview.locationBn : activeReview.locationEn} ·{' '}
                  {language === 'bn' ? activeReview.dateBn : activeReview.dateEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Full Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {reviews.map((rev, idx) => {
            const author = language === 'bn' ? rev.authorBn : rev.authorEn;
            const location = language === 'bn' ? rev.locationBn : rev.locationEn;
            const comment = language === 'bn' ? rev.commentBn : rev.commentEn;
            const date = language === 'bn' ? rev.dateBn : rev.dateEn;
            const isActiveCard = idx === safeActiveIdx;

            return (
              <div
                key={rev.id}
                onClick={() => setActiveIndex(idx)}
                className={`ov-rv bg-white dark:bg-[#0C2018] p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActiveCard
                    ? 'border-[#22C55E] shadow-md'
                    : 'border-stone-200/80 dark:border-[#1B3B2E] shadow-xs hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-[13px] text-stone-700 dark:text-stone-200 leading-relaxed italic">
                    "{comment}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-[#1B3B2E] flex items-center gap-2.5">
                  <img
                    src={rev.avatarUrl}
                    alt={author}
                    className="w-9 h-9 rounded-full object-cover border border-stone-200 dark:border-[#1B3B2E]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">{author}</h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-[#9CB5A7]">
                      {location} · {date}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
