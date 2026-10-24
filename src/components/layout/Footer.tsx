/**
 * @file Footer.tsx
 * @description Complete botanical footer filling the lower portion of the full-screen
 * Newsletter-to-Footer section, with 3-column links above the valley hills and the
 * copyright/policy/admin bar grounded at the bottom.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Heart, MessageCircle, X, CheckCircle2, AlertCircle, Sprout, Send, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BRAND_CONFIG, SOCIAL_LINKS } from '../../config/constants';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { Button } from '../common/Button';
import { useStoreSettings } from '../../services/settingsService';
import { GardenValleyLandscape } from './GardenValleyLandscape';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const { settings } = useStoreSettings();
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | null>(null);
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isFooterRevealed, setIsFooterRevealed] = useState(false);
  const footerGridRef = useRef<HTMLDivElement | null>(null);

  const isEmailTypingOrValid = isEmailFocused || email.trim().length > 0 || newsletterStatus === 'success';
  const isValidEmailPreview = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    const el = footerGridRef.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsFooterRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (entry.intersectionRatio >= 0.08 || entry.boundingClientRect.top < window.innerHeight * 0.9)) {
            setIsFooterRevealed(true);
          } else if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight - 8) {
            setIsFooterRevealed(false);
          }
        });
      },
      { rootMargin: '0px', threshold: [0, 0.1] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('success');
    setEmail('');
    setTimeout(() => {
      setNewsletterStatus('idle');
    }, 5000);
  };

  const handleQuickLink = (target: 'plants' | 'seeds' | 'categories' | 'tips') => {
    if (target === 'plants') {
      if (currentPath === '/') document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
      else navigate('/plants');
    } else if (target === 'seeds') {
      if (currentPath === '/') document.getElementById('seeds')?.scrollIntoView({ behavior: 'smooth' });
      else navigate('/seeds');
    } else if (target === 'categories') {
      if (currentPath === '/') document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
      else navigate('/shop');
    } else if (target === 'tips') {
      if (currentPath === '/') document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }
  };

  const rvClass = isFooterRevealed ? 'ov-rv in' : 'ov-rv';

  return (
    <footer
      id="contact"
      style={{ overflowAnchor: 'none' }}
      className="scroll-mt-16 bg-[#174D35] text-stone-200 relative overflow-hidden min-h-[calc(100vh-4rem)] pt-8 sm:pt-10 mt-auto flex flex-col justify-between w-full"
    >
      {/* Unified Single Div: Brand Info + Quick Links + Contact Details + Email Newsletter merged together */}
      <div
        ref={footerGridRef}
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto pt-4 pb-2 relative z-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-6 items-start">
          {/* Column 1: Brand & Signature & Description (4 cols on desktop) */}
          <div
            data-ov-in={isFooterRevealed ? 'true' : undefined}
            style={{ '--rv-delay': '0ms' } as React.CSSProperties}
            className={`${rvClass} sm:col-span-2 lg:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left space-y-2.5`}
          >
            <BrandLogo variant="light" size="large" className="mx-auto lg:mx-0 justify-center lg:justify-start" />
            <p className="text-xs sm:text-sm text-stone-300 max-w-sm leading-relaxed mx-auto lg:mx-0">
              {t('footerAbout')}
            </p>
            <p className="text-xs font-serif-botanical italic text-[#C5A059]">
              {language === 'bn' ? (settings.taglineBn || 'সবুজে সাজুক জীবন') : (settings.taglineEn || 'Grow Green, Live Beautiful')}
            </p>

            {/* Configurable WhatsApp Action Button */}
            <div className="pt-1 flex justify-center lg:justify-start w-full">
              <a
                href={`https://wa.me/${(settings.officialWhatsapp || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-500/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>WhatsApp: {settings.officialWhatsapp || '+880 1712-345678'}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links (2 cols on desktop) */}
          <div
            data-ov-in={isFooterRevealed ? 'true' : undefined}
            style={{ '--rv-delay': '110ms' } as React.CSSProperties}
            className={`${rvClass} sm:col-span-1 lg:col-span-2 space-y-2 text-left`}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-stone-300">
              <li><button type="button" onClick={() => handleQuickLink('plants')} className="hover:text-white transition-colors cursor-pointer text-left">{t('plantsNav')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('seeds')} className="hover:text-white transition-colors cursor-pointer text-left">{t('seedsNav')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('categories')} className="hover:text-white transition-colors cursor-pointer text-left">{t('categoryIndex')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('tips')} className="hover:text-white transition-colors cursor-pointer text-left">{t('careGuideTips')}</button></li>
              <li><button type="button" onClick={() => navigate('/track-order')} className="text-[#C5A059] font-medium hover:text-white transition-colors cursor-pointer text-left">{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Your Order'}</button></li>
            </ul>
          </div>

          {/* Column 3: Contact Details (3 cols on desktop) */}
          <div
            data-ov-in={isFooterRevealed ? 'true' : undefined}
            style={{ '--rv-delay': '220ms' } as React.CSSProperties}
            className={`${rvClass} sm:col-span-1 lg:col-span-3 space-y-2 text-left`}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {t('contactUs')}
            </h4>
            <div className="space-y-1.5 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start sm:items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5C8D50] shrink-0 mt-0.5 sm:mt-0" />
                <span>{language === 'bn' ? (settings.locationBn || 'ঢাকা, বাংলাদেশ') : (settings.locationEn || 'Dhaka, Bangladesh')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5C8D50] shrink-0" />
                <a href={`tel:${(settings.contactPhone || '').replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.contactPhone || '+880 1712-345678'}
                </a>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <Mail className="w-4 h-4 text-[#5C8D50] shrink-0 mt-0.5 sm:mt-0" />
                <a href={`mailto:${settings.contactEmail || 'contact@gardenvaly.com'}`} className="hover:text-white transition-colors break-all sm:break-normal">
                  {settings.contactEmail || 'contact@gardenvaly.com'}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-1 flex items-center flex-wrap gap-2 sm:gap-3">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white text-xs underline">
                Facebook
              </a>
              <span className="text-stone-500">·</span>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white text-xs underline">
                Instagram
              </a>
              <span className="text-stone-500">·</span>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white text-xs underline">
                YouTube
              </a>
            </div>
          </div>

          {/* Column 4: Email Newsletter Unified in the Exact Same Row/Block with Botanical Sprout & Envelope Animation */}
          <div
            data-ov-in={isFooterRevealed ? 'true' : undefined}
            style={{ '--rv-delay': '330ms' } as React.CSSProperties}
            className={`${rvClass} sm:col-span-2 lg:col-span-3 space-y-2 text-center lg:text-left relative`}
          >
            {/* Celebratory Floating Botanical Sparkles on Subscribe (Absolute — Zero Layout Shift) */}
            {newsletterStatus === 'success' && (
              <div aria-hidden="true" className="pointer-events-none absolute -top-3 inset-x-0 flex justify-center lg:justify-start gap-6 z-30">
                <span style={{ '--tx': '-16px' } as React.CSSProperties} className="animate-newsletter-sparkle text-emerald-300 text-sm">🌱</span>
                <span style={{ '--tx': '4px' } as React.CSSProperties} className="animate-newsletter-sparkle text-amber-300 text-sm">✨</span>
                <span style={{ '--tx': '22px' } as React.CSSProperties} className="animate-newsletter-sparkle text-emerald-200 text-sm">🍃</span>
              </div>
            )}

            <div className="inline-flex items-center gap-2.5">
              {/* Interactive Botanical Envelope SVG: Opens flap & sprouts green leaves on focus/type/subscribe */}
              <span
                className={`relative inline-flex items-center justify-center w-8 h-8 rounded-xl border transition-all duration-500 ${
                  isEmailTypingOrValid
                    ? 'bg-emerald-500/20 border-emerald-400/50 shadow-sm shadow-emerald-500/20'
                    : 'bg-white/10 border-white/15 animate-newsletter-float'
                }`}
              >
                <svg viewBox="0 0 32 32" className="w-5 h-5 overflow-visible" fill="none">
                  {/* Sprouting Stem & Leaves emerging from envelope when typing or subscribed */}
                  <g
                    className={`transition-all duration-500 origin-bottom ${
                      isEmailTypingOrValid
                        ? 'opacity-100 -translate-y-1.5 scale-105'
                        : 'opacity-65 translate-y-1 scale-75'
                    }`}
                  >
                    <path d="M16 16 V7" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 11 C12 10 10 7 11 5 C14 5 16 8 16 11 Z" fill="#4ADE80" />
                    <path d="M16 9 C20 8 22 5 21 3 C18 3 16 6 16 9 Z" fill="#86EFAC" />
                    {isValidEmailPreview || newsletterStatus === 'success' ? (
                      <circle cx="16" cy="5.5" r="2.2" fill="#FBBF24" />
                    ) : null}
                  </g>
                  {/* Envelope Body */}
                  <rect x="4" y="12" width="24" height="15" rx="3" fill="#143D29" stroke="#C5A059" strokeWidth="1.8" />
                  {/* Envelope Flap */}
                  <path
                    d={isEmailTypingOrValid ? 'M5 13 L16 6 L27 13' : 'M5 13 L16 20 L27 13'}
                    stroke="#C5A059"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </span>

              <div className="text-left">
                <h4 className="text-sm sm:text-base font-serif-botanical font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>{t('newsletterTitle')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-newsletter-leaf shrink-0" />
                </h4>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto lg:mx-0">
              {t('newsletterSubtitle')}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-1 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="email"
                    value={email}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (newsletterStatus === 'error') setNewsletterStatus('idle');
                    }}
                    placeholder={t('newsletterPlaceholder')}
                    className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADE80] transition-shadow"
                  />
                  {/* Live Botanical Sprout Indicator inside Input */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isValidEmailPreview
                        ? 'text-emerald-500 scale-110 rotate-0 opacity-100'
                        : email.length > 0
                        ? 'text-amber-400 scale-95 -rotate-12 opacity-90'
                        : 'text-stone-400/50 scale-75 opacity-50'
                    }`}
                  >
                    <Sprout className="w-4 h-4" />
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  className="group whitespace-nowrap px-4 py-2 relative overflow-hidden"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>
                      {newsletterStatus === 'success'
                        ? language === 'bn'
                          ? 'যুক্ত হয়েছেন!'
                          : 'Subscribed!'
                        : t('newsletterButton')}
                    </span>
                    {newsletterStatus === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950 animate-bounce shrink-0" />
                    ) : (
                      <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    )}
                  </span>
                </Button>
              </div>

              {/* Fixed-height status row (h-5) so feedback messages never shift the footer height */}
              <div className="h-5 mt-1 flex items-center justify-center lg:justify-start">
                {newsletterStatus === 'success' ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium animate-fade-up-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('newsletterSuccess')}</span>
                  </div>
                ) : newsletterStatus === 'error' ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium animate-fade-up-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('newsletterError')}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-stone-300/75 truncate">
                    {language === 'bn'
                      ? '🌿 ফ্রি মাসিক গার্ডেনিং গাইড ও এক্সক্লুসিভ ডিসকাউন্ট আপডেট'
                      : '🌿 Free monthly gardening guides & exclusive subscriber perks'}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Anchored Valley Landscape + Copyright Bar */}
      <div className="w-full relative z-10 mt-auto">
        {/* Animated Storytelling Botanical Valley Landscape */}
        <GardenValleyLandscape />

        {/* Grounded Subterranean Earth Base Bar BELOW the Road with Divider Line, Copyright, Centered Policies & Admin Portal */}
        <div className="bg-[#0E3122] dark:bg-[#081F15] border-t border-white/15 relative z-20 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 pb-20 lg:py-2.5 grid grid-cols-1 lg:grid-cols-3 items-center text-xs text-stone-300/90 gap-2 lg:gap-4">
            {/* Left: Copyright */}
            <p className="text-center lg:text-left">
              © {new Date().getFullYear()} {language === 'bn' ? (settings.storeNameBn || settings.storeNameEn || BRAND_CONFIG.name) : (settings.storeNameEn || settings.storeNameBn || BRAND_CONFIG.name)} {language === 'bn' ? (settings.signatureBn || settings.signatureEn || BRAND_CONFIG.signature) : (settings.signatureEn || settings.signatureBn || BRAND_CONFIG.signature)}. {t('allRightsReserved')}
            </p>

            {/* Center: Privacy Policy, Terms of Service & Admin Portal (Strictly Centered) */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mx-auto">
              <button
                type="button"
                onClick={() => setActivePolicy('privacy')}
                className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('privacyPolicy')}
              </button>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <button
                type="button"
                onClick={() => setActivePolicy('terms')}
                className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('termsOfService')}
              </button>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="hover:text-[#C5A059] transition-colors cursor-pointer font-medium whitespace-nowrap"
              >
                {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
              </button>
            </div>

            {/* Right: Crafted With Love */}
            <p className="flex items-center justify-center lg:justify-end gap-1.5 text-stone-300/80 whitespace-nowrap">
              <span>{t('craftedWith')}</span>
              <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
              <span>{t('forGreenLiving')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Privacy & Terms Modal */}
      {activePolicy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePolicy(null)}
        >
          <div
            className="bg-white text-stone-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-xl font-serif-botanical font-bold text-[#143D29]">
                {activePolicy === 'privacy' ? t('privacyPolicy') : t('termsOfService')}
              </h3>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setActivePolicy(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              {activePolicy === 'privacy' ? t('privacyPolicyNotice') : t('termsOfServiceNotice')}
            </p>
            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setActivePolicy(null)}>
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
