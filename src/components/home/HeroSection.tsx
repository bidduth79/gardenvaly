/**
 * @file HeroSection.tsx
 * @description Cinematic edge-to-edge fullscreen botanical hero carousel with high-legibility
 * text overlays, auto-play with pause-on-hover, interactive navigation controls, next-slide preview,
 * an overlapping floating trust bar, and an organic wave transition into the storefront catalog.
 * Carousel images are centrally managed from the Admin Panel (/admin/banners).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  Leaf,
  Award,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { HeroSlide } from './HeroImageEditorModal';

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'foliage-sanctuary',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1920&q=85',
    titleBn: 'সবুজে সাজুক আপনার আঙিনা ও গৃহকোণ',
    titleEn: 'Nurturing Botanical Elegance for Modern Living',
    subtitleBn: 'ইনডোর ও ব্যালকনি প্ল্যান্ট কালেকশন',
    subtitleEn: 'Curated Indoor & Balcony Foliage',
    altText: 'Gardenvaly botanical living space curated by Hasna Hena',
  },
  {
    id: 'rooftop-blooms',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=1920&q=85',
    titleBn: 'রঙিন ফুলে ভরিয়ে তুলুন আপনার ছাদবাগান',
    titleEn: 'Vibrant Blossoms for Your Terrace Sanctuary',
    subtitleBn: 'দেশি-বিদেশি ফুলের অতুলনীয় সমাহার',
    subtitleEn: 'Exotic & Native Fragrant Blooms',
    altText: 'Vibrant outdoor flowering plants on sunny terrace',
  },
  {
    id: 'organic-seeds',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1920&q=85',
    titleBn: 'উচ্চ ফলনশীল খাঁটি অর্গানিক সবজি ও ফুলের বীজ',
    titleEn: 'Heirloom & Certified Organic Tested Seeds',
    subtitleBn: '৯৮% অঙ্কুরোদগম নিশ্চয়তা',
    subtitleEn: '98% Germination Assurance',
    altText: 'High germination heirloom seeds and organic sprouting',
  },
  {
    id: 'succulents-airplants',
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1920&q=85',
    titleBn: 'সহজ পরিচর্যার এয়ার-পিউরিফাইং গাছ ও সাকুলেন্ট',
    titleEn: 'Air-Purifying Rare Plants & Desert Succulents',
    subtitleBn: 'বাসাবাড়ি ও অফিসের স্নিগ্ধ রূপ',
    subtitleEn: 'Refined Living & Workspace Greenery',
    altText: 'Lush potted air-purifying succulents in terracotta planter',
  },
  {
    id: 'gardening-supplies',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=85',
    titleBn: 'প্রিমিয়াম অর্গানিক সার, মাটির মিক্স ও নার্সারি কিট',
    titleEn: 'Complete Plant Nutrition & Potting Essentials',
    subtitleBn: 'গাছের নিবিড় পুষ্টি ও স্বাস্থ্যকর বিকাশ',
    subtitleEn: 'Professional Organic Garden Care',
    altText: 'Gardenvaly greenhouse and artisanal plant care supplies',
  },
];

const LOCAL_STORAGE_KEY = 'gardenvaly_hero_slides';

export const HeroSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse saved hero slides', e);
      }
    }
    return DEFAULT_HERO_SLIDES;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isBn = language === 'bn';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = useCallback(() => {
    setSlides((current) => {
      const len = current.length || 1;
      setCurrentSlideIndex((prev) => (prev + 1) % len);
      return current;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setSlides((current) => {
      const len = current.length || 1;
      setCurrentSlideIndex((prev) => (prev - 1 + len) % len);
      return current;
    });
  }, []);

  // Sync slides if updated in another tab/admin panel
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated) && updated.length > 0) {
            setSlides(updated);
          }
        } catch (err) {
          console.error('Storage sync error', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Auto-play interval with pause on hover or touch
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch swipe support for mobile viewports
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const safeIndex = currentSlideIndex < slides.length ? currentSlideIndex : 0;
  const currentSlide = slides[safeIndex] || DEFAULT_HERO_SLIDES[0];
  const nextSlidePreview = slides[(safeIndex + 1) % slides.length] || slides[0];

  return (
    <div id="home" className="relative w-full overflow-hidden bg-stone-950">
      {/* ─── FULLSCREEN BOTANICAL CAROUSEL VIEWPORT ─────────────────────── */}
      <section
        className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] lg:h-[84vh] max-h-[820px] flex items-center overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label={isBn ? 'গার্ডেনভ্যালি ফুলস্ক্রিন স্লাইডশো' : 'Gardenvaly Fullscreen Botanical Showcase'}
      >
        {/* Full-bleed background slides */}
        {slides.map((slide, index) => {
          const isActive = index === safeIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.imageUrl}
                alt={slide.altText}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Multi-Directional Scrim Gradient for WCAG AA Text Contrast */}
              {/* Left-to-Right Horizontal Scrim (Deep Botanical Shade for typography) */}
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/20 lg:from-stone-950/90 lg:via-stone-950/60 lg:to-transparent" />

              {/* Bottom-to-Top Vertical Scrim (Ensures bottom controls and mobile readability) */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent" />

              {/* Top Vignette (Soft shadow under the navigation header) */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-stone-950/70 to-transparent" />
            </div>
          );
        })}

        {/* Ambient Botanical Blur Accents on Top of Background */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#5C8D50]/15 blur-3xl pointer-events-none z-15" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-[#174D35]/25 blur-3xl pointer-events-none z-15" />

        {/* ─── FOREGROUND CONTENT OVERLAY ───────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-12 sm:py-16">
          <div className="max-w-2xl text-left space-y-5 sm:space-y-6">
            {/* Brand Signature & Slide Topic Pill */}
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174D35]/80 backdrop-blur-md border border-[#5C8D50]/40 text-[#A3E635] text-xs font-semibold shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-[#5C8D50]" />
                <span>{isBn ? 'গার্ডেনভ্যালি • বাই হাসনাহেনা' : 'Gardenvaly • by Hasna Hena'}</span>
              </span>

              {/* Dynamic current slide theme badge */}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#C5A059] text-xs font-medium">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>{isBn ? currentSlide.subtitleBn : currentSlide.subtitleEn}</span>
              </span>
            </div>

            {/* Botanical Display Headline */}
            <h1 className="text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl font-serif-botanical font-bold text-white tracking-tight leading-[1.16] drop-shadow-lg text-balance">
              {isBn ? currentSlide.titleBn : currentSlide.titleEn}
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-200/90 leading-relaxed font-normal max-w-xl drop-shadow">
              {t('heroSubtitle')}
            </p>

            {/* Live Social Proof Badge - Clickable to Reviews Section */}
            <button
              type="button"
              onClick={() => scrollToSection('reviews')}
              className="group inline-flex items-center gap-3 py-1 cursor-pointer transition-transform hover:scale-[1.02] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
              aria-label="View customer reviews and ratings"
            >
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-stone-900 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-stone-900 object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-stone-900 object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-white ml-1">৪.৯/৫</span>
                </div>
                <p className="text-xs text-stone-300 font-medium group-hover:text-white transition-colors">
                  {isBn ? '১,৫০০+ পরিবারকে সাজিয়েছে গার্ডেনভ্যালি' : '1,500+ happy plant lovers across BD'}
                </p>
              </div>
            </button>

            {/* Storefront Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => scrollToSection('plants')}
                className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all"
              >
                {t('heroCtaPrimary')}
              </Button>
              <button
                type="button"
                onClick={() => scrollToSection('seeds')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-all hover:scale-[1.02] shadow-lg cursor-pointer text-center"
              >
                {t('heroCtaSecondary')}
              </button>
            </div>
          </div>
        </div>

        {/* ─── LATERAL CAROUSEL ARROWS ─────────────────────────────────── */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 right-3 sm:right-6 z-25 flex justify-between pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-[#174D35] text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 shadow-xl cursor-pointer"
            aria-label={isBn ? 'পূর্ববর্তী ছবি' : 'Previous slide'}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-[#174D35] text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 shadow-xl cursor-pointer"
            aria-label={isBn ? 'পরবর্তী ছবি' : 'Next slide'}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* ─── BOTTOM CONTROLS & THUMBNAIL PREVIEW ─────────────────────── */}
        <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-8 right-4 sm:right-8 z-25 flex items-center justify-between pointer-events-none">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 pointer-events-auto bg-black/40 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/20">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === safeIndex
                    ? 'w-7 bg-[#C5A059]'
                    : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`${isBn ? 'ছবি' : 'Slide'} ${idx + 1}`}
              />
            ))}
          </div>

          {/* Right Controls: Play/Pause, Index Counter & Next Slide Preview */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Play / Pause Toggle & Slide Count */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md py-1 px-2.5 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="w-6 h-6 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
                title={isPaused ? (isBn ? 'প্লে করুন' : 'Resume auto-play') : (isBn ? 'পজ করুন' : 'Pause')}
                aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
              >
                {isPaused ? <Play className="w-3 h-3 fill-current ml-0.5" /> : <Pause className="w-3 h-3" />}
              </button>
              <span className="text-[11px] font-semibold text-white/90">
                {safeIndex + 1} / {slides.length}
              </span>
            </div>

            {/* Next Slide Mini Preview Card */}
            <button
              type="button"
              onClick={nextSlide}
              className="hidden md:flex items-center gap-2.5 bg-black/45 hover:bg-black/65 backdrop-blur-md p-1.5 pr-3 rounded-2xl border border-white/20 cursor-pointer transition-all hover:scale-105 shadow-xl group/thumb"
              title={isBn ? 'পরবর্তী ছবিতে যান' : 'Go to next slide'}
              aria-label={isBn ? 'পরবর্তী ছবিতে যান' : 'Go to next slide'}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/30 shrink-0">
                <img
                  src={nextSlidePreview.imageUrl}
                  alt={nextSlidePreview.altText}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-left text-xs">
                <span className="text-[10px] uppercase font-bold text-[#C5A059] block">
                  {isBn ? 'পরবর্তী' : 'Next'}
                </span>
                <span className="text-white/90 font-medium truncate max-w-[120px] block">
                  {isBn ? nextSlidePreview.subtitleBn : nextSlidePreview.subtitleEn}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM BACKGROUND & TRANSITION SECTION ─────────────────────── */}
      {/* 
        This section sits right under the fullscreen hero, solving "নিচের ব্যাকগ্রাউন্ডটা কি করা যায়?":
        1. Overlapping Floating Botanical Trust Bar (-mt-10 sm:-mt-14)
        2. Soft botanical natural canvas with an organic wave SVG divider leading into ShopByCategory
      */}
      <div className="relative bg-gradient-to-b from-stone-900 via-stone-100 to-[#FAF9F6] pt-0 pb-6">
        {/* Floating Trust Metric Bar (Bridging the Hero Seam) */}
        <div className="-mt-10 sm:-mt-12 relative z-30 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/70">
            {/* Guarantee 1: 100% Healthy Plants */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-2">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 text-[#174D35] shadow-xs">
                <CheckCircle className="w-6 h-6 text-[#174D35]" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                  {isBn ? '১০০% সুস্থ ও সতেজ গাছ' : '100% Healthy & Fresh'}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isBn ? 'নার্সারি থেকে নিবিড় যত্নে সুরক্ষিত ডেলিভারি' : 'Hand-curated & safely delivered across BD'}
                </p>
              </div>
            </div>

            {/* Guarantee 2: Heirloom Organic Seeds */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0 text-amber-700 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                  {isBn ? 'পরীক্ষিত খাঁটি অর্গানিক বীজ' : 'Tested Organic Seeds'}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isBn ? '৯৮% অঙ্কুরোদগম নিশ্চয়তা ও উচ্চ ফলন' : '98% germination rate & heirloom varieties'}
                </p>
              </div>
            </div>

            {/* Guarantee 3: Horticultural Care & Guidance */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center shrink-0 text-[#174D35] shadow-xs">
                <HeartHandshake className="w-6 h-6 text-[#174D35]" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                  {isBn ? 'হাসনাহেনার সার্বক্ষণিক পরামর্শ' : 'Expert Horticultural Care'}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isBn ? 'গাছ লালন-পালনের সার্বক্ষণিক গাইডলাইন' : 'Personal care tips from Hasna Hena'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Curved Wave Transition into Storefront */}
        <div className="w-full overflow-hidden leading-none text-[#FAF9F6] mt-4">
          <svg
            className="w-full h-8 sm:h-12 block"
            viewBox="0 0 1440 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C320,55 640,74 960,60 C1200,48 1360,18 1440,0 L1440,74 L0,74 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
