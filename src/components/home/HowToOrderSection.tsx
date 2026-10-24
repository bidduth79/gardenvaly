/**
 * @file HowToOrderSection.tsx
 * @description DesignMingle-inspired "How to Order" (কিভাবে অর্ডার করবেন) 4-Step Auto-Advancing
 * Carousel with animated segment progress bars (.ov-segs), 3D pointer-tilt visual card (--rx, --ry),
 * circular prev/next navigation controls (.ov-nav), and a scroll-lit Point-of-View statement (.ov-pov).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  ShoppingBag,
  MessageCircle,
  Truck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';

interface OrderStep {
  number: string;
  numberBn: string;
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  highlightsBn: string[];
  highlightsEn: string[];
  ctaBn: string;
  ctaEn: string;
  ctaHref: string;
  imageUrl: string;
  icon: React.FC<{ className?: string }>;
}

const ORDER_STEPS: OrderStep[] = [
  {
    number: '01',
    numberBn: '০১',
    badgeBn: 'ধাপ ১ • বাছাই করুন',
    badgeEn: 'Step 1 • Browse & Select',
    titleBn: 'পছন্দের গাছ, ফুল বা অর্গানিক বীজ বেছে নিন',
    titleEn: 'Choose Your Favorite Plants, Blooms or Organic Seeds',
    descBn:
      'ইনডোর প্ল্যান্ট, ছাদবাগানের ফলের কলম চারা, দেশি-বিদেশি ফুল অথবা ৯৮% অঙ্কুরোদগম নিশ্চিত অর্গানিক বীজের ক্যাটালগ থেকে আপনার পছন্দেরটি নির্বাচন করুন।',
    descEn:
      'Explore our curated indoor foliage, grafted fruit saplings, fragrant blooms, or 98% germination-tested heirloom seeds.',
    highlightsBn: [
      'আলো ও জায়গা অনুযায়ী সহজ ফিল্টার',
      'প্রতিটি গাছের বিস্তারিত পরিচর্যা তথ্য',
      '১০০% সুস্থ ও নার্সারি-গ্রেড চারা',
    ],
    highlightsEn: [
      'Filter by light & indoor/outdoor space',
      'Detailed care instructions on every plant',
      '100% healthy nursery-grade saplings',
    ],
    ctaBn: 'গাছপালা দেখুন',
    ctaEn: 'Explore Plants',
    ctaHref: '/plants',
    imageUrl:
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1000&q=80',
    icon: Search,
  },
  {
    number: '02',
    numberBn: '০২',
    badgeBn: 'ধাপ ২ • কার্ট ও ঠিকানা',
    badgeEn: 'Step 2 • Cart & Address',
    titleBn: 'কার্টে যোগ করে আপনার নাম ও ডেলিভারি ঠিকানা দিন',
    titleEn: 'Add to Cart & Enter Your Delivery Details',
    descBn:
      'পছন্দের চারা বা বীজগুলো কার্টে যোগ করুন। এরপর চেকআউট পেইজে আপনার নাম, মোবাইল নাম্বার এবং জেলা-উপজেলার পূর্ণ ঠিকানা লিখুন।',
    descEn:
      'Add your selected items to the cart and provide your name, phone number, and full delivery address at checkout.',
    highlightsBn: [
      'ক্যাশ অন ডেলিভারি ও বিকাশ/নগদ সুবিধা',
      'কুপন কোড ব্যবহারে তাৎক্ষণিক ডিসকাউন্ট',
      'কোনো অ্যাকাউন্ট ছাড়াই দ্রুত অর্ডার সুবিধা',
    ],
    highlightsEn: [
      'Cash on Delivery & bKash/Nagad support',
      'Instant coupon code discounts',
      'Fast guest checkout without hassle',
    ],
    ctaBn: 'বীজ ক্যাটালগ দেখুন',
    ctaEn: 'Browse Seeds',
    ctaHref: '/seeds',
    imageUrl:
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1000&q=80',
    icon: ShoppingBag,
  },
  {
    number: '03',
    numberBn: '০৩',
    badgeBn: 'ধাপ ৩ • অর্ডার কনফার্মেশন',
    badgeEn: 'Step 3 • Instant Confirmation',
    titleBn: 'অনলাইনে বা সরাসরি হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন',
    titleEn: 'Confirm Online or Directly via WhatsApp',
    descBn:
      'ওয়েবসাইটে এক ক্লিকে অর্ডার সম্পন্ন করুন অথবা সরাসরি আমাদের হোয়াটসঅ্যাপে মেসেজ পাঠিয়ে অর্ডার কনফার্ম ও ট্র্যাকিং আইডি বুঝে নিন।',
    descEn:
      'Place your order directly on the website or confirm via WhatsApp to receive your live order tracking ID immediately.',
    highlightsBn: [
      'তাৎক্ষণিক অর্ডার ট্র্যাকিং আইডি প্রদান',
      'হাসনাহেনার টিমের সরাসরি বাগান পরামর্শ',
      'প্যাকিংয়ের আগে চারার রিয়েল ছবি দেখার সুবিধা',
    ],
    highlightsEn: [
      'Instant live Order Tracking ID',
      'Direct horticultural advice from our team',
      'Option to preview sapling photos before dispatch',
    ],
    ctaBn: 'অর্ডার ট্র্যাক করুন',
    ctaEn: 'Track an Order',
    ctaHref: '/track-order',
    imageUrl:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80',
    icon: MessageCircle,
  },
  {
    number: '04',
    numberBn: '০৪',
    badgeBn: 'ধাপ ৪ • নিরাপদ হোম ডেলিভারি',
    badgeEn: 'Step 4 • Safe Home Delivery',
    titleBn: 'বিশেষ নার্সারি বক্সে সতেজ চারা পৌঁছে যাবে আপনার দরজায়',
    titleEn: 'Fresh Plants Delivered Safely in Breathable Nursery Boxes',
    descBn:
      'চারা যেন দীর্ঘ পথেও সতেজ ও অক্ষত থাকে, সেজন্য বিশেষ ভেন্টিলেটেড বক্স ও কোকোপিট ময়েশ্চার প্যাকিংয়ে সারাদেশে ৬৪ জেলায় পৌঁছে দেওয়া হয়।',
    descEn:
      'Packed in custom ventilated boxes with moisture-retaining cocopeat so your plants arrive vibrant and healthy across all 64 districts.',
    highlightsBn: [
      'সারাদেশে ৬৪ জেলায় দ্রুত হোম ডেলিভারি',
      'যাত্রাপথে চারা ক্ষতিগ্রস্ত হলে রিপ্লেসমেন্ট সুবিধা',
      'ডেলিভারির পরেও ফ্রি পরিচর্যা গাইডলাইন',
    ],
    highlightsEn: [
      'Fast delivery across all 64 districts of BD',
      'Free replacement guarantee for transit damage',
      'Post-delivery plant care guidance',
    ],
    ctaBn: 'বাগান সরঞ্জাম দেখুন',
    ctaEn: 'Shop Supplies',
    ctaHref: '/supplies',
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    icon: Truck,
  },
];

export const HowToOrderSection: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useRouter();
  const isBn = language === 'bn';

  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [litWordCount, setLitWordCount] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const povRef = useRef<HTMLParagraphElement | null>(null);
  const tiltFrameRef = useRef<HTMLDivElement | null>(null);

  const povTextBn =
    'একটি ছোট চারা আজ আপনার বারান্দা রাঙাবে, আগামীকাল গড়বে স্নিগ্ধ সবুজ পৃথিবী — নার্সারি থেকে পরম যত্নে প্রতিটি গাছ পৌঁছে যায় আপনার প্রিয় গৃহকোণে।';
  const povTextEn =
    'A single sapling brightens your balcony today and nurtures a greener tomorrow — hand-selected at our nursery and delivered safely to your home.';

  const words = (isBn ? povTextBn : povTextEn).split(' ');

  // Observe whether HowToOrderSection is visible in the viewport so off-screen timers never mutate DOM or shift scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsSectionInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSectionInView(entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 1. DesignMingle Scroll-Lit Point-of-View Statement (.ov-pov .state)
  useEffect(() => {
    const updateScrollLit = () => {
      const el = povRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.86 - rect.top) / (rect.height + vh * 0.36)));
      setLitWordCount(Math.round(progress * words.length));
    };

    window.addEventListener('scroll', updateScrollLit, { passive: true });
    updateScrollLit();
    return () => window.removeEventListener('scroll', updateScrollLit);
  }, [words.length]);

  // 2. DesignMingle 4.2s Auto-Advancing Step Carousel (Only runs when section is in view)
  useEffect(() => {
    if (isPaused || !isSectionInView) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ORDER_STEPS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPaused, isSectionInView, activeStep]);

  // 3. DesignMingle 3D Pointer-Tilt Effect (--rx, --ry)
  const handleFrameMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltFrameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ry = (((e.clientX - rect.left) / rect.width - 0.5) * 10).toFixed(2);
    const rx = ((0.5 - (e.clientY - rect.top) / rect.height) * 10).toFixed(2);
    el.style.setProperty('--ry', `${ry}deg`);
    el.style.setProperty('--rx', `${rx}deg`);
  };

  const handleFrameMouseLeave = () => {
    const el = tiltFrameRef.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  const step = ORDER_STEPS[activeStep];
  const StepIcon = step.icon;

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 bg-transparent overflow-hidden" style={{ overflowAnchor: 'none' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-18">
        {/* ─── PART A: DESIGNMINGLE SCROLL-LIT POINT-OF-VIEW STATEMENT (.ov-pov) ─── */}
        <div className="max-w-4xl mx-auto text-center px-2">
          <div className="ov-rv inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#174D35]/10 dark:bg-[#153427] text-[#174D35] dark:text-[#34D399] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'গার্ডেনভ্যালির অঙ্গীকার' : 'Our Botanical Philosophy'}</span>
          </div>

          <p
            ref={povRef}
            className="text-xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold leading-[1.38] tracking-tight text-stone-900 dark:text-white"
          >
            {words.map((word, idx) => {
              const isLit = idx < litWordCount;
              const isAccent =
                word.includes('সবুজ') ||
                word.includes('পৃথিবী') ||
                word.includes('গৃহকোণে।') ||
                word.includes('greener') ||
                word.includes('tomorrow') ||
                word.includes('home.');
              return (
                <span
                  key={idx}
                  className={`ov-pov-word inline-block mr-[0.28em] ${isLit ? 'lit' : ''} ${
                    isAccent ? 'text-[#174D35] dark:text-[#4ADE80]' : ''
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>

        {/* ─── PART B: DESIGNMINGLE 4 SIMPLE STEPS CAROUSEL (কিভাবে অর্ডার করবেন) ─── */}
        <div
          className="ov-rv relative rounded-[32px] bg-[#121F18] dark:bg-[#091812] text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-[#174D35]/40 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#22C55E]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none" />

          {/* Top Bar: Section Title + 4-Segment Progress Indicator (.ov-segs) + Prev/Next Buttons */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4ADE80] mb-2">
                <span>{isBn ? '৪টি সহজ ধাপ' : '4 Simple Steps'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <span>{isBn ? 'সহজ অর্ডার প্রক্রিয়া' : 'Seamless Ordering'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-botanical font-bold text-white">
                {isBn ? 'কিভাবে অর্ডার করবেন?' : 'How to Order Your Plants'}
              </h2>
            </div>

            {/* DesignMingle .ov-segs Progress Bar + Circular Prev/Next Buttons */}
            <div className="flex items-center gap-5 self-start md:self-auto">
              {/* 4 Animated Progress Segments */}
              <div className="flex items-center gap-2 w-44 sm:w-56" role="tablist" aria-label="Order steps progress">
                {ORDER_STEPS.map((s, idx) => {
                  const isCurrent = idx === activeStep;
                  const isDone = idx < activeStep;
                  return (
                    <button
                      key={s.number}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Step ${s.number}`}
                      onClick={() => setActiveStep(idx)}
                      className="flex-1 py-2 cursor-pointer group focus:outline-none"
                    >
                      <i
                        key={`${idx}-${activeStep}-${isPaused ? 'paused' : 'run'}`}
                        className={`ov-seg-bar block h-1.5 rounded-full transition-colors ${
                          isDone
                            ? 'bg-[#4ADE80]'
                            : isCurrent
                            ? 'on bg-white/20'
                            : 'bg-white/20 group-hover:bg-white/35'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Circular Prev / Next Navigation Buttons (.ov-nav) */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setActiveStep((prev) => (prev - 1 + ORDER_STEPS.length) % ORDER_STEPS.length)
                  }
                  className="w-11 h-11 rounded-full bg-[#4ADE80] text-[#061810] hover:bg-[#86EFAC] hover:scale-108 transition-all grid place-items-center shadow-lg cursor-pointer"
                  aria-label={isBn ? 'আগের ধাপ' : 'Previous step'}
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev + 1) % ORDER_STEPS.length)}
                  className="w-11 h-11 rounded-full bg-[#4ADE80] text-[#061810] hover:bg-[#86EFAC] hover:scale-108 transition-all grid place-items-center shadow-lg cursor-pointer"
                  aria-label={isBn ? 'পরের ধাপ' : 'Next step'}
                >
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Step Selector Pills Row */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 my-7">
            {ORDER_STEPS.map((item, idx) => {
              const isSelected = idx === activeStep;
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#174D35] border-[#4ADE80]/60 text-white shadow-lg scale-[1.01]'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-xl grid place-items-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#4ADE80] text-[#061810]'
                        : 'bg-white/10 text-stone-300'
                    }`}
                  >
                    {isBn ? item.numberBn : item.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] text-emerald-300/90 font-medium truncate">
                      {isBn ? item.badgeBn : item.badgeEn}
                    </span>
                    <span className="block text-xs sm:text-sm font-bold truncate">
                      {isBn ? item.titleBn.split(' ')[0] + ' ' + item.titleBn.split(' ')[1] : item.badgeEn.split('• ')[1]}
                    </span>
                  </div>
                  <ItemIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#4ADE80]' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Step Content + 3D Pointer-Tilt Visual Frame */}
          <div
            key={step.number}
            className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2 animate-fade-up-1"
          >
            {/* Left Column: Step Details & DesignMingle .ov-btn CTA */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-semibold">
                <StepIcon className="w-4 h-4" />
                <span>{isBn ? step.badgeBn : step.badgeEn}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-white leading-snug min-h-[3.75rem] sm:min-h-[4.5rem] flex items-center">
                {isBn ? step.titleBn : step.titleEn}
              </h3>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed min-h-[4.5rem] sm:min-h-[3.75rem]">
                {isBn ? step.descBn : step.descEn}
              </p>

              <ul className="space-y-2.5 pt-1">
                {(isBn ? step.highlightsBn : step.highlightsEn).map((point, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-emerald-100">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#4ADE80] shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* DesignMingle Signature .ov-btn Pill Button (High-Contrast in both Light & Dark Mode) */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => navigate(step.ctaHref)}
                  className="group inline-flex items-center justify-between gap-4 h-13 pl-6 pr-1.5 rounded-full bg-[#4ADE80] hover:bg-[#86EFAC] text-[#061810] font-bold text-sm sm:text-base shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <span>{isBn ? step.ctaBn : step.ctaEn}</span>
                  <span className="w-10 h-10 rounded-full bg-[#061810] text-[#4ADE80] group-hover:text-white grid place-items-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4.5 h-4.5" />
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 3D Pointer-Tilt Frame (--rx, --ry) */}
            <div className="lg:col-span-6">
              <div
                ref={tiltFrameRef}
                onMouseMove={handleFrameMouseMove}
                onMouseLeave={handleFrameMouseLeave}
                className="ov-tilt-frame relative rounded-[26px] overflow-hidden border border-white/15 bg-[#174D35]/40 shadow-2xl aspect-[16/10]"
              >
                <img
                  src={step.imageUrl}
                  alt={isBn ? step.titleBn : step.titleEn}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Step Number Watermark & Status Pill Inside Frame */}
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-xs font-bold text-[#4ADE80]">
                  {isBn ? `ধাপ ${step.numberBn} / ০৪` : `Step ${step.number} / 04`}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-white/95 dark:bg-[#0C2018]/95 backdrop-blur-md p-3.5 rounded-2xl text-stone-900 dark:text-white shadow-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#174D35] text-[#4ADE80] grid place-items-center shrink-0">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">
                        {isBn ? step.titleBn : step.titleEn}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-[#9CB5A7] truncate">
                        {isBn ? 'গার্ডেনভ্যালি ভেরিফাইড সার্ভিস' : 'Gardenvaly Verified Process'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-[#174D35] text-[#174D35] dark:text-[#4ADE80] text-[11px] font-bold shrink-0">
                    ✓ {isBn ? 'সহজ ও দ্রুত' : 'Fast & Easy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
