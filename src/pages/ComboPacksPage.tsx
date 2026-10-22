/**
 * @file ComboPacksPage.tsx
 * @description Dedicated storefront page (/combos) for Gardenvaly Combo Packs & Custom Bundle Builder.
 */

import React from 'react';
import { Gift, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { ComboPacksSection } from '../components/home/ComboPacksSection';
import { Product } from '../types/product';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { useLanguage } from '../context/LanguageContext';
import { usePageSeo } from '../hooks/usePageSeo';

interface ComboPacksPageProps {
  products?: Product[];
}

export const ComboPacksPage: React.FC<ComboPacksPageProps> = ({
  products = MOCK_PRODUCTS,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  usePageSeo({
    title: isBn
      ? 'স্পেশাল কম্বো প্যাক ও বান্ডেল অফার | গার্ডেনভ্যালি (by Hasna Hena)'
      : 'Special Combo Packs & Custom Plant Bundles | Gardenvaly',
    description: isBn
      ? 'সাশ্রয়ী মূল্যে ইনডোর প্ল্যান্ট কম্বো, বাগানিদের স্টার্টার কিট, ৫-ইন-১ অর্গানিক বীজ প্যাক এবং নিজের পছন্দমতো কাস্টম কম্বো সাজানোর সুবিধা।'
      : 'Save more with curated indoor plant combos, beginner gardening starter kits, 5-in-1 organic seed packs, and our Build Your Own Combo studio.',
    canonicalPath: '/combos',
    lang: language,
  });

  return (
    <div className="min-h-screen pb-12">
      {/* Top Botanical Banner */}
      <div className="bg-[#174D35] text-white py-10 sm:py-14 relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#4ADE80] text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>
              {isBn ? 'গার্ডেনভ্যালি এক্সক্লুসিভ বান্ডেল' : 'Gardenvaly Exclusive Bundles'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-botanical font-bold tracking-tight">
            {isBn
              ? 'স্পেশাল কম্বো প্যাক ও কাস্টম বান্ডেল স্টুডিও'
              : 'Curated Combo Packs & Custom Bundle Studio'}
          </h1>
          <p className="text-xs sm:text-base text-stone-200 mt-2.5 leading-relaxed">
            {isBn
              ? 'আলাদাভাবে কেনার চেয়ে কম্বো প্যাকে পান সর্বোচ্চ ২৫% পর্যন্ত সাশ্রয়! রেডিমেড প্যাক বেছে নিন অথবা নিজের পছন্দমতো গাছ, বীজ ও সার মিলিয়ে কাস্টম কম্বো তৈরি করুন।'
              : 'Enjoy up to 25% savings compared to buying individually! Choose a curated value box or build your own custom 3-in-1 garden bundle.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-emerald-200">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              {isBn ? '১০০% সুস্থ চারার নিশ্চয়তা' : '100% Healthy Sapling Guarantee'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
              {isBn ? 'সারাদেশে ৬৪ জেলায় নিরাপদ ডেলিভারি' : 'Safe Delivery Across 64 Districts'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
              {isBn ? 'কাস্টম কম্বোতে তাৎক্ষণিক ডিসকাউন্ট' : 'Instant Custom Bundle Discount'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Combo Packs & Custom Builder Section */}
      <ComboPacksSection products={products} isFullPage />
    </div>
  );
};
