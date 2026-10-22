/**
 * @file MobileBottomNav.tsx
 * @description Sleek obsidian-black floating bottom navigation dock for mobile viewports,
 * portaled to document.body with clean, uniform iconography and no colored box behind the Menu label.
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { Home, Layers, Search, ShoppingBag, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatNumeral } from '../../utils/formatters';

interface MobileBottomNavProps {
  onOpenCategories: () => void;
  onCloseMenu?: () => void;
  isMenuOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCategories,
  onCloseMenu,
  isMenuOpen = false,
}) => {
  const { language } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const { cart, setIsCartOpen, setIsSearchOpen } = useCart();
  const { wishlistCount } = useWishlist();

  if (typeof document === 'undefined') return null;

  const isHome = currentPath === '/' && !isMenuOpen;
  const isWishlist = currentPath.includes('wishlist') && !isMenuOpen;

  return createPortal(
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-3 inset-x-3 sm:inset-x-6 z-[60] lg:hidden pointer-events-none safe-area-bottom"
    >
      <div className="pointer-events-auto max-w-md mx-auto bg-[#0B0C0E]/95 backdrop-blur-2xl border border-white/12 rounded-full shadow-[0_16px_44px_rgba(0,0,0,0.85)] px-2.5 py-1.5">
        <div className="grid grid-cols-5 items-center">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => {
              onCloseMenu?.();
              navigate('/');
            }}
            className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 rounded-full transition-all cursor-pointer select-none ${
              isHome ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-zinc-100'
            }`}
            aria-label={language === 'bn' ? 'হোম পেজ' : 'Home'}
          >
            <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] mt-1 whitespace-nowrap leading-none ${isHome ? 'font-bold text-white' : 'font-medium'}`}>
              {language === 'bn' ? 'হোম' : 'Home'}
            </span>
          </button>

          {/* 2. Search */}
          <button
            type="button"
            onClick={() => {
              onCloseMenu?.();
              setIsSearchOpen(true);
            }}
            className="flex flex-col items-center justify-center min-h-[48px] py-1 rounded-full text-zinc-400 hover:text-zinc-100 active:bg-white/10 transition-all cursor-pointer select-none"
            aria-label={language === 'bn' ? 'অনুসন্ধান করুন' : 'Search'}
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-1 font-medium whitespace-nowrap leading-none">
              {language === 'bn' ? 'খুঁজুন' : 'Search'}
            </span>
          </button>

          {/* 3. Menu & Categories (Clean dark styling without colored background fill) */}
          <button
            type="button"
            onClick={onOpenCategories}
            aria-expanded={isMenuOpen}
            aria-label={language === 'bn' ? 'মেনু ও ক্যাটাগরি খুলুন' : 'Open Menu & Categories'}
            className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 rounded-full transition-all cursor-pointer select-none ${
              isMenuOpen ? 'text-white bg-white/12' : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Layers className={`w-5 h-5 ${isMenuOpen ? 'stroke-[2.3]' : 'stroke-[1.9]'}`} />
            <span className={`text-[10px] mt-1 whitespace-nowrap leading-none ${isMenuOpen ? 'font-bold text-white' : 'font-medium'}`}>
              {language === 'bn' ? 'মেনু' : 'Menu'}
            </span>
          </button>

          {/* 4. Cart */}
          <button
            type="button"
            onClick={() => {
              onCloseMenu?.();
              setIsCartOpen(true);
            }}
            className="relative flex flex-col items-center justify-center min-h-[48px] py-1 rounded-full text-zinc-400 hover:text-zinc-100 active:bg-white/10 transition-all cursor-pointer select-none"
            aria-label={`Cart, ${cart.totalQuantity} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cart.totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-white text-[#0B0C0E] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs tabular-nums">
                  {formatNumeral(cart.totalQuantity, language)}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium whitespace-nowrap leading-none">
              {language === 'bn' ? 'কার্ট' : 'Cart'}
            </span>
          </button>

          {/* 5. Wishlist */}
          <button
            type="button"
            onClick={() => {
              onCloseMenu?.();
              navigate('/profile?tab=wishlist');
            }}
            className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 rounded-full transition-all cursor-pointer select-none ${
              isWishlist ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-zinc-100'
            }`}
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${isWishlist ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs tabular-nums">
                  {formatNumeral(wishlistCount, language)}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 whitespace-nowrap leading-none ${isWishlist ? 'font-bold text-white' : 'font-medium'}`}>
              {language === 'bn' ? 'পছন্দ' : 'Wishlist'}
            </span>
          </button>
        </div>
      </div>
    </nav>,
    document.body
  );
};
