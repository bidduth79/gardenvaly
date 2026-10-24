/**
 * @file FreeDeliveryProgressBar.tsx
 * @description Dynamic free shipping threshold progress bar for cart drawer and checkout.
 */

import React from 'react';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';

interface FreeDeliveryProgressBarProps {
  subtotal: number;
  threshold?: number;
}

export const FreeDeliveryProgressBar: React.FC<FreeDeliveryProgressBarProps> = ({
  subtotal,
  threshold = 1500,
}) => {
  const { language } = useLanguage();

  const remaining = Math.max(0, threshold - subtotal);
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const isUnlocked = remaining === 0;
  const vanLeftPct = Math.min(94, Math.max(6, percent));

  return (
    <div className="relative p-3.5 rounded-xl bg-[#174D35]/5 dark:bg-[#10261E] border border-[#174D35]/15 dark:border-[#1B3B2E] space-y-2.5 overflow-hidden">
      {/* Subtle Celebration Sparkles when Free Delivery is Unlocked */}
      {isUnlocked && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] absolute top-2 right-12 animate-pulse opacity-80" />
          <Sparkles className="w-3 h-3 text-emerald-500 absolute bottom-1.5 left-1/3 animate-bounce opacity-70" />
        </div>
      )}

      <div className="flex items-center justify-between text-xs relative z-10">
        {isUnlocked ? (
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-[#4ADE80] font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0 animate-cart-pop" />
            <span>
              {language === 'bn'
                ? '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন!'
                : '🎉 Congratulations! You unlocked FREE Delivery!'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-200 font-medium">
            <Truck className="w-4 h-4 text-[#174D35] dark:text-[#4ADE80] shrink-0" />
            <span>
              {language === 'bn' ? (
                <>
                  আর মাত্র <strong className="text-[#174D35] dark:text-[#4ADE80] font-bold">{formatPrice(remaining, language)}</strong> কিনলেই ফ্রি ডেলিভারি!
                </>
              ) : (
                <>
                  Add <strong className="text-[#174D35] dark:text-[#4ADE80] font-bold">{formatPrice(remaining, language)}</strong> more for FREE Delivery!
                </>
              )}
            </span>
          </div>
        )}
        <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-stone-400">
          {formatNumeral(percent, language)}%
        </span>
      </div>

      {/* Progress Track with Live Miniature Delivery Van */}
      <div className="relative pt-2 pb-1">
        <div className="w-full h-2 rounded-full bg-stone-200/80 dark:bg-[#091812] overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              isUnlocked
                ? 'bg-gradient-to-r from-emerald-600 via-[#22C55E] to-[#4ADE80] shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-[#174D35] to-emerald-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Miniature Moving GardenValy Delivery Van */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${vanLeftPct}%` }}
        >
          <svg viewBox="0 0 36 22" className="w-7 h-4.5 drop-shadow-xs" fill="none">
            <rect x="2" y="4" width="20" height="12" rx="2.5" fill="#174D35" />
            <path d="M22 7H28C30 7 31.5 8.5 32.5 10.5L34 13V16H22V7Z" fill="#22C55E" />
            <path d="M23.5 8.5H27.5L29.5 11.5H23.5V8.5Z" fill="#E2F8EC" />
            <path d="M9 12.5C9 9.5 12.5 7.5 15 7.5C15 10.5 12.5 12.5 9 12.5Z" fill="#4ADE80" />
            <circle cx="9" cy="17" r="3" fill="#1C1917" stroke="#F5F5F4" strokeWidth="1.2" />
            <circle cx="27" cy="17" r="3" fill="#1C1917" stroke="#F5F5F4" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
};
