/**
 * @file PhoneOrderButton.tsx
 * @description Button for ordering directly by phone call using dynamic store settings.
 */

import React from 'react';
import { PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreSettings } from '../../services/settingsService';

export const PhoneOrderButton: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useStoreSettings();

  const phone = settings.contactPhone || '+880 1712-345678';
  const telLink = phone.replace(/[^0-9+]/g, '');

  return (
    <div className="space-y-1.5 pt-2 border-t border-stone-100">
      <a
        href={`tel:${telLink}`}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 hover:text-[#174D35] hover:bg-stone-50 text-xs font-semibold transition-colors"
      >
        <PhoneCall className="w-3.5 h-3.5 text-[#5C8D50]" />
        <span>{t('phoneOrder')}: {phone}</span>
      </a>
      <p className="text-[10px] text-stone-400 text-center leading-normal">
        {t('phoneNotice')}
      </p>
    </div>
  );
};
