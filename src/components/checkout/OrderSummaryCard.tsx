/**
 * @file OrderSummaryCard.tsx
 * @description Real-time order summary calculation card with line items and demo advisory.
 */

import React from 'react';
import { Info } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import { calculateOrderTotals } from '../../utils/orderCalculations';
import { DELIVERY_CONFIG } from '../../config/deliveryConfig';

interface OrderSummaryCardProps {
  items: CartItem[];
  deliveryCharge: number;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  deliveryCharge,
}) => {
  const { language, t } = useLanguage();
  const totals = calculateOrderTotals(items, deliveryCharge);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
      <h2 className="font-serif-botanical font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
        {t('orderSummary')}
      </h2>

      {/* Item List */}
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => {
          const name = language === 'bn' ? item.product.nameBn : item.product.nameEn;
          return (
            <div key={item.product.id} className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2 truncate">
                <img
                  src={getSafeImageUrl(item.product.imageUrl, { type: item.product.type, categorySlug: item.product.categorySlug })}
                  alt={name}
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                  onError={(e) => handleImageError(e, getProductFallbackImage(item.product))}
                />
                <div className="truncate">
                  <p className="font-semibold text-stone-900 truncate">{name}</p>
                  <p className="text-[10px] text-stone-400">
                    {formatNumeral(item.quantity, language)} × {formatPrice(item.product.price, language)}
                  </p>
                </div>
              </div>
              <span className="font-bold text-stone-800 shrink-0">
                {formatPrice(item.product.price * item.quantity, language)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Calculations */}
      <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
        <div className="flex justify-between">
          <span>{t('subtotal')}</span>
          <span className="font-semibold text-stone-800">{formatPrice(totals.subtotal, language)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('deliveryCharge')}</span>
          <span className="font-semibold text-stone-800">
            {totals.deliveryCharge === 0 ? 'Free' : formatPrice(totals.deliveryCharge, language)}
          </span>
        </div>
        {totals.subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold && (
          <p className="text-[10px] text-emerald-700 bg-emerald-50 p-1.5 rounded-md font-medium">
            {t('freeDeliveryApplied')}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 flex justify-between text-base">
        <span className="font-bold text-stone-900">{t('estimatedTotal')}</span>
        <span className="font-bold text-xl text-[#174D35]">
          {formatPrice(totals.finalEstimatedTotal, language)}
        </span>
      </div>

      {/* Security & Backend Transparency Note */}
      <div className="flex items-start gap-2 bg-[#F7F5EC] p-3 rounded-xl text-[11px] text-stone-600 leading-relaxed border border-stone-200/60">
        <Info className="w-4 h-4 text-[#5C8D50] shrink-0 mt-0.5" />
        <span>{t('demoNoticeCheckout')}</span>
      </div>
    </div>
  );
};
