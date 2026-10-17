/**
 * @file FloatingWhatsAppWidget.tsx
 * @description Floating botanical WhatsApp concierge widget with quick topic selection and cart context sharing.
 */

import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/constants';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useStoreSettings } from '../../services/settingsService';

export const FloatingWhatsAppWidget: React.FC = () => {
  const { language } = useLanguage();
  const { cart } = useCart();
  const { settings } = useStoreSettings();
  const [isOpen, setIsOpen] = useState(false);
  const isBn = language === 'bn';

  const rawDigits = (settings.officialWhatsapp || '').replace(/\D/g, '') || '8801712345678';
  const cleanPhone = rawDigits.startsWith('88') ? rawDigits : `88${rawDigits}`;

  const openWhatsApp = (customMessage: string) => {
    let message = customMessage;
    if (cart.items.length > 0) {
      const itemsList = cart.items.map((i) => `• ${i.product.nameEn} (${i.quantity}x)`).join('\n');
      message += `\n\n[আমার কার্টের তালিকা]:\n${itemsList}`;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Botanical Help Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#174D35] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-serif-botanical font-bold text-lg text-[#C5A059]">
                  H
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#174D35] rounded-full" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">
                  {isBn
                    ? `${settings.signatureBn || 'হাসনাহেনা'} • ${settings.storeNameBn || 'গার্ডেনভ্যালি'}`
                    : `${settings.signatureEn || 'Hasna Hena'} • ${settings.storeNameEn || 'Gardenvaly'}`}
                </p>
                <p className="text-[11px] text-emerald-200/90">{isBn ? 'সরাসরি বোটানিক্যাল সহায়তা' : 'Live Botanical Support'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close WhatsApp card"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#F7F5EC]/50 space-y-3">
            <p className="text-xs text-stone-700 leading-relaxed">
              {isBn
                ? 'গাছের সঠিক যত্ন, অর্গানিক বীজ বা কোনো অর্ডার নিয়ে প্রশ্ন থাকলে সরাসরি হোয়াটসঅ্যাপে কথা বলুন।'
                : 'Have questions about plant care, seeds, or orders? Chat with us directly on WhatsApp.'}
            </p>

            {/* Quick Prompts */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => openWhatsApp(isBn ? 'হ্যালো গার্ডেনভ্যালি, আমার গাছের পরিচর্যা বিষয়ে পরামর্শ প্রয়োজন।' : 'Hello Gardenvaly, I need plant care advice.')}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#174D35] hover:bg-emerald-50/50 text-xs text-stone-800 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C8D50]" />
                  <span>{isBn ? 'গাছের পরিচর্যা পরামর্শ' : 'Plant Care Guidance'}</span>
                </span>
                <Send className="w-3 h-3 text-stone-400 group-hover:text-[#174D35]" />
              </button>

              <button
                onClick={() => openWhatsApp(isBn ? 'হ্যালো, আমার সাম্প্রতিক অর্ডারের ডেলিভারি তথ্য জানতে চাই।' : 'Hello, I want to inquire about my order delivery.')}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#174D35] hover:bg-emerald-50/50 text-xs text-stone-800 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#174D35]" />
                  <span>{isBn ? 'অর্ডার ও ডেলিভারি তথ্য' : 'Order & Delivery Info'}</span>
                </span>
                <Send className="w-3 h-3 text-stone-400 group-hover:text-[#174D35]" />
              </button>

              {cart.items.length > 0 && (
                <button
                  onClick={() => openWhatsApp(isBn ? 'হ্যালো গার্ডেনভ্যালি, আমি কার্টের এই গাছগুলো নিতে আগ্রহী।' : 'Hello Gardenvaly, I want to order these items in my cart.')}
                  className="w-full text-left p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isBn ? `কার্টের (${cart.totalQuantity}) পণ্যসহ চ্যাট` : `Send Cart (${cart.totalQuantity} items)`}</span>
                  </span>
                  <Send className="w-3 h-3 text-emerald-700" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trigger Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp live support"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer relative group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">WhatsApp Chat</span>
        {/* Subtle Ping Animation */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600" />
          </span>
        )}
      </button>
    </div>
  );
};
