/**
 * @file MobileMenu.tsx
 * @description Sleek obsidian-black slide-up Bottom Sheet navigation menu (#0B0C0E)
 * with refined dark charcoal cards, category accordion, and quick actions.
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sprout, Phone, Mail, User, Heart, Compass } from 'lucide-react';
import { NAV_LINKS, BRAND_CONFIG } from '../../config/constants';
import { HIERARCHICAL_CATEGORIES } from '../../data/mockCategoryHierarchy';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStoreSettings } from '../../services/settingsService';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { MobileCategoryAccordion } from './MobileCategoryAccordion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const { settings } = useStoreSettings();
  const { isAuthenticated, customer, openLoginModal } = useCustomerAuth();
  const { wishlistIds } = useWishlist();
  const wishlistCount = wishlistIds.length;

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleLinkClick = (id: string, href: string) => {
    onClose();
    if (id === 'home') navigate('/');
    else if (id === 'plants') navigate('/plants');
    else if (id === 'seeds') navigate('/seeds');
    else if (id === 'supplies') navigate('/supplies');
    else if (id === 'combos') navigate('/combos');
    else if (id === 'track') navigate('/track-order');
    else if (id === 'contact') {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    } else if (id === 'guide') {
      const el = document.getElementById('tips');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else {
        navigate('/');
        setTimeout(() => document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    } else navigate(href);
  };

  const handleCategorySelect = (slug: string) => {
    onClose();
    navigate(`/category/${slug}`);
  };

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu" className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg mx-auto max-h-[88vh] bg-[#0B0C0E] text-zinc-100 rounded-t-3xl border-t border-white/12 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] px-4 sm:px-5 pt-2.5 pb-24 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-3.5">
          <div className="w-11 h-1.5 bg-zinc-700 rounded-full mx-auto mb-1" aria-hidden="true" />

          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button onClick={() => { onClose(); navigate('/'); }} className="flex items-center gap-2.5 text-left cursor-pointer p-1 -ml-1 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-[#16181D] border border-white/12 flex items-center justify-center text-zinc-100 shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-botanical font-bold text-base text-white leading-none">
                  {language === 'bn' ? settings.storeNameBn || BRAND_CONFIG.name : settings.storeNameEn || BRAND_CONFIG.name}
                </span>
                <span className="text-[10px] text-zinc-400 italic font-medium mt-0.5">
                  {language === 'bn' ? settings.signatureBn || BRAND_CONFIG.signature : settings.signatureEn || BRAND_CONFIG.signature}
                </span>
              </div>
            </button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl bg-[#16181D] hover:bg-[#20232A] border border-white/10 transition-colors cursor-pointer" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-2 rounded-2xl bg-[#131519] border border-white/10 flex items-center justify-between gap-2">
            <LanguageSwitcher />
            <ThemeToggle variant="pill" />
          </div>

          <nav aria-label="Mobile Links" className="space-y-2">
            <div className="flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <Compass className="w-3.5 h-3.5 text-zinc-300" />
              <span>{language === 'bn' ? 'দ্রুত মেনু নেভিগেশন' : 'Quick Navigation'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => {
                const isActive =
                  (link.id === 'plants' && (currentPath === '/plants' || currentPath.startsWith('/category/'))) ||
                  (link.id === 'seeds' && currentPath === '/seeds') ||
                  (link.id === 'supplies' && currentPath === '/supplies') ||
                  (link.id === 'combos' && currentPath === '/combos') ||
                  (link.id === 'track' && currentPath === '/track-order') ||
                  (link.id === 'home' && currentPath === '/');

                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id, link.href)}
                    className={`w-full text-left px-3 py-2.5 min-h-[44px] flex items-center text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-white/14 text-white border-white/30 shadow-xs'
                        : 'bg-[#14161B] text-zinc-300 border-white/8 hover:bg-[#1C1F26] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{language === 'bn' ? link.labelBn : link.labelEn}</span>
                  </button>
                );
              })}
            </div>

            <MobileCategoryAccordion categories={HIERARCHICAL_CATEGORIES} onSelectCategory={handleCategorySelect} />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { onClose(); navigate('/profile?tab=wishlist'); }}
                className="w-full text-left px-3 py-2.5 min-h-[44px] flex items-center justify-between text-xs font-semibold text-zinc-200 bg-[#14161B] hover:bg-[#1C1F26] border border-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">{language === 'bn' ? 'পছন্দের তালিকা' : 'Wishlist'}</span>
                </div>
                {wishlistCount > 0 && <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300">{wishlistCount}</span>}
              </button>

              <button
                onClick={() => { onClose(); if (isAuthenticated) navigate('/profile'); else openLoginModal(); }}
                className="w-full text-left px-3 py-2.5 min-h-[44px] flex items-center justify-between text-xs font-semibold text-zinc-200 bg-[#14161B] hover:bg-[#1C1F26] border border-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <User className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span className="truncate">{isAuthenticated ? (language === 'bn' ? 'আমার প্রোফাইল' : 'My Account') : (language === 'bn' ? 'লগইন / একাউন্ট' : 'Sign In')}</span>
                </div>
                {isAuthenticated && <span className="text-[10px] bg-white/15 text-white font-bold px-1.5 py-0.5 rounded-full truncate max-w-[65px]">{customer?.fullName.split(' ')[0]}</span>}
              </button>
            </div>
          </nav>

          <div className="pt-1">
            <PWAInstallButton />
          </div>
        </div>

        <div className="pt-3.5 border-t border-white/10 text-xs text-zinc-400 flex items-center justify-between flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <a href={`tel:${(settings.contactPhone || BRAND_CONFIG.phone).replace(/[^0-9+]/g, '')}`} className="hover:text-white">
              {settings.contactPhone || BRAND_CONFIG.phone}
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <a href={`mailto:${settings.contactEmail || BRAND_CONFIG.email}`} className="hover:text-white">
              {settings.contactEmail || BRAND_CONFIG.email}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
