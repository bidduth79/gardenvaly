/**
 * @file Footer.tsx
 * @description Complete botanical footer filling the lower portion of the full-screen
 * Newsletter-to-Footer section, with 3-column links above the valley hills and the
 * copyright/policy/admin bar grounded at the bottom.
 */

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Heart, MessageCircle, X, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  return (
    <footer
      id="contact"
      className="scroll-mt-16 bg-[#174D35] text-stone-200 relative overflow-hidden pt-5 sm:pt-7 mt-auto flex flex-col justify-between w-full"
    >
      {/* Unified Single Div: Newsletter + Brand Info + Quick Links + Contact Details */}
      <div className="ov-rv max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-1 pb-1 md:-mb-12 lg:-mb-16 relative z-20">
        {/* Newsletter Block — Always kept together inside the unified Footer div */}
        <div className="text-center max-w-2xl mx-auto pb-3 mb-3.5 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white/10 text-[#C5A059] mb-1">
            <Mail className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-base sm:text-lg lg:text-xl font-serif-botanical font-bold text-white tracking-tight">
            {t('newsletterTitle')}
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-200 mt-0.5 max-w-xl mx-auto leading-relaxed">
            {t('newsletterSubtitle')}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-2 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (newsletterStatus === 'error') setNewsletterStatus('idle');
                }}
                placeholder={t('newsletterPlaceholder')}
                className="flex-1 px-3.5 py-1.5 rounded-xl bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
              <Button
                type="submit"
                variant="gold"
                size="sm"
                className="whitespace-nowrap px-4 py-1.5"
              >
                {t('newsletterButton')}
              </Button>
            </div>

            {newsletterStatus === 'success' && (
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t('newsletterSuccess')}</span>
              </div>
            )}
            {newsletterStatus === 'error' && (
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-amber-300 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{t('newsletterError')}</span>
              </div>
            )}
          </form>

          <p className="mt-1 text-[10px] text-stone-300/80">
            Demo storefront — No personal data is stored on external servers.
          </p>
        </div>

        {/* Brand + Links + Contact inside the exact same div */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-3 sm:gap-4 pb-1 max-w-5xl mx-auto">
          {/* Brand & Signature & Description (Centered on Mobile, Left-aligned on Desktop) */}
          <div className="col-span-2 md:col-span-5 flex flex-col items-center text-center md:items-start md:text-left space-y-1.5">
            <BrandLogo variant="light" size="large" className="mx-auto md:mx-0 justify-center md:justify-start" />
            <p className="text-xs text-stone-300 max-w-xs leading-relaxed mx-auto md:mx-0">
              {t('footerAbout')}
            </p>
            <p className="text-xs font-serif-botanical italic text-[#C5A059]">
              {language === 'bn' ? (settings.taglineBn || 'সবুজে সাজুক জীবন') : (settings.taglineEn || 'Grow Green, Live Beautiful')}
            </p>

            {/* Configurable WhatsApp Action Button (Centered on Mobile) */}
            <div className="pt-0.5 flex justify-center md:justify-start w-full">
              <a
                href={`https://wa.me/${(settings.officialWhatsapp || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-500/40 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>WhatsApp: {settings.officialWhatsapp || '+880 1712-345678'}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (Left column on mobile, Middle column on desktop) */}
          <div className="col-span-1 md:col-span-3 space-y-1 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-1 text-xs text-stone-300">
              <li><button type="button" onClick={() => handleQuickLink('plants')} className="hover:text-white transition-colors cursor-pointer text-left">{t('plantsNav')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('seeds')} className="hover:text-white transition-colors cursor-pointer text-left">{t('seedsNav')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('categories')} className="hover:text-white transition-colors cursor-pointer text-left">{t('categoryIndex')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('tips')} className="hover:text-white transition-colors cursor-pointer text-left">{t('careGuideTips')}</button></li>
              <li><button type="button" onClick={() => navigate('/track-order')} className="text-[#C5A059] font-medium hover:text-white transition-colors cursor-pointer text-left">{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Your Order'}</button></li>
            </ul>
          </div>

          {/* Contact Details (Right column side-by-side on mobile, Right column on desktop) */}
          <div className="col-span-1 md:col-span-4 space-y-1 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {t('contactUs')}
            </h4>
            <div className="space-y-1 text-xs text-stone-300">
              <div className="flex items-start sm:items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#5C8D50] shrink-0 mt-0.5 sm:mt-0" />
                <span>{language === 'bn' ? (settings.locationBn || 'ঢাকা, বাংলাদেশ') : (settings.locationEn || 'Dhaka, Bangladesh')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#5C8D50] shrink-0" />
                <a href={`tel:${(settings.contactPhone || '').replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.contactPhone || '+880 1712-345678'}
                </a>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5C8D50] shrink-0 mt-0.5 sm:mt-0" />
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
