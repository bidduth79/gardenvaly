/**
 * @file LivingTreeIndicator.tsx
 * @description Floating live botanical scroll indicator showing active lifecycle phase
 * with real-time progress bar and smooth scroll-jump interaction.
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronUp, Sprout, Sparkles } from 'lucide-react';

const STAGES = [
  { id: 'seed', nameBn: 'সুপ্ত বীজ', nameEn: 'Dormant Seed', icon: '🌰', color: '#84CC16' },
  { id: 'sprout', nameBn: 'অঙ্কুরোদগম', nameEn: 'Fresh Sprout', icon: '🌱', color: '#22C55E' },
  { id: 'tree', nameBn: 'পল্লবিত তরু', nameEn: 'Branching Tree', icon: '🌿', color: '#15803D' },
  { id: 'fruiting', nameBn: 'ফলবান বৃক্ষ', nameEn: 'Fruiting Tree', icon: '🌳', color: '#14532D' },
];

export const LivingTreeIndicator: React.FC = () => {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId: number;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const prog = Math.min(1, Math.max(0, scrollY / maxScroll));
      setProgress(prog);

      if (prog < 0.25) setActiveStageIdx(0);
      else if (prog < 0.55) setActiveStageIdx(1);
      else if (prog < 0.8) setActiveStageIdx(2);
      else setActiveStageIdx(3);
    };

    const handleScroll = () => {
      rafId = window.requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const isBn = language === 'bn';
  const stage = STAGES[activeStageIdx];
  const percent = Math.round(progress * 100);

  const scrollToPhase = (idx: number) => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = (idx / 3) * maxScroll;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label={isBn ? 'গাছের জীবনচক্র স্ক্রল নির্দেশক' : 'Living Tree Lifecycle Indicator'}
      className="fixed bottom-5 left-4 sm:left-6 z-30 select-none transition-all duration-300"
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-lg text-xs font-semibold text-stone-800 transition-all hover:shadow-xl">
        {/* Animated Phase Icon */}
        <span className="text-base leading-none" role="img" aria-label={stage.nameEn}>
          {stage.icon}
        </span>

        {/* Phase Name & Live Percentage */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-900 font-bold tracking-tight">
              {isBn ? stage.nameBn : stage.nameEn}
            </span>
            <span className="text-[10px] text-stone-500 font-normal">
              ({percent}%)
            </span>
          </div>

          {/* Mini Real-Time Growth Bar */}
          <div className="w-20 sm:w-24 h-1 rounded-full bg-stone-200/80 overflow-hidden mt-1">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${Math.max(5, percent)}%`,
                backgroundColor: stage.color,
              }}
            />
          </div>
        </div>

        {/* Quick Phase Jump Buttons */}
        <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-stone-200">
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToPhase(idx)}
              title={isBn ? s.nameBn : s.nameEn}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                idx === activeStageIdx
                  ? 'bg-[#174D35] text-white shadow-xs scale-110'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
              }`}
            >
              {s.icon}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
