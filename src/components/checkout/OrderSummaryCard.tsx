/**
 * @file OrderSummaryCard.tsx
 * @description Real-time order summary calculation card with promo code voucher engine, line items, and demo advisory.
 */

import React, { useState, useEffect } from 'react';
import { Info, Ticket, CheckCircle2, X, Sparkles } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import { calculateOrderTotals } from '../../utils/orderCalculations';
import { DELIVERY_CONFIG } from '../../config/deliveryConfig';
import { couponService, Coupon } from '../../services/couponService';

interface OrderSummaryCardProps {
  items: CartItem[];
  deliveryCharge: number;
  appliedCoupon?: Coupon | null;
  discountAmount?: number;
  onApplyCoupon?: (coupon: Coupon | null, discountAmount: number) => void;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  deliveryCharge,
  appliedCoupon = null,
  discountAmount = 0,
  onApplyCoupon,
}) => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const totals = calculateOrderTotals(items, deliveryCharge);

  const [couponInput, setCouponInput] = useState(appliedCoupon?.code || '');
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    setAvailableCoupons(couponService.getCoupons().filter((c) => c.isActive));
  }, []);

  // Re-validate applied coupon if subtotal changes
  useEffect(() => {
    if (appliedCoupon && onApplyCoupon) {
      const res = couponService.validateCoupon(appliedCoupon.code, totals.subtotal);
      if (res.valid && res.coupon) {
        if (res.discountAmount !== discountAmount) {
          onApplyCoupon(res.coupon, res.discountAmount);
        }
      } else {
        onApplyCoupon(null, 0);
        setCouponMsg({ type: 'error', text: isBn ? res.messageBn : res.messageEn });
      }
    }
  }, [totals.subtotal]);

  const handleApplyCode = (codeToTry?: string) => {
    const rawCode = (codeToTry ?? couponInput).trim().toUpperCase();
    if (!rawCode) return;

    const result = couponService.validateCoupon(rawCode, totals.subtotal);
    if (result.valid && result.coupon) {
      setCouponInput(result.coupon.code);
      setCouponMsg({
        type: 'success',
        text: isBn ? result.messageBn : result.messageEn,
      });
      onApplyCoupon?.(result.coupon, result.discountAmount);
    } else {
      setCouponMsg({
        type: 'error',
        text: isBn ? result.messageBn : result.messageEn,
      });
      onApplyCoupon?.(null, 0);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput('');
    setCouponMsg(null);
    onApplyCoupon?.(null, 0);
  };

  const finalPayable = Math.max(0, totals.finalEstimatedTotal - discountAmount);

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

      {/* Promo Code / Voucher Input Box */}
      <div className="pt-3 border-t border-stone-100 space-y-2.5">
        <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-[#174D35]" />
          <span>{isBn ? 'প্রোমো কোড / ডিসকাউন্ট ভাউচার' : 'Promo Code / Discount Voucher'}</span>
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-mono font-bold text-emerald-900">{appliedCoupon.code}</span>
                <span className="text-emerald-700 ml-1.5">
                  (-{formatPrice(discountAmount, language)})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
              title={isBn ? 'কুপন সরান' : 'Remove coupon'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder={isBn ? 'যেমন: GREEN10' : 'e.g. GREEN10'}
              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#174D35]"
            />
            <button
              type="button"
              onClick={() => handleApplyCode()}
              className="px-3.5 py-2 rounded-xl bg-[#174D35] hover:bg-[#123c29] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              {isBn ? 'প্রয়োগ করুন' : 'Apply'}
            </button>
          </div>
        )}

        {couponMsg && (
          <p
            className={`text-[11px] font-medium ${
              couponMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {couponMsg.text}
          </p>
        )}

        {/* Quick-Apply Available Coupon Chips */}
        {!appliedCoupon && availableCoupons.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              {isBn ? 'অফার কোড:' : 'Try:'}
            </span>
            {availableCoupons.slice(0, 3).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleApplyCode(c.code)}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#F7F5EC] hover:bg-[#174D35] text-[#174D35] hover:text-white border border-[#174D35]/20 transition-colors cursor-pointer"
                title={isBn ? c.descriptionBn : c.descriptionEn}
              >
                {c.code}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Calculations */}
      <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
        <div className="flex justify-between">
          <span>{t('subtotal')}</span>
          <span className="font-semibold text-stone-800">{formatPrice(totals.subtotal, language)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>
              {isBn ? 'প্রোমো ছাড়' : 'Promo Discount'} ({appliedCoupon?.code})
            </span>
            <span>-{formatPrice(discountAmount, language)}</span>
          </div>
        )}
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
          {formatPrice(finalPayable, language)}
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
