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

  return (
    <div className="p-3 rounded-xl bg-[#174D35]/5 border border-[#174D35]/15 space-y-2">
      <div className="flex items-center justify-between text-xs">
        {isUnlocked ? (
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'bn'
                ? '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন!'
                : '🎉 Congratulations! You unlocked FREE Delivery!'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-stone-700 font-medium">
            <Truck className="w-4 h-4 text-[#174D35] shrink-0" />
            <span>
              {language === 'bn' ? (
                <>
                  আর মাত্র <strong className="text-[#174D35] font-bold">{formatPrice(remaining, language)}</strong> কিনলেই ফ্রি ডেলিভারি!
                </>
              ) : (
                <>
                  Add <strong className="text-[#174D35] font-bold">{formatPrice(remaining, language)}</strong> more for FREE Delivery!
                </>
              )}
            </span>
          </div>
        )}
        <span className="text-[11px] font-mono font-bold text-stone-500">
          {formatNumeral(percent, language)}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isUnlocked
              ? 'bg-gradient-to-r from-emerald-600 to-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
              : 'bg-gradient-to-r from-[#174D35] to-emerald-600'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
