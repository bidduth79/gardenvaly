/**
 * @file BrandLogo.tsx
 * @description Official dynamic brand identity logo reflecting real-time store settings.
 */

import React from 'react';
import { Sprout } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreSettings } from '../../services/settingsService';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'normal' | 'large';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark', size = 'normal' }) => {
  const { navigate } = useRouter();
  const { language } = useLanguage();
  const { settings } = useStoreSettings();

  const isDark = variant === 'dark';
  const isLarge = size === 'large';
  const isBn = language === 'bn';

  const storeName = isBn ? (settings.storeNameBn || settings.storeNameEn || 'গার্ডেনভ্যালি') : (settings.storeNameEn || settings.storeNameBn || 'Gardenvaly');
  const signature = isBn ? (settings.signatureBn || settings.signatureEn || 'বাই হাসনাহেনা') : (settings.signatureEn || settings.signatureBn || 'by Hasna Hena');

  return (
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        navigate('/');
      }}
      aria-label={`${storeName} ${signature} - Home`}
      className="group flex items-center gap-2 sm:gap-2.5 select-none text-left cursor-pointer shrink-0"
    >
      <div
        className={`flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 shrink-0 ${
          isLarge ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-9 h-9 sm:w-10 sm:h-10'
        } ${isDark ? 'bg-[#174D35] text-[#F7F5EC]' : 'bg-[#F7F5EC] text-[#174D35]'}`}
      >
        <Sprout className={isLarge ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-4.5 h-4.5 sm:w-5 sm:h-5'} />
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif-botanical font-bold tracking-tight leading-none ${
            isLarge ? 'text-2xl sm:text-3xl' : 'text-base sm:text-2xl'
          } ${isDark ? 'text-[#174D35] dark:text-[#E8F5E9]' : 'text-white'}`}
        >
          {storeName}
        </span>
        <span
          className={`text-[10px] sm:text-xs tracking-wider italic font-medium mt-0.5 ${
            isDark ? 'text-[#C5A059]' : 'text-[#C5A059]'
          }`}
        >
          {signature}
        </span>
      </div>
    </a>
  );
};
