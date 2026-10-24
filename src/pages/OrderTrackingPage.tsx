/**
 * @file OrderTrackingPage.tsx
 * @description Customer live visual order tracking page with multi-step status stepper and instant query.
 */

import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, Home, AlertCircle, MessageCircle, Phone, Printer, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { orderService } from '../services/orderService';
import { AdminOrder, OrderStatus } from '../types/order';
import { formatPrice, formatNumeral } from '../utils/formatters';
import { BRAND_CONFIG } from '../config/constants';
import { InvoicePrintModal } from '../components/checkout/InvoicePrintModal';
import { useStoreSettings } from '../services/settingsService';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../utils/imageFallback';

const STEPS: { status: OrderStatus[]; labelBn: string; labelEn: string; icon: React.ElementType }[] = [
  { status: ['pending'], labelBn: 'অর্ডার গৃহীত', labelEn: 'Order Placed', icon: Clock },
  { status: ['confirmed', 'processing', 'packed'], labelBn: 'নার্সারিতে প্যাকেজিং', labelEn: 'Processing', icon: Package },
  { status: ['shipped'], labelBn: 'ডেলিভারির পথে', labelEn: 'In Transit', icon: Truck },
  { status: ['delivered'], labelBn: 'ডেলিভারি সম্পন্ন', labelEn: 'Delivered', icon: Home },
];

export const OrderTrackingPage: React.FC = () => {
  const { language } = useLanguage();
  const { settings } = useStoreSettings();
  const isBn = language === 'bn';
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQ = query.trim();
    if (!cleanQ) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const orders = await orderService.getOrders({ search: cleanQ, limit: 1 });
      setOrder(orders.length > 0 ? orders[0] : null);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepState = (stepIndex: number, currentStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIdx = Math.max(0, statusOrder.indexOf(currentStatus));
    const stepTargetIdx = stepIndex === 0 ? 0 : stepIndex === 1 ? 2 : stepIndex === 2 ? 3 : 4;
    if (currentStatus === 'cancelled' || currentStatus === 'returned') return 'cancelled';
    if (currentIdx >= stepTargetIdx) return 'completed';
    return currentIdx + 1 === stepTargetIdx ? 'current' : 'upcoming';
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174D35]/10 text-[#174D35] text-xs font-semibold mb-3">
          <Package className="w-3.5 h-3.5 text-[#5C8D50]" />
          <span>{isBn ? 'লাইভ পার্সেল ট্র্যাকিং' : 'Live Parcel Tracking'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif-botanical font-bold text-stone-900">{isBn ? 'আপনার অর্ডারের বর্তমান অবস্থা জানুন' : 'Track Your Gardenvaly Order'}</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">{isBn ? 'অর্ডার নম্বর (যেমন: GV-2026-0841) বা মোবাইল নম্বর দিয়ে সার্চ করুন' : 'Enter Order Number (e.g. GV-2026-0841) or Mobile Number'}</p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-stone-200 flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isBn ? 'অর্ডার আইডি অথবা ফোন নম্বর...' : 'Order ID or Mobile Number...'}
            className="w-full pl-10 pr-4 py-3 text-sm text-stone-800 placeholder-stone-400 border border-stone-200 rounded-xl focus:outline-none focus:border-[#174D35]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-[#174D35] hover:bg-[#123e2a] text-white text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? (isBn ? 'খোঁজা হচ্ছে...' : 'Tracking...') : (isBn ? 'ট্র্যাক করুন' : 'Track Order')}
        </button>
      </form>

      {!hasSearched && (
        <div className="text-center text-xs text-stone-500 mb-8">
          <span>{isBn ? 'ডেমো দেখতে ক্লিক করুন: ' : 'Quick Demo: '}</span>
          <button type="button" onClick={() => setQuery('GV-2026-0841')} className="text-[#174D35] font-semibold underline ml-1 cursor-pointer">
            GV-2026-0841
          </button>
        </div>
      )}

      {hasSearched && !order && !loading && (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900">{isBn ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No Order Found'}</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {isBn ? 'অনুগ্রহ করে সঠিক অর্ডার আইডি বা মোবাইল নম্বর দিয়েছেন কিনা তা যাচাই করুন।' : 'Please verify Order Number or Mobile Number.'}
          </p>
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">{order.orderNumber}</span>
                <span className="text-xs text-stone-400">• {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 mt-2">{order.customer.fullName}</h2>
              <p className="text-xs text-stone-500">{order.customer.addressDetail}, {order.customer.district}</p>
            </div>
            <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
              <p className="text-xs text-stone-500">{isBn ? 'মোট মূল্য' : 'Total Amount'}</p>
              <p className="text-xl font-bold text-[#174D35]">{formatPrice(order.totalAmount, language)}</p>
              <span className="text-[11px] font-medium text-stone-500 uppercase">{order.paymentMethod} • {order.paymentStatus}</span>
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-[#174D35] hover:text-white text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isBn ? 'ক্যাশ মেমো / ইনভয়েস' : 'View Invoice'}</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {isBn ? 'ডেলিভারি স্ট্যাটাস' : 'Delivery Status'}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#174D35]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                <span>
                  {order.status === 'delivered'
                    ? isBn
                      ? 'ডেলিভারি সম্পন্ন হয়েছে'
                      : 'Delivered Successfully'
                    : isBn
                    ? 'লাইভ নার্সারি ট্র্যাকিং'
                    : 'Live Nursery Tracking'}
                </span>
              </span>
            </div>

            {/* Animated GardenValy Delivery Van Road Track */}
            {(() => {
              const progressPct =
                order.status === 'pending'
                  ? 12
                  : order.status === 'confirmed'
                  ? 38
                  : order.status === 'shipped'
                  ? 68
                  : 92;
              return (
                <div className="relative h-12 mb-3 rounded-2xl bg-[#F7F5EC] border border-stone-200/80 px-4 flex items-center overflow-hidden">
                  {/* Base Road Track */}
                  <div className="w-full h-2 rounded-full bg-stone-200/90 overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#174D35] via-[#22C55E] to-[#4ADE80] transition-all duration-1000 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Animated Delivery Van SVG */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out pointer-events-none"
                    style={{ left: `${progressPct}%` }}
                  >
                    <div className="relative flex items-center justify-center">
                      <svg
                        viewBox="0 0 48 30"
                        className="w-11 h-7 drop-shadow-sm"
                        fill="none"
                      >
                        {/* Van Body */}
                        <rect
                          x="4"
                          y="6"
                          width="26"
                          height="16"
                          rx="3"
                          fill="#174D35"
                        />
                        {/* Van Cabin */}
                        <path
                          d="M30 10H38C40.5 10 42.5 12 43.5 14.5L45 18V22H30V10Z"
                          fill="#22C55E"
                        />
                        {/* Cabin Window */}
                        <path
                          d="M32 12H37.5L40.5 16.5H32V12Z"
                          fill="#E2F8EC"
                        />
                        {/* Botanical Leaf Emblem on Van */}
                        <path
                          d="M14 17C14 12.5 18.5 10 22 10C22 14.5 18.5 17 14 17Z"
                          fill="#4ADE80"
                        />
                        {/* Wheels */}
                        <circle
                          cx="13"
                          cy="23"
                          r="4"
                          fill="#1C1917"
                          stroke="#F5F5F4"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="36"
                          cy="23"
                          r="4"
                          fill="#1C1917"
                          stroke="#F5F5F4"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STEPS.map((step, idx) => {
                const state = getStepState(idx, order.status);
                const Icon = step.icon;
                const isDone = state === 'completed';
                const isCur = state === 'current';
                return (
                  <div key={idx} className={`p-3.5 rounded-xl border text-center transition-all ${
                    isDone ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' :
                    isCur ? 'bg-[#174D35] border-[#174D35] text-white shadow-md scale-[1.02]' : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}>
                    <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-1.5 bg-white/20">
                      {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Icon className={`w-4 h-4 ${isCur ? 'animate-bounce' : ''}`} />}
                    </div>
                    <p className="text-xs font-bold leading-tight">{isBn ? step.labelBn : step.labelEn}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Live Tracking Card */}
          {(order.deliveryProvider || order.trackingNumber) && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-950 font-bold">
                    {isBn ? 'কুরিয়ার পার্টনার: ' : 'Courier Partner: '}
                    <span className="text-indigo-800">{order.deliveryProvider || 'Steadfast Courier'}</span>
                  </p>
                  <p className="text-xs text-stone-600 font-mono mt-0.5">
                    {isBn ? 'ট্র্যাকিং নং: ' : 'Tracking No: '}
                    <span className="font-bold text-stone-900">{order.trackingNumber || 'Pending'}</span>
                  </p>
                </div>
              </div>
              {order.trackingNumber && (
                <a
                  href={order.trackingUrl || `https://steadfast.com.bd/t/${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors w-fit"
                >
                  <span>{isBn ? 'কুরিয়ারে লাইভ ট্র্যাক করুন' : 'Track on Courier'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-700 mb-3">{isBn ? 'অর্ডারের পণ্যসমূহ' : 'Ordered Items'}</h4>
            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getSafeImageUrl(it.imageUrl)}
                      alt={it.productName}
                      className="w-8 h-8 rounded-lg object-cover"
                      onError={(e) => handleImageError(e, getProductFallbackImage())}
                    />
                    <div>
                      <p className="font-semibold text-stone-800">{it.productName}</p>
                      <p className="text-stone-400">{formatNumeral(it.quantity, language)} পিস</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-800">{formatPrice(it.lineSubtotal, language)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-stone-100 text-xs text-stone-500">
            <span>{isBn ? 'সহায়তার জন্য:' : 'For Assistance:'}</span>
            <div className="flex items-center gap-3">
              <a href={`tel:${(settings.contactPhone || BRAND_CONFIG.phone).replace(/\D/g, '')}`} className="flex items-center gap-1 font-semibold text-stone-700 hover:text-[#174D35]">
                <Phone className="w-3.5 h-3.5 text-[#5C8D50]" /> {settings.contactPhone || BRAND_CONFIG.phone}
              </a>
              <a href={`https://wa.me/${(settings.officialWhatsapp || BRAND_CONFIG.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {order && (
        <InvoicePrintModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={order}
        />
      )}
    </div>
  );
};
