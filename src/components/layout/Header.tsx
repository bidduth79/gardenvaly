/**
 * @file Header.tsx
 * @description Main sticky header with brand identity, search, cart, and bilingual toggle.
 */

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { MobileMenu } from './MobileMenu';
import { AnnouncementBar } from './AnnouncementBar';
import { MobileBottomNav } from './MobileBottomNav';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRouter } from '../../context/RouterContext';
import { formatNumeral } from '../../utils/formatters';

export const Header: React.FC = () => {
  const { language } = useLanguage();
  const { cart, setIsCartOpen, setIsSearchOpen } = useCart();
  const { customer, isAuthenticated, openLoginModal } = useCustomerAuth();
  const { wishlistCount } = useWishlist();
  const { navigate } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      openLoginModal();
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/88 dark:bg-[#06120D]/88 backdrop-blur-xl backdrop-saturate-180 border-b transition-colors duration-300 ${
        isScrolled
          ? 'border-black/8 dark:border-[#1B3B2E] shadow-xs'
          : 'border-transparent'
      }`}
    >
      {/* Configurable Slim Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-1 sm:gap-4">
        {/* Brand Name & Signature */}
        <BrandLogo variant="dark" size="normal" />

        {/* Desktop Navigation Links */}
        <Navigation />

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Day / Night Mode Switcher */}
          <ThemeToggle />

          {/* Language Switcher (Visible on desktop, inside mobile hamburger menu on mobile) */}
          <div className="hidden lg:flex items-center shrink-0">
            <LanguageSwitcher />
          </div>

          {/* In-App PWA Install Button (Desktop) */}
          <div className="hidden xl:flex items-center shrink-0">
            <PWAInstallButton compact />
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-stone-700 hover:text-[#121111] hover:bg-[#EFEDEE] dark:text-stone-300 dark:hover:bg-[#153427] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0"
            aria-label="Open search catalogue"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger with Badge */}
          <button
            onClick={() => {
              if (isAuthenticated) navigate('/profile?tab=wishlist');
              else navigate('/profile?tab=wishlist');
            }}
            className="relative w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-stone-700 hover:text-rose-600 hover:bg-[#EFEDEE] dark:text-stone-300 dark:hover:bg-[#153427] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0"
            title={language === 'bn' ? `পছন্দের তালিকা (${wishlistCount})` : `Wishlist (${wishlistCount})`}
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="w-5 h-5 text-stone-700 hover:text-rose-600 dark:text-stone-300" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {formatNumeral(wishlistCount, language)}
              </span>
            )}
          </button>

          {/* Customer Profile / Login Trigger */}
          <button
            onClick={handleAccountClick}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0 ${
              isAuthenticated
                ? 'bg-[#174D35]/10 text-[#174D35] hover:bg-[#174D35]/20 font-semibold'
                : 'text-stone-700 hover:text-[#121111] hover:bg-[#EFEDEE] dark:text-stone-300 dark:hover:bg-[#153427]'
            }`}
            title={
              isAuthenticated
                ? (language === 'bn' ? `${customer?.fullName}-এর প্রোফাইল` : `${customer?.fullName}'s Profile`)
                : (language === 'bn' ? 'লগইন / একাউন্ট' : 'Sign In / Account')
            }
            aria-label={isAuthenticated ? 'Customer Profile' : 'Sign In'}
          >
            <User className="w-4.5 h-4.5" />
            {isAuthenticated ? (
              <span className="hidden xl:inline text-xs font-bold max-w-[100px] truncate">
                {customer?.fullName.split(' ')[0]}
              </span>
            ) : (
              <span className="hidden md:inline text-[13px] font-medium">
                {language === 'bn' ? 'লগইন' : 'Sign In'}
              </span>
            )}
          </button>

          {/* Shopping Cart Trigger with Dynamic Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-stone-700 hover:text-[#121111] hover:bg-[#EFEDEE] dark:text-stone-300 dark:hover:bg-[#153427] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0"
            aria-label={`Open cart drawer, ${cart.totalQuantity} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.totalQuantity > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-[#174D35] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {formatNumeral(cart.totalQuantity, language)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Bottom Sheet Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Floating App-like Mobile Bottom Pill Navigation Dock */}
      <MobileBottomNav
        isMenuOpen={isMobileMenuOpen}
        onCloseMenu={() => setIsMobileMenuOpen(false)}
        onOpenCategories={() => setIsMobileMenuOpen((prev) => !prev)}
      />
    </header>
  );
};
