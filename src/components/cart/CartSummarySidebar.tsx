/**
 * @file CartSummarySidebar.tsx
 * @description Cart order summary breakdown card with checkout navigation.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';
import { DELIVERY_CONFIG } from '../../config/deliveryConfig';

interface CartSummarySidebarProps {
  subtotal: number;
  deliveryCharge: number;
  estimatedTotal: number;
  onProceedToCheckout: () => void;
}

export const CartSummarySidebar: React.FC<CartSummarySidebarProps> = ({
  subtotal,
  deliveryCharge,
  estimatedTotal,
  onProceedToCheckout,
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
      <h2 className="font-serif-botanical font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
        {t('orderSummary')}
      </h2>

      <div className="space-y-2 text-sm text-stone-600">
        <div className="flex justify-between">
          <span>{t('subtotal')}</span>
          <span className="font-bold text-stone-900">{formatPrice(subtotal, language)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('deliveryCharge')}</span>
          <span className="font-semibold text-stone-800">
            {deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge, language)}
          </span>
        </div>
        {subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold && (
          <p className="text-[11px] text-[#5C8D50] bg-emerald-50 p-2 rounded-lg font-medium">
            {t('freeDeliveryApplied')}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 flex justify-between text-base">
        <span className="font-semibold text-stone-900">{t('estimatedTotal')}</span>
        <span className="font-bold text-xl text-[#174D35]">{formatPrice(estimatedTotal, language)}</span>
      </div>

      <Button
        variant="primary"
        fullWidth
        size="lg"
        icon={<ArrowRight className="w-4 h-4" />}
        onClick={onProceedToCheckout}
      >
        {t('proceedToCheckout')}
      </Button>
    </div>
  );
};
