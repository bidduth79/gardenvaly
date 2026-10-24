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
        <div className="relative rounded-3xl overflow-hidden bg-[#174D35] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-[#174D35]/30 group/promo">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#5C8D50]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none" />

          {/* Animated Drifting Botanical Leaves & Fluttering Butterfly (Zero Layout Shift) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden select-none"
          >
            {/* Floating Emerald Leaf 1 */}
            <svg
              viewBox="0 0 36 36"
              className="w-8 h-8 sm:w-10 sm:h-10 absolute top-8 right-12 sm:right-28 opacity-35 animate-leaf-drift-1"
              fill="none"
            >
              <path
                d="M28 6C16 6 8 14 8 26C14 26 24 20 28 6Z"
                fill="#4ADE80"
              />
              <path
                d="M8 26C14 20 20 14 28 6"
                stroke="#A7F3D0"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Floating Golden Leaf 2 */}
            <svg
              viewBox="0 0 36 36"
              className="w-6 h-6 sm:w-8 sm:h-8 absolute bottom-10 right-1/3 opacity-30 animate-leaf-drift-2"
              fill="none"
            >
              <path
                d="M8 8C20 8 28 16 28 28C22 28 12 22 8 8Z"
                fill="#C5A059"
              />
              <path
                d="M28 28C22 22 16 16 8 8"
                stroke="#FDE68A"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>

            {/* Floating Canopy Emblem on Right (Desktop) */}
            <svg
              viewBox="0 0 180 180"
              className="hidden md:block w-44 h-44 lg:w-56 lg:h-56 absolute -right-4 -bottom-6 opacity-18 group-hover/promo:scale-105 transition-transform duration-700"
              fill="none"
            >
              <path
                d="M90 165V85M90 125C65 115 45 95 45 65C70 65 88 85 90 115M90 105C115 95 138 72 138 40C110 42 92 65 90 95"
                stroke="#86EFAC"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="45" cy="65" r="6" fill="#C5A059" />
              <circle cx="138" cy="40" r="7" fill="#4ADE80" />
            </svg>

            {/* Fluttering Golden-Emerald Butterfly */}
            <div className="absolute top-12 sm:top-16 right-8 sm:right-48 animate-butterfly-path">
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md animate-butterfly-wings"
                fill="none"
              >
                {/* Left Wings */}
                <path
                  d="M19 20C12 10 3 11 5 20C6 25 13 24 19 21Z"
                  fill="#C5A059"
                  fillOpacity="0.88"
                />
                <path
                  d="M19 21C13 24 8 30 12 34C15 36 18 30 19 23Z"
                  fill="#4ADE80"
                  fillOpacity="0.85"
                />
                {/* Right Wings */}
                <path
                  d="M21 20C28 10 37 11 35 20C34 25 27 24 21 21Z"
                  fill="#C5A059"
                  fillOpacity="0.88"
                />
                <path
                  d="M21 21C27 24 32 30 28 34C25 36 22 30 21 23Z"
                  fill="#4ADE80"
                  fillOpacity="0.85"
                />
                {/* Body */}
                <line
                  x1="20"
                  y1="15"
                  x2="20"
                  y2="27"
                  stroke="#FEF3C7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
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
