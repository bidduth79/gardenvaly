/**
 * @file MobileMenu.tsx
 * @description Mobile slide-out navigation drawer with router integration.
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sprout, Phone, Mail, User, Heart } from 'lucide-react';
import { NAV_LINKS, BRAND_CONFIG } from '../../config/constants';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStoreSettings } from '../../services/settingsService';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const { settings } = useStoreSettings();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = (id: string, href: string) => {
    onClose();
    if (id === 'home') navigate('/');
    else if (id === 'plants') navigate('/plants');
    else if (id === 'seeds') navigate('/seeds');
    else if (id === 'supplies') navigate('/supplies');
    else if (id === 'track') navigate('/track-order');
    else if (id === 'guide') {
      if (currentPath === '/') document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else if (id === 'contact') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else navigate(href);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#F7F5EC] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <button
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="flex items-center gap-2 text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] rounded-lg p-1 -ml-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#174D35] flex items-center justify-center text-white">
                <Sprout className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-botanical font-bold text-base text-[#174D35] leading-none">
                  {language === 'bn'
                    ? settings.storeNameBn || settings.storeNameEn || BRAND_CONFIG.name
                    : settings.storeNameEn || settings.storeNameBn || BRAND_CONFIG.name}
                </span>
                <span className="text-[10px] text-[#C5A059] italic font-medium">
                  {language === 'bn'
                    ? settings.signatureBn || settings.signatureEn || BRAND_CONFIG.signature
                    : settings.signatureEn || settings.signatureBn || BRAND_CONFIG.signature}
                </span>
              </div>
            </button>
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-200/50 transition-colors focus-visible:ring-2 focus-visible:ring-[#174D35]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-5 p-3 rounded-2xl bg-white/90 border border-stone-200/80 shadow-2xs flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {language === 'bn' ? 'ভাষা নির্বাচন / Language' : 'Language / ভাষা নির্বাচন'}
            </span>
            <LanguageSwitcher />
          </div>

          <nav aria-label="Mobile Navigation Links" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const label = language === 'bn' ? link.labelBn : link.labelEn;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.href)}
                  className="w-full text-left px-3.5 py-3 min-h-[44px] flex items-center text-sm sm:text-base font-semibold text-stone-700 hover:text-[#174D35] hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35]"
                >
                  {label}
                </button>
              );
            })}

            {/* Wishlist Link */}
            <button
              onClick={() => {
                onClose();
                navigate('/profile?tab=wishlist');
              }}
              className="w-full text-left px-3.5 py-3 min-h-[44px] flex items-center justify-between text-sm sm:text-base font-semibold text-stone-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{language === 'bn' ? 'পছন্দের তালিকা' : 'Wishlist'}</span>
              </div>
              {wishlistCount > 0 && (
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Customer Account / Sign In */}
            <button
              onClick={() => {
                onClose();
                if (isAuthenticated) navigate('/profile');
                else openLoginModal();
              }}
              className="w-full text-left px-3.5 py-3 min-h-[44px] flex items-center justify-between text-sm sm:text-base font-semibold text-stone-700 hover:text-[#174D35] hover:bg-[#174D35]/10 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35]"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#174D35]" />
                <span>
                  {isAuthenticated
                    ? (language === 'bn' ? 'আমার প্রোফাইল ও অর্ডার' : 'My Account & Orders')
                    : (language === 'bn' ? 'কাস্টমার লগইন / সাইন আপ' : 'Sign In / Register')}
                </span>
              </div>
              {isAuthenticated && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full truncate max-w-[90px]">
                  {customer?.fullName.split(' ')[0]}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/admin');
              }}
              className="w-full text-left px-3.5 py-3 min-h-[44px] flex items-center text-sm font-bold text-[#174D35] bg-[#174D35]/5 hover:bg-[#174D35]/10 rounded-xl transition-colors cursor-pointer mt-2 focus-visible:ring-2 focus-visible:ring-[#174D35]"
            >
              {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-stone-200 text-xs text-stone-600 space-y-2.5">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#5C8D50] shrink-0" />
            <a href={`tel:${(settings.contactPhone || BRAND_CONFIG.phone).replace(/[^0-9+]/g, '')}`} className="hover:text-[#174D35]">
              {settings.contactPhone || BRAND_CONFIG.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#5C8D50] shrink-0" />
            <a href={`mailto:${settings.contactEmail || BRAND_CONFIG.email}`} className="hover:text-[#174D35]">
              {settings.contactEmail || BRAND_CONFIG.email}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
