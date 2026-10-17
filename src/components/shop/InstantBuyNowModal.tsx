/**
 * @file InstantBuyNowModal.tsx
 * @description High-conversion 1-click Cash on Delivery order modal.
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ShoppingBag, Plus, Minus, Truck } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { orderService } from '../../services/orderService';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { isValidBdPhone, isNonEmpty } from '../../utils/validation';

interface InstantBuyNowModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InstantBuyNowModal: React.FC<InstantBuyNowModalProps> = ({ product, isOpen, onClose }) => {
  const { language } = useLanguage();
  const { navigate } = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [deliveryZone, setDeliveryZone] = useState<'dhaka' | 'outside'>('dhaka');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderNo, setConfirmedOrderNo] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setConfirmedOrderNo(null);
      setErrors({});
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const deliveryCharge = deliveryZone === 'dhaka' ? 60 : 120;
  const subtotal = product.price * quantity;
  const totalAmount = subtotal + deliveryCharge;
  const name = language === 'bn' ? product.nameBn : product.nameEn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!isNonEmpty(fullName)) newErrors.fullName = language === 'bn' ? 'আপনার নাম লিখুন' : 'Name is required';
    if (!isValidBdPhone(phone)) newErrors.phone = language === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন' : 'Valid 11-digit phone required';
    if (!isNonEmpty(address)) newErrors.address = language === 'bn' ? 'ডেলিভারি ঠিকানা লিখুন' : 'Address is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    try {
      const order = await orderService.createOrder({
        customer: { fullName, mobileNumber: phone, division: deliveryZone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka', district: deliveryZone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka', upazila: deliveryZone === 'dhaka' ? 'Dhaka City' : 'Upazila', addressDetail: address },
        items: [{ productId: product.id, productName: product.nameEn, slug: product.slug, imageUrl: product.imageUrl, quantity, unitPrice: product.price, lineSubtotal: subtotal }],
        subtotal, deliveryCharge, totalAmount, deliveryMethod: 'home-delivery', paymentMethod: 'cash-on-delivery', adminNotes: '1-Click Instant Buy Now modal order',
      });
      setConfirmedOrderNo(order?.orderNumber || 'GV-ONLINE');
    } catch {
      setErrors({ form: language === 'bn' ? 'অর্ডার ব্যর্থ হয়েছে' : 'Order failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="1-Click Instant Checkout" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 sm:p-6 z-10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#174D35]/10 text-[#174D35] flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-serif-botanical font-bold text-base text-stone-900 leading-tight">
                {language === 'bn' ? 'সরাসরি দ্রুত অর্ডার (ক্যাশ অন ডেলিভারি)' : 'Instant 1-Click Order (COD)'}
              </h3>
              <p className="text-[11px] text-stone-500">{language === 'bn' ? 'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন' : 'Pay when you receive your plants'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrderNo ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-stone-900 font-serif-botanical">
                {language === 'bn' ? 'অভিনন্দন! আপনার অর্ডার গৃহীত হয়েছে' : 'Congratulations! Order Placed'}
              </h4>
              <p className="text-sm font-semibold text-[#174D35]">
                {language === 'bn' ? 'অর্ডার নম্বর:' : 'Order ID:'} {confirmedOrderNo}
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto pt-1 leading-relaxed">
                {language === 'bn' ? 'আমাদের নার্সারি প্রতিনিধি শীঘ্রই আপনার নম্বরে কল করে অর্ডার নিশ্চিত করবেন।' : 'Our nursery representative will call your number shortly to confirm.'}
              </p>
            </div>
            <button
              onClick={() => { onClose(); navigate(`/track-order?orderId=${confirmedOrderNo}`); }}
              className="w-full py-2.5 rounded-xl bg-[#174D35] text-white font-bold text-xs shadow-md hover:bg-[#123e2a] transition-all cursor-pointer"
            >
              {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Your Order'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-3 space-y-3.5">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F7F5EC] border border-stone-200/80">
              <img src={product.imageUrl} alt={name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-stone-900 truncate">{name}</h4>
                <p className="text-xs font-bold text-[#174D35]">{formatPrice(product.price, language)}</p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5 shrink-0">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold font-mono">{formatNumeral(quantity, language)}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)} className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={language === 'bn' ? 'উদা: মোঃ আরিফুল ইসলাম' : 'e.g. Ariful Islam'} className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174D35]" />
                {errors.fullName && <p className="text-[10px] text-red-600 mt-0.5">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="017XXXXXXXX" className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174D35]" />
                {errors.phone && <p className="text-[10px] text-red-600 mt-0.5">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{language === 'bn' ? 'ডেলিভারি এলাকা *' : 'Delivery Area *'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setDeliveryZone('dhaka')} className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${deliveryZone === 'dhaka' ? 'border-[#174D35] bg-[#174D35]/10 text-[#174D35]' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                    <Truck className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ঢাকার ভেতরে (৳৬০)' : 'Inside Dhaka (৳60)'}</span>
                  </button>
                  <button type="button" onClick={() => setDeliveryZone('outside')} className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${deliveryZone === 'outside' ? 'border-[#174D35] bg-[#174D35]/10 text-[#174D35]' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                    <Truck className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ঢাকার বাইরে (৳১২০)' : 'Outside Dhaka (৳120)'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{language === 'bn' ? 'সম্পূর্ণ ঠিকানা *' : 'Full Delivery Address *'}</label>
                <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder={language === 'bn' ? 'বাসা/রোড নম্বর, এলাকা, থানা ও জেলা...' : 'House/Road, Area, City...'} className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174D35]" />
                {errors.address && <p className="text-[10px] text-red-600 mt-0.5">{errors.address}</p>}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600"><span>{language === 'bn' ? 'চারার মূল্য:' : 'Price:'}</span><span>{formatPrice(subtotal, language)}</span></div>
              <div className="flex justify-between text-stone-600"><span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery:'}</span><span>{formatPrice(deliveryCharge, language)}</span></div>
              <div className="flex justify-between text-stone-900 font-bold pt-1 border-t border-stone-200 text-sm">
                <span>{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total:'}</span>
                <span className="text-[#174D35]">{formatPrice(totalAmount, language)}</span>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-[#174D35] hover:bg-[#123e2a] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>{isSubmitting ? (language === 'bn' ? 'অর্ডার হচ্ছে...' : 'Processing...') : (language === 'bn' ? `অর্ডার কনফার্ম করুন (${formatPrice(totalAmount, language)})` : `Confirm Order (${formatPrice(totalAmount, language)})`)}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
