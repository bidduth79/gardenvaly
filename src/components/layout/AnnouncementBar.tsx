/**
 * @file AnnouncementBar.tsx
 * @description Top announcement notification bar configurable from constants.
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { ANNOUNCEMENT_CONFIG } from '../../config/constants';
import { useLanguage } from '../../context/LanguageContext';

export const AnnouncementBar: React.FC = () => {
  const { language } = useLanguage();
  const message = language === 'bn' ? ANNOUNCEMENT_CONFIG.textBn : ANNOUNCEMENT_CONFIG.textEn;

  return (
    <div className="bg-[#174D35] text-white text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-[#174D35]/20 select-none">
      <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
      <span className="truncate max-w-xl">{message}</span>
    </div>
  );
};
