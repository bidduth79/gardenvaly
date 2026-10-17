/**
 * @file DeliveryMethodSelector.tsx
 * @description Delivery method selection component based on centralized configuration.
 */

import React from 'react';
import { Truck, Store } from 'lucide-react';
import { DeliveryMethodId } from '../../types/cart';
import { DELIVERY_CONFIG, DeliveryOption } from '../../config/deliveryConfig';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';

interface DeliveryMethodSelectorProps {
  selectedMethod: DeliveryMethodId;
  onSelect: (id: DeliveryMethodId) => void;
}

export const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
      <h2 className="font-serif-botanical font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
        {t('deliveryMethod')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DELIVERY_CONFIG.options.map((opt: DeliveryOption) => {
          const isSelected = selectedMethod === opt.id;
          const name = language === 'bn' ? opt.nameBn : opt.nameEn;
          const desc = language === 'bn' ? opt.descBn : opt.descEn;
          const est = language === 'bn' ? opt.estimatedDaysBn : opt.estimatedDaysEn;

          return (
            <div
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#174D35] bg-[#174D35]/5 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#174D35] text-white' : 'bg-stone-100 text-stone-600'}`}>
                  {opt.id === 'home-delivery' ? <Truck className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-stone-900">{name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-stone-500">{est}</span>
                <span className="text-[#174D35]">
                  {opt.rate === 0 ? 'Free' : formatPrice(opt.rate, language)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
