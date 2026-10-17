/**
 * @file AnnouncementBar.tsx
 * @description Top announcement notification bar configurable from constants.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { ANNOUNCEMENT_CONFIG } from '../../config/constants';
import { useLanguage } from '../../context/LanguageContext';

export const AnnouncementBar: React.FC = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isRendered, setIsRendered] = useState(true);
  const message = language === 'bn' ? ANNOUNCEMENT_CONFIG.textBn : ANNOUNCEMENT_CONFIG.textEn;

  // Auto-hide announcement bar after 10 seconds
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(hideTimer);
  }, []);

  // Gracefully remove from DOM after CSS transition finishes
  useEffect(() => {
    if (!isVisible) {
      const exitTimer = setTimeout(() => {
        setIsRendered(false);
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [isVisible]);

  if (!isRendered) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative bg-[#174D35] text-white overflow-hidden transition-all duration-500 ease-in-out border-b border-[#174D35]/20 select-none ${
        isVisible
          ? 'max-h-12 opacity-100 py-2 px-4'
          : 'max-h-0 opacity-0 py-0 px-4 border-none pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" aria-hidden="true" />
        <span className="truncate max-w-xl">{message}</span>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="ml-2 p-0.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={language === 'bn' ? 'বিজ্ঞপ্তি বন্ধ করুন' : 'Dismiss announcement'}
          title={language === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
