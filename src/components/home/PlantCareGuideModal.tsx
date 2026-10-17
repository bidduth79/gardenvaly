/**
 * @file PlantCareGuideModal.tsx
 * @description Interactive seasonal plant care and watering routine modal with droplet meter.
 */

import React, { useState } from 'react';
import { X, Droplets, Sun, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';

interface PlantCareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

type Season = 'summer' | 'monsoon' | 'winter';

export const PlantCareGuideModal: React.FC<PlantCareGuideModalProps> = ({ isOpen, onClose, product }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [season, setSeason] = useState<Season>('summer');

  if (!isOpen) return null;

  const getWaterAdvice = () => {
    switch (season) {
      case 'summer':
        return {
          frequency: isBn ? 'সপ্তাহে ২-৩ দিন' : '2-3 times a week',
          droplets: 3,
          tip: isBn
            ? 'গ্রীষ্মে সকালের দিকে বা পড়ন্ত বিকেলে পানি দিন। দুপুরের কড়া রোদে পানি দেওয়া পরিহার করুন।'
            : 'Water early morning or late afternoon during summer. Avoid peak noon sun.',
        };
      case 'monsoon':
        return {
          frequency: isBn ? 'সপ্তাহে ১-২ দিন' : '1-2 times a week',
          droplets: 2,
          tip: isBn
            ? 'বর্ষায় বাতাসে আর্দ্রতা বেশি থাকে। টবের ওপরের ২ ইঞ্চি মাটি শুকিয়ে গেলে তবেই পানি দিন।'
            : 'Humidity is high. Check top 2 inches of soil before watering to prevent root rot.',
        };
      case 'winter':
        return {
          frequency: isBn ? 'সপ্তাহে ১ দিন বা ৭-১০ দিনে ১ বার' : 'Once every 7-10 days',
          droplets: 1,
          tip: isBn
            ? 'শীতে গাছের পানির চাহিদা কমে যায়। হালকা কুসুম তাপমাত্রার পানি দিলে শিকড় সুস্থ থাকে।'
            : 'Growth slows down in winter. Reduce watering and avoid ice-cold water on roots.',
        };
    }
  };

  const advice = getWaterAdvice();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-botanical font-bold text-base sm:text-lg text-stone-900 leading-tight">
                {isBn ? `${product.nameBn}-এর পরিচর্যা নির্দেশিকা` : `${product.nameEn} Care Guide`}
              </h3>
              <p className="text-[11px] text-stone-500">{isBn ? 'ঋতুভেদে সঠিক পানি ও যত্নের নিয়ম' : 'Seasonal Watering & Care Guidance'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Season Selector */}
        <div className="mt-5">
          <label className="text-xs font-bold text-stone-700 mb-2 block">{isBn ? 'বর্তমান ঋতু বেছে নিন:' : 'Select Current Season:'}</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'summer', bn: '☀️ গ্রীষ্মকাল', en: 'Summer' },
              { id: 'monsoon', bn: '🌧️ বর্ষাকাল', en: 'Monsoon' },
              { id: 'winter', bn: '❄️ শীতকাল', en: 'Winter' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSeason(s.id as Season)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  season === s.id ? 'bg-[#174D35] text-white border-[#174D35] shadow-xs' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {isBn ? s.bn : s.en}
              </button>
            ))}
          </div>
        </div>

        {/* Water Meter */}
        <div className="mt-5 p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-900">{isBn ? 'প্রস্তাবিত পানির রুটিন:' : 'Recommended Schedule:'}</span>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Droplets key={i} className={`w-4 h-4 ${i < advice.droplets ? 'text-cyan-600 fill-cyan-500' : 'text-stone-300'}`} />
              ))}
            </div>
          </div>
          <p className="text-base font-bold text-cyan-950 mt-1">{advice.frequency}</p>
          <p className="text-xs text-cyan-900/85 mt-2 leading-relaxed">{advice.tip}</p>
        </div>

        {/* Care Checklist */}
        <div className="mt-5 space-y-2.5 text-xs text-stone-700">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
            <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">{isBn ? 'সূর্যালোকের মাত্রা' : 'Sunlight Need'}</p>
              <p className="text-stone-500 mt-0.5">{isBn ? product.sunlightBn : product.sunlightEn}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
            <Sparkles className="w-4 h-4 text-[#5C8D50] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">{isBn ? 'সার ও পুষ্টি' : 'Fertilizer Guide'}</p>
              <p className="text-stone-500 mt-0.5">
                {isBn ? 'মাসে একবার হালকা ভার্মিকম্পোস্ট বা তরল অর্গানিক সার দিন।' : 'Apply balanced organic compost once a month.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {isBn ? 'সতর্কতা: টবের নিচে পানি জমে থাকলে শিকড় পচে যেতে পারে (Drainage Hole নিশ্চিত করুন)।' : 'Caution: Ensure pot has drainage holes to prevent root rot.'}
            </p>
          </div>
        </div>

        {/* Footer OK button */}
        <div className="mt-6 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#174D35] hover:bg-[#123e2a] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            {isBn ? 'ঠিক আছে, বুঝেছি' : 'Got It, Thanks'}
          </button>
        </div>
      </div>
    </div>
  );
};
