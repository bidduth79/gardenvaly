/**
 * @file FloatingWhatsAppWidget.tsx
 * @description Floating botanical WhatsApp concierge widget that automatically hides when the user reaches the footer.
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useStoreSettings } from '../../services/settingsService';

export const FloatingWhatsAppWidget: React.FC = () => {
  const { language } = useLanguage();
  const { cart } = useCart();
  const { settings } = useStoreSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const isBn = language === 'bn';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkVisibility = () => {
      const heroEl = document.getElementById('home');
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        // Keep hidden while the Hero section occupies the viewport
        const heroInView = heroRect.bottom > 120;
        setIsHeroVisible(heroInView);
        if (heroInView) {
          setIsOpen(false);
        }
      } else {
        setIsHeroVisible(false);
      }

      const footerEl = document.getElementById('contact');
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect();
        const footerInView = footerRect.top < window.innerHeight * 0.92;
        setIsFooterVisible(footerInView);
        if (footerInView) {
          setIsOpen(false);
        }
      }
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

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

  const isHidden = isHeroVisible || isFooterVisible;

  return (
    <div
      aria-hidden={isHidden}
      className={`fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 hidden lg:flex flex-col items-end transition-all duration-300 ${
        isHidden
          ? 'opacity-0 translate-y-4 pointer-events-none'
          : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Expanded Botanical Help Card */}
      {isOpen && !isHidden && (
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

      {/* Trigger Floating Action Button with Botanical Ripple & Swaying Leaf */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp live support"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer relative group"
      >
        {/* Outer Botanical Ripple Wave */}
        {!isOpen && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#25D366] animate-whatsapp-ripple"
          />
        )}

        {/* Swaying Botanical Sprout Leaf on Top-Left of Button */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -left-1.5 w-6 h-6 drop-shadow-xs animate-whatsapp-leaf"
          fill="none"
        >
          <path
            d="M19 4C11 4 6 9 6 17C12 17 18 12 19 4Z"
            fill="#174D35"
            stroke="#4ADE80"
            strokeWidth="1.5"
          />
          <path
            d="M6 17C10 13 14 9 19 4"
            stroke="#86EFAC"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>

        <MessageCircle className="w-7 h-7 relative z-10" />
        <span className="sr-only">WhatsApp Chat</span>
        {/* Subtle Ping Animation */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600 border border-white" />
          </span>
        )}
      </button>
    </div>
  );
};
