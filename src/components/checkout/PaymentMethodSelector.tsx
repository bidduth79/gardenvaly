/**
 * @file PaymentMethodSelector.tsx
 * @description Dynamic payment option selector supporting Cash on Delivery, bKash, Nagad, and WhatsApp.
 * Real-time reflects the admin's configured bKash & Nagad account numbers.
 */

import React, { useState } from 'react';
import { Banknote, MessageCircle, Smartphone, Copy, Check, Info, CreditCard, Zap } from 'lucide-react';
import { PaymentMethodId } from '../../types/cart';
import { PAYMENT_CONFIG, PaymentOption } from '../../config/paymentConfig';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreSettings } from '../../services/settingsService';

interface PaymentMethodSelectorProps {
  selectedPayment: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
  trxId?: string;
  onTrxIdChange?: (trxId: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPayment,
  onSelect,
  trxId = '',
  onTrxIdChange,
}) => {
  const { language, t } = useLanguage();
  const { settings } = useStoreSettings();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isBn = language === 'bn';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const getMethodIcon = (id: PaymentMethodId, isSelected: boolean) => {
    switch (id) {
      case 'cash-on-delivery':
        return <Banknote className="w-5 h-5" />;
      case 'bkash':
        return <span className="font-bold text-xs tracking-tight">bKash</span>;
      case 'bkash-online':
        return <Zap className="w-5 h-5 text-pink-600" />;
      case 'nagad':
        return <span className="font-bold text-xs tracking-tight">Nagad</span>;
      case 'sslcommerz':
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'whatsapp-order':
        return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Banknote className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
      <h2 className="font-serif-botanical font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
        {t('paymentMethod')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_CONFIG.options.map((opt: PaymentOption) => {
          const isSelected = selectedPayment === opt.id;
          const name = language === 'bn' ? opt.nameBn : opt.nameEn;
          const desc = language === 'bn' ? opt.descBn : opt.descEn;

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
                <div
                  className={`p-2 rounded-lg flex items-center justify-center min-w-[36px] min-h-[36px] ${
                    isSelected
                      ? opt.id === 'bkash' || opt.id === 'bkash-online'
                        ? 'bg-pink-600 text-white'
                        : opt.id === 'nagad'
                        ? 'bg-amber-600 text-white'
                        : opt.id === 'sslcommerz'
                        ? 'bg-amber-700 text-white'
                        : 'bg-[#174D35] text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {getMethodIcon(opt.id, isSelected)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-stone-900">{name}</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic bKash Instruction & TrxID Input Box */}
      {selectedPayment === 'bkash' && (
        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-pink-200/80">
            <div>
              <p className="text-xs font-bold text-pink-900">
                {isBn ? 'বিকাশ নম্বর:' : 'bKash Account Number:'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base sm:text-lg font-mono font-bold text-stone-900">
                  {settings.bkashNumber || '01712-345678'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 font-semibold">
                  {settings.bkashType || 'Personal'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(settings.bkashNumber || '01712-345678', 'bkash')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-pink-100 border border-pink-300 text-pink-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              {copiedField === 'bkash' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নম্বর কপি করুন' : 'Copy Number'}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-pink-700 shrink-0 mt-0.5" />
            <p>
              {settings.paymentInstructionsBn ||
                (isBn
                  ? 'বিকাশ অ্যাপ থেকে ওপরের নম্বরে Send Money করুন এবং নিশ্চিতকরণের পর ট্রানজেকশন আইডি (TrxID) নিচে লিখে অর্ডার সম্পন্ন করুন।'
                  : 'Send Money to the bKash number above and enter your TrxID below to confirm order.')}
            </p>
          </div>

          {onTrxIdChange && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                {isBn ? 'বিকাশ ট্রানজেকশন আইডি (bKash TrxID) *' : 'bKash Transaction ID *'}
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => onTrxIdChange(e.target.value.toUpperCase())}
                placeholder="e.g. BL9X2A88"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 bg-white font-mono text-xs sm:text-sm font-semibold tracking-wider text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase"
              />
            </div>
          )}
        </div>
      )}

      {/* Dynamic Nagad Instruction & TrxID Input Box */}
      {selectedPayment === 'nagad' && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/80">
            <div>
              <p className="text-xs font-bold text-amber-900">
                {isBn ? 'নগদ একাউন্ট নম্বর:' : 'Nagad Account Number:'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base sm:text-lg font-mono font-bold text-stone-900">
                  {settings.nagadNumber || '01712-345678'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">
                  {settings.nagadType || 'Personal'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(settings.nagadNumber || '01712-345678', 'nagad')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              {copiedField === 'nagad' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{isBn ? 'কপি হয়েছে!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নম্বর কপি করুন' : 'Copy Number'}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              {isBn
                ? 'নগদ অ্যাপ বা *167# থেকে ওপরের নম্বরে Send Money করুন এবং প্রাপ্ত Transaction ID নিচে লিখুন।'
                : 'Send Money to the Nagad number above and enter your TrxID below to confirm order.'}
            </p>
          </div>

          {onTrxIdChange && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                {isBn ? 'নগদ ট্রানজেকশন আইডি (Nagad TrxID) *' : 'Nagad Transaction ID *'}
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => onTrxIdChange(e.target.value.toUpperCase())}
                placeholder="e.g. 72K9M20B"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white font-mono text-xs sm:text-sm font-semibold tracking-wider text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
              />
            </div>
          )}
        </div>
      )}
      {/* SSLCommerz Details */}
      {selectedPayment === 'sslcommerz' && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950">
              {isBn ? 'SSLCommerz মাল্টি-চ্যানেল নিরাপদ পেমেন্ট' : 'SSLCommerz Secure Multi-Channel Gateway'}
            </span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            {isBn
              ? 'ভিসা, মাস্টারকার্ড, ডিবিবিএল নেক্সাস, ইন্টারনেট ব্যাংকিং বা মোবাইল ওয়ালেট দিয়ে এক ক্লিকে সরাসরি পেমেন্ট করতে পারবেন।'
              : 'Pay securely using any VISA, Mastercard, Amex, DBBL Nexus, or Net Banking channel.'}
          </p>
        </div>
      )}

      {/* bKash Online Gateway Details */}
      {selectedPayment === 'bkash-online' && (
        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-pink-600" />
            <span className="text-xs font-bold text-pink-950">
              {isBn ? 'বিকাশ ইনস্ট্যান্ট অনলাইন গেটওয়ে' : 'Instant bKash Checkout'}
            </span>
          </div>
          <p className="text-xs text-pink-900 leading-relaxed">
            {isBn
              ? 'অর্ডার সাবমিট করার পর অফিসিয়াল বিকাশ পেমেন্ট পপআপ দৃশ্যমান হবে। ওটিপি ও পিন দিয়ে তৎক্ষণাৎ স্বয়ংক্রিয়ভাবে পেমেন্ট ভেরিফাই হবে।'
              : 'Official bKash payment gateway will prompt automatically. Your payment will be verified instantly.'}
          </p>
        </div>
      )}
    </div>
  );
};
