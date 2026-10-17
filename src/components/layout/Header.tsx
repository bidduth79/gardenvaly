/**
 * @file Header.tsx
 * @description Main sticky header with brand identity, search, cart, and bilingual toggle.
 */

import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, Heart, User } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '../common/ThemeToggle';
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

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      openLoginModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F5EC]/95 backdrop-blur-md border-b border-[#174D35]/10 shadow-xs">
      {/* Configurable Slim Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-1 sm:gap-4">
        {/* Brand Name & Signature */}
        <BrandLogo variant="dark" size="normal" />

        {/* Desktop Navigation Links */}
        <Navigation />

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Day / Night Mode Switcher */}
          <ThemeToggle />

          {/* Language Switcher (Visible on desktop, inside mobile hamburger menu on mobile) */}
          <div className="hidden lg:flex items-center shrink-0">
            <LanguageSwitcher />
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-stone-700 hover:text-[#174D35] hover:bg-stone-200/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0"
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
            className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-stone-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0"
            title={language === 'bn' ? `পছন্দের তালিকা (${wishlistCount})` : `Wishlist (${wishlistCount})`}
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="w-5 h-5 text-stone-700 hover:text-rose-600" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {formatNumeral(wishlistCount, language)}
              </span>
            )}
          </button>

          {/* Customer Profile / Login Trigger */}
          <button
            onClick={handleAccountClick}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0 ${
              isAuthenticated
                ? 'bg-[#174D35]/10 text-[#174D35] hover:bg-[#174D35]/20 font-semibold'
                : 'text-stone-700 hover:text-[#174D35] hover:bg-stone-200/60'
            }`}
            title={
              isAuthenticated
                ? (language === 'bn' ? `${customer?.fullName}-এর প্রোফাইল` : `${customer?.fullName}'s Profile`)
                : (language === 'bn' ? 'লগইন / একাউন্ট' : 'Sign In / Account')
            }
            aria-label={isAuthenticated ? 'Customer Profile' : 'Sign In'}
          >
            <User className="w-5 h-5" />
            {isAuthenticated ? (
              <span className="hidden xl:inline text-xs font-bold max-w-[100px] truncate">
                {customer?.fullName.split(' ')[0]}
              </span>
            ) : (
              <span className="hidden md:inline text-xs font-semibold">
                {language === 'bn' ? 'লগইন' : 'Sign In'}
              </span>
            )}
          </button>

          {/* Shopping Cart Trigger with Dynamic Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-stone-700 hover:text-[#174D35] hover:bg-stone-200/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0"
            aria-label={`Open cart drawer, ${cart.totalQuantity} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.totalQuantity > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-[#174D35] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {formatNumeral(cart.totalQuantity, language)}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-stone-200/70 hover:bg-[#174D35] text-stone-800 hover:text-white border border-stone-300/80 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Floating App-like Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        onOpenCategories={() => setIsMobileMenuOpen(true)}
      />
    </header>
  );
};
