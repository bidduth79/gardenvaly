/**
 * @file AdminBannersPage.tsx
 * @description Administrative dashboard for managing hero carousel photos,
 * device image uploads, built-in crop & color grading, and storefront slider synchronizations.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Sliders,
  Eye,
  RefreshCw,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Layers,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { HeroImageEditorModal, HeroSlide } from '../../components/home/HeroImageEditorModal';

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'foliage-sanctuary',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=85',
    titleBn: 'সবুজে সাজুক আপনার আঙিনা',
    titleEn: 'Nurturing Botanical Elegance',
    subtitleBn: 'ইনডোর ও ব্যালকনি প্ল্যান্ট',
    subtitleEn: 'Indoor & Balcony Foliage',
    altText: 'Gardenvaly botanical living space curated by Hasna Hena',
  },
  {
    id: 'rooftop-blooms',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=1200&q=85',
    titleBn: 'রঙিন ফুলে ভরিয়ে তুলুন ছাদবাগান',
    titleEn: 'Vibrant Blossoms for Your Terrace',
    subtitleBn: 'দেশি-বিদেশি ফুলের সমাহার',
    subtitleEn: 'Exotic & Native Blooms',
    altText: 'Vibrant outdoor flowering plants on sunny terrace',
  },
  {
    id: 'organic-seeds',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=85',
    titleBn: 'উচ্চ ফলনশীল খাঁটি অর্গানিক বীজ',
    titleEn: 'Heirloom & Certified Organic Seeds',
    subtitleBn: '৯৮% অঙ্কুরোদগম নিশ্চয়তা',
    subtitleEn: '98% Germination Assurance',
    altText: 'High germination heirloom seeds and organic sprouting',
  },
  {
    id: 'succulents-airplants',
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1200&q=85',
    titleBn: 'সহজ পরিচর্যার এয়ার-পিউরিফাইং প্ল্যান্টস',
    titleEn: 'Air-Purifying Rare Plants & Succulents',
    subtitleBn: 'বাসাবাড়ি ও অফিসের স্নিগ্ধ রূপ',
    subtitleEn: 'Refined Living & Workspace Greenery',
    altText: 'Lush potted air-purifying succulents in terracotta planter',
  },
  {
    id: 'gardening-supplies',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85',
    titleBn: 'প্রিমিয়াম অর্গানিক সার ও নার্সারি কিট',
    titleEn: 'Complete Plant Nutrition & Potting Essentials',
    subtitleBn: 'গাছের নিবিড় পুষ্টি ও পরিচর্যা',
    subtitleEn: 'Professional Organic Garden Care',
    altText: 'Gardenvaly greenhouse and artisanal plant care supplies',
  },
];

const LOCAL_STORAGE_KEY = 'gardenvaly_hero_slides';

export const AdminBannersPage: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useRouter();
  const isBn = language === 'bn';

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
        console.error('Failed to load slides in admin', e);
      }
    }
    return DEFAULT_HERO_SLIDES;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  const saveSlides = (newSlides: HeroSlide[]) => {
    setSlides(newSlides);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSlides));
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);
    } catch (e) {
      console.error('Failed to save slides to localStorage', e);
    }
  };

  const resetToDefaults = () => {
    setSlides(DEFAULT_HERO_SLIDES);
    setPreviewSlideIdx(0);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);
    } catch (e) {
      console.error('Failed to reset slides', e);
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;
    saveSlides(newSlides);
    setPreviewSlideIdx(targetIdx);
  };

  const removeSlide = (id: string) => {
    if (slides.length <= 1) {
      alert(isBn ? 'কমপক্ষে একটি ব্যানার ছবি থাকা আবশ্যক।' : 'At least one banner must remain.');
      return;
    }
    const filtered = slides.filter((s) => s.id !== id);
    saveSlides(filtered);
    setPreviewSlideIdx(0);
  };

  const activeSlide = slides[previewSlideIdx] || slides[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif-botanical font-bold text-stone-900">
              {isBn ? 'হিরো ব্যানার ও স্লাইডার ম্যানেজমেন্ট' : 'Hero Banners & Carousel Management'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-semibold">
              {slides.length} {isBn ? 'টি সক্রিয় ছবি' : 'Slides Active'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isBn
              ? 'ডিভাইস থেকে নতুন ছবি আপলোড করুন, ক্রপ ও কালার কারেকশন করুন এবং স্টোরফ্রন্টের স্লাইডার পরিবর্তন করুন।'
              : 'Upload photos directly from your device, crop, apply color grading, remove backgrounds and sync live with storefront.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            title={isBn ? 'ডিফল্ট ছবিতে রিসেট করুন' : 'Reset to default photos'}
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            <span>{isBn ? 'রিসেট' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer hover:shadow-lg"
          >
            <Upload className="w-4 h-4" />
            <span>{isBn ? 'ডিভাইস থেকে ছবি আপলোড' : 'Upload From Device'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {isBn
              ? 'সফলভাবে হিরো স্লাইডার ছবিগুলো আপডেট ও সেভ করা হয়েছে!'
              : 'Hero banner slides successfully updated and synced with live storefront!'}
          </span>
        </div>
      )}

      {/* Main Grid: Live Preview & Slide Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Storefront Hero Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#174D35]" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                {isBn ? 'লাইভ স্লাইডার প্রিভিউ' : 'Live Storefront Preview'}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <span>{previewSlideIdx + 1} / {slides.length}</span>
            </div>
          </div>

          {/* Simulated Hero Banner Screen */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-900 shadow-lg border border-stone-200 group">
            {activeSlide && (
              <>
                <img
                  src={activeSlide.imageUrl}
                  alt={activeSlide.altText}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-black/10" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#C5A059] text-[11px] font-semibold uppercase mb-1">
                    {isBn ? activeSlide.subtitleBn : activeSlide.subtitleEn}
                  </span>
                  <h3 className="font-serif-botanical text-xl sm:text-2xl font-bold">
                    {isBn ? activeSlide.titleBn : activeSlide.titleEn}
                  </h3>
                </div>
              </>
            )}
          </div>

          {/* Preview Navigation Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPreviewSlideIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  previewSlideIdx === idx ? 'w-6 bg-[#174D35]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick Info & Action Hint */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-800">
                {isBn ? 'ইন-বিল্ট ফটো স্টুডিও সংযুক্ত:' : 'Built-in Photo Studio Ready:'}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {isBn
                  ? 'ছবি আপলোড করলেই আপনি ক্রপ, রোটেশন, উজ্জ্বলতা, কন্ট্রাস্ট, বোটানিক্যাল ফিল্টার এবং স্মার্ট ব্যাকগ্রাউন্ড রিমুভার ব্যবহার করতে পারবেন।'
                  : 'Every upload supports precision cropping, rotation, brightness/contrast adjustments, botanical filter presets, and AI color-key background removal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Slide List & Ordering */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {isBn ? 'ব্যানার স্লাইড তালিকা' : 'Active Slides List'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#174D35] font-bold hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isBn ? 'নতুন যোগ করুন' : 'Add New'}</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => setPreviewSlideIdx(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  previewSlideIdx === idx
                    ? 'border-[#174D35] bg-[#174D35]/5 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative">
                  <img
                    src={slide.imageUrl}
                    alt={slide.altText}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 bg-black/70 text-white text-[9px] font-bold px-1 rounded-tr">
                    #{idx + 1}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#174D35] truncate">
                    {isBn ? slide.subtitleBn : slide.subtitleEn}
                  </p>
                  <p className="text-xs font-bold text-stone-800 truncate">
                    {isBn ? slide.titleBn : slide.titleEn}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => moveSlide(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title={isBn ? 'উপরে নিন' : 'Move up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(idx, 'down')}
                    disabled={idx === slides.length - 1}
                    className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title={isBn ? 'নিচে নিন' : 'Move down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(slide.id)}
                    className="p-1 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 cursor-pointer"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete slide'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick upload drop trigger */}
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-[#174D35]/30 hover:border-[#174D35] bg-[#174D35]/5 hover:bg-[#174D35]/10 text-[#174D35] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{isBn ? 'ফটো স্টুডিওতে নতুন ছবি আপলোড ও এডিট করুন' : 'Open Photo Studio & Upload'}</span>
          </button>
        </div>
      </div>

      {/* Hero Image Studio & Device Uploader Modal */}
      <HeroImageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        slides={slides}
        onSaveSlides={saveSlides}
        onResetToDefaults={resetToDefaults}
      />
    </div>
  );
};
