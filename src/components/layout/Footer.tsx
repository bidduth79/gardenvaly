/**
 * @file Footer.tsx
 * @description Complete botanical footer with configurable contact, social, and policy modals.
 */

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Heart, MessageCircle, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BRAND_CONFIG, SOCIAL_LINKS } from '../../config/constants';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { Button } from '../common/Button';
import { useStoreSettings } from '../../services/settingsService';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const { settings } = useStoreSettings();
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | null>(null);

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
    <footer id="contact" className="bg-[#174D35] text-stone-200 pt-16 pb-12 border-t border-[#174D35]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Signature & Description */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo variant="light" size="large" />
            <p className="text-xs sm:text-sm text-stone-300 max-w-sm leading-relaxed">
              {t('footerAbout')}
            </p>
            <p className="text-xs font-serif-botanical italic text-[#C5A059]">
              {language === 'bn' ? (settings.taglineBn || 'সবুজে সাজুক জীবন') : (settings.taglineEn || 'Grow Green, Live Beautiful')}
            </p>

            {/* Configurable WhatsApp Action Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${(settings.officialWhatsapp || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-500/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp: {settings.officialWhatsapp || '+880 1712-345678'}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li><button type="button" onClick={() => handleQuickLink('plants')} className="hover:text-white transition-colors cursor-pointer text-left">{t('plantsNav')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('seeds')} className="hover:text-white transition-colors cursor-pointer text-left">{t('seedsNav')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('categories')} className="hover:text-white transition-colors cursor-pointer text-left">{t('categoryIndex')}</button></li>
              <li><button type="button" onClick={() => handleQuickLink('tips')} className="hover:text-white transition-colors cursor-pointer text-left">{t('careGuideTips')}</button></li>
              <li><button type="button" onClick={() => navigate('/track-order')} className="text-[#C5A059] font-medium hover:text-white transition-colors cursor-pointer text-left">{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Your Order'}</button></li>
            </ul>
          </div>

          {/* Contact Details Placeholders */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {t('contactUs')}
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-stone-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#5C8D50] shrink-0" />
                <span>{language === 'bn' ? (settings.locationBn || 'ঢাকা, বাংলাদেশ') : (settings.locationEn || 'Dhaka, Bangladesh')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#5C8D50] shrink-0" />
                <a href={`tel:${(settings.contactPhone || '').replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.contactPhone || '+880 1712-345678'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#5C8D50] shrink-0" />
                <a href={`mailto:${settings.contactEmail || 'contact@gardenvaly.com'}`} className="hover:text-white transition-colors">
                  {settings.contactEmail || 'contact@gardenvaly.com'}
                </a>
              </div>
            </div>

            {/* Social Placeholder Links */}
            <div className="pt-3 flex items-center gap-3">
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

        {/* Bottom Bar with Dynamic Year and Policy Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>
            © {new Date().getFullYear()} {language === 'bn' ? (settings.storeNameBn || settings.storeNameEn || BRAND_CONFIG.name) : (settings.storeNameEn || settings.storeNameBn || BRAND_CONFIG.name)} {language === 'bn' ? (settings.signatureBn || settings.signatureEn || BRAND_CONFIG.signature) : (settings.signatureEn || settings.signatureBn || BRAND_CONFIG.signature)}. {t('allRightsReserved')}
          </p>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={() => setActivePolicy('privacy')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              {t('privacyPolicy')}
            </button>
            <span>·</span>
            <button
              onClick={() => setActivePolicy('terms')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              {t('termsOfService')}
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Portal'}
            </button>
          </div>

          <div className="flex items-center gap-1 text-stone-400">
            <span>{t('craftedWith')}</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>{t('forGreenLiving')}</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-stone-200">
            <button onClick={() => setActivePolicy(null)} className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-botanical font-bold text-xl text-stone-900 mb-3">
              {activePolicy === 'privacy' ? t('privacyPolicy') : t('termsOfService')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {activePolicy === 'privacy'
                ? t('privacyPolicyNotice')
                : t('termsOfServiceNotice')}
            </p>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setActivePolicy(null)}>
                {t('close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
