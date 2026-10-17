/**
 * @file LanguageSwitcher.tsx
 * @description Bilingual toggle switch for English and Bengali.
 */

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language Selector"
      className="flex items-center gap-0.5 sm:gap-1 bg-[#174D35]/10 p-0.5 sm:p-1 rounded-xl border border-[#174D35]/20 shadow-2xs shrink-0"
    >
      <Globe className="w-3.5 h-3.5 text-[#174D35] ml-1.5 hidden lg:block" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-1.5 sm:px-2.5 py-1 min-h-[36px] flex items-center justify-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          language === 'bn'
            ? 'bg-[#174D35] text-white shadow-xs'
            : 'text-[#174D35] hover:bg-[#174D35]/10'
        }`}
        aria-pressed={language === 'bn'}
        aria-label="বাংলা ভাষায় পরিবর্তন করুন"
      >
        <span className="hidden min-[360px]:inline">বাংলা</span>
        <span className="min-[360px]:hidden">বাং</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-1.5 sm:px-2.5 py-1 min-h-[36px] flex items-center justify-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-[#174D35] text-white shadow-xs'
            : 'text-[#174D35] hover:bg-[#174D35]/10'
        }`}
        aria-pressed={language === 'en'}
        aria-label="Switch to English"
      >
        <span className="hidden min-[360px]:inline">English</span>
        <span className="min-[360px]:hidden">EN</span>
      </button>
    </div>
  );
};
