/**
 * @file AdminCouponsPage.tsx
 * @description Admin management panel for promotional codes, percentage/flat discount vouchers,
 * minimum order thresholds, and live usage analytics.
 */

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { couponService, Coupon, COUPONS_UPDATED_EVENT } from '../../services/couponService';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const AdminCouponsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [coupons, setCoupons] = useState<Coupon[]>(() => couponService.getCoupons());
  const [isAdding, setIsAdding] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New coupon form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(500);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<string>('300');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');

  useEffect(() => {
    const sync = () => setCoupons(couponService.getCoupons());
    window.addEventListener(COUPONS_UPDATED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(COUPONS_UPDATED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountValue <= 0) return;

    couponService.addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount:
        discountType === 'percentage' && maxDiscountAmount
          ? Number(maxDiscountAmount)
          : undefined,
      descriptionBn:
        descriptionBn.trim() ||
        `${minOrderAmount}৳+ অর্ডারে ${discountValue}${discountType === 'percentage' ? '%' : '৳'} ছাড়`,
      descriptionEn:
        descriptionEn.trim() ||
        `${discountValue}${discountType === 'percentage' ? '%' : '৳'} off on orders above ৳${minOrderAmount}`,
      isActive: true,
      expiryDate: expiryDate || undefined,
    });

    setCode('');
    setDescriptionBn('');
    setDescriptionEn('');
    setIsAdding(false);
    setCoupons(couponService.getCoupons());
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {isBn ? 'প্রোমো কোড ও ডিসকাউন্ট ভাউচার' : 'Promo Codes & Discount Vouchers'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#174D35] text-xs font-bold">
              {formatNumeral(coupons.filter((c) => c.isActive).length, language)}{' '}
              {isBn ? 'সক্রিয়' : 'Active'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {isBn
              ? 'কাস্টমারদের জন্য বিশেষ উৎসব, প্রথম অর্ডার বা ন্যূনতম ক্রয়ে ডিসকাউন্ট কুপন তৈরি ও নিয়ন্ত্রণ করুন।'
              : 'Create and manage percentage or flat discount vouchers with minimum spend rules.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAdding((prev) => !prev)}
        >
          {isBn ? 'নতুন কুপন তৈরি করুন' : 'Create New Voucher'}
        </Button>
      </div>

      {/* Add Coupon Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-[#174D35]/20 p-5 sm:p-6 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>{isBn ? 'নতুন ডিসকাউন্ট কুপন যোগ করুন' : 'Add New Discount Coupon'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'কুপন কোড (ইংরেজি বড় হাতের)' : 'Coupon Code'} *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. BAISHAKH20"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'ছাড়ের ধরন' : 'Discount Type'}
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'flat')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              >
                <option value="percentage">
                  {isBn ? 'শতাংশ ছাড় (%)' : 'Percentage (%)'}
                </option>
                <option value="flat">{isBn ? 'নির্দিষ্ট টাকা ছাড় (৳)' : 'Flat Amount (৳)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {discountType === 'percentage'
                  ? isBn
                    ? 'ছাড়ের হার (%)'
                    : 'Discount (%)'
                  : isBn
                  ? 'ছাড়ের পরিমাণ (৳)'
                  : 'Discount Amount (৳)'}{' '}
                *
              </label>
              <input
                type="number"
                required
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'ন্যূনতম অর্ডার (৳)' : 'Minimum Order (৳)'}
              </label>
              <input
                type="number"
                min={0}
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {discountType === 'percentage' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? 'সর্বোচ্চ ছাড় সীমা (৳)' : 'Max Discount Cap (৳)'}
                </label>
                <input
                  type="number"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  placeholder="300"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'মেয়াদ শেষের তারিখ' : 'Expiry Date'}
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? 'বিবরণ (বাংলা)' : 'Description (Bengali)'}
              </label>
              <input
                type="text"
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="৫০০৳+ অর্ডারে ১০% বিশেষ ছাড়"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D35]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {isBn ? 'কুপন সংরক্ষণ করুন' : 'Save Coupon'}
            </Button>
          </div>
        </form>
      )}

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((cpn) => (
          <div
            key={cpn.id}
            className={`rounded-2xl border p-5 transition-all flex flex-col justify-between gap-4 ${
              cpn.isActive
                ? 'bg-white border-stone-200/90 shadow-xs'
                : 'bg-stone-50 border-stone-200/60 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    cpn.isActive
                      ? 'bg-[#174D35] text-[#C5A059]'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-stone-900 tracking-wider">
                      {cpn.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cpn.code)}
                      className="text-stone-400 hover:text-[#174D35] p-1 rounded cursor-pointer"
                      title="Copy code"
                    >
                      {copiedCode === cpn.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cpn.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {cpn.isActive ? (isBn ? 'সক্রিয়' : 'Active') : isBn ? 'নিষ্ক্রিয়' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {isBn ? cpn.descriptionBn : cpn.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-bold text-[#174D35]">
                  {cpn.discountType === 'percentage'
                    ? `${formatNumeral(cpn.discountValue, language)}%`
                    : formatPrice(cpn.discountValue, language)}
                </span>
                <span className="block text-[10px] text-stone-400">
                  {isBn ? 'ন্যূনতম' : 'Min'} {formatPrice(cpn.minOrderAmount, language)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-3">
                <span>
                  {isBn ? 'ব্যবহৃত:' : 'Used:'}{' '}
                  <strong className="text-stone-800">
                    {formatNumeral(cpn.usageCount, language)} {isBn ? 'বার' : 'times'}
                  </strong>
                </span>
                {cpn.expiryDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{cpn.expiryDate}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => couponService.toggleCouponStatus(cpn.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    cpn.isActive
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {cpn.isActive ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isBn ? 'বন্ধ করুন' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'চালু করুন' : 'Activate'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => couponService.deleteCoupon(cpn.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title={isBn ? 'মুছে ফেলুন' : 'Delete coupon'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
