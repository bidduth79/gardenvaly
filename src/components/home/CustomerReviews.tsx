/**
 * @file CustomerReviews.tsx
 * @description Customer testimonials with clear demonstration label.
 */

import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, Info } from 'lucide-react';
import { reviewService, REVIEWS_UPDATED_EVENT } from '../../services/reviewService';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumeral } from '../../utils/formatters';

export const CustomerReviews: React.FC = () => {
  const { language, t } = useLanguage();
  const [reviews, setReviews] = useState(() => reviewService.getReviews());

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

  return (
    <section id="reviews" className="py-14 sm:py-18 bg-[#F7F5EC]/50 border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <MessageSquareQuote className="w-4 h-4" />
            <span>{t('communityStories')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-stone-900">
            {t('reviewsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {t('reviewsSubtitle')}
          </p>

          {/* Transparent demo label */}
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-stone-500 bg-white/70 px-3 py-1 rounded-full border border-stone-200">
            <Info className="w-3.5 h-3.5 text-[#5C8D50]" />
            <span>{t('reviewsDemoNotice')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => {
            const author = language === 'bn' ? rev.authorBn : rev.authorEn;
            const location = language === 'bn' ? rev.locationBn : rev.locationEn;
            const comment = language === 'bn' ? rev.commentBn : rev.commentEn;
            const date = language === 'bn' ? rev.dateBn : rev.dateEn;

            return (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                    "{comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                  <img
                    src={rev.avatarUrl}
                    alt={author}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">{author}</h4>
                    <p className="text-[11px] text-stone-500">
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
