/**
 * @file LivingTreeIndicator.tsx
 * @description Floating live botanical scroll indicator showing active lifecycle phase
 * with real-time progress bar and smooth scroll-jump interaction.
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const STAGES = [
  { id: 'seed', nameBn: 'সুপ্ত বীজ', nameEn: 'Dormant Seed', icon: '🌰', color: '#84CC16', targetProgress: 0.0 },
  { id: 'sprout', nameBn: 'অঙ্কুরোদগম', nameEn: 'Fresh Sprout', icon: '🌱', color: '#22C55E', targetProgress: 0.36 },
  { id: 'tree', nameBn: 'পল্লবিত তরু', nameEn: 'Branching Tree', icon: '🌿', color: '#15803D', targetProgress: 0.62 },
  { id: 'fruiting', nameBn: 'ফলবান বৃক্ষ', nameEn: 'Fruiting Tree', icon: '🌳', color: '#14532D', targetProgress: 1.0 },
];

export const LivingTreeIndicator: React.FC = () => {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId = 0;
    let isRunning = false;

    const getScrollProgress = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    let targetProg = getScrollProgress();
    let currentProg = targetProg;

    const updateState = (prog: number) => {
      setProgress(prog);
      if (prog < 0.22) setActiveStageIdx(0);
      else if (prog < 0.49) setActiveStageIdx(1);
      else if (prog < 0.74) setActiveStageIdx(2);
      else setActiveStageIdx(3);
    };

    const tick = () => {
      const diff = targetProg - currentProg;
      if (Math.abs(diff) > 0.001) {
        currentProg += diff * 0.12;
        updateState(currentProg);
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentProg = targetProg;
        updateState(currentProg);
        isRunning = false;
      }
    };

    const handleScroll = () => {
      targetProg = getScrollProgress();
      if (!isRunning) {
        isRunning = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateState(currentProg);

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
    const targetY = STAGES[idx].targetProgress * maxScroll;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label={isBn ? 'গাছের জীবনচক্র স্ক্রল নির্দেশক' : 'Living Tree Lifecycle Scroll Indicator'}
      className="hidden lg:block fixed bottom-5 left-4 sm:left-6 z-30 select-none transition-all duration-300"
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-700/80 shadow-lg text-xs font-semibold text-stone-800 dark:text-stone-100 transition-all hover:shadow-xl">
        {/* Animated Phase Icon */}
        <span className="text-base leading-none" role="img" aria-label={stage.nameEn}>
          {stage.icon}
        </span>

        {/* Phase Name & Live Percentage */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-900 dark:text-stone-100 font-bold tracking-tight whitespace-nowrap">
              {isBn ? stage.nameBn : stage.nameEn}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal tabular-nums">
              ({percent}%)
            </span>
          </div>

          {/* Mini Real-Time Growth Bar */}
          <div className="w-20 sm:w-24 h-1 rounded-full bg-stone-200/80 dark:bg-stone-700 overflow-hidden mt-1">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(5, progress * 100)}%`,
                backgroundColor: stage.color,
              }}
            />
          </div>
        </div>

        {/* Quick Phase Jump Buttons */}
        <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-stone-200 dark:border-stone-700">
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToPhase(idx)}
              title={isBn ? s.nameBn : s.nameEn}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                idx === activeStageIdx
                  ? 'bg-[#174D35] text-white shadow-xs scale-110'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200'
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
