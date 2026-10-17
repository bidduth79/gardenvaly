/**
 * @file MobileBottomNav.tsx
 * @description Modern app-like floating bottom navigation dock for mobile devices.
 */

import React from 'react';
import { Home, Layers, Search, ShoppingBag, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatNumeral } from '../../utils/formatters';

interface MobileBottomNavProps {
  onOpenCategories: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCategories }) => {
  const { language } = useLanguage();
  const { currentPath, navigate } = useRouter();
  const { cart, setIsCartOpen, setIsSearchOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const isHome = currentPath === '/';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#174D35]/15 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 safe-area-bottom"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors cursor-pointer select-none ${
            isHome ? 'text-[#174D35]' : 'text-stone-500 hover:text-[#174D35]'
          }`}
          aria-label={language === 'bn' ? 'হোম পেজ' : 'Home'}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-0.5 font-medium ${isHome ? 'font-bold' : ''}`}>
            {language === 'bn' ? 'হোম' : 'Home'}
          </span>
        </button>

        {/* Categories / Subcategories */}
        <button
          type="button"
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-500 hover:text-[#174D35] transition-colors cursor-pointer select-none"
          aria-label={language === 'bn' ? 'ক্যাটাগরি মেনু খুলুন' : 'Open Categories'}
        >
          <Layers className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5 font-medium">
            {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
          </span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-500 hover:text-[#174D35] transition-colors cursor-pointer select-none"
          aria-label={language === 'bn' ? 'অনুসন্ধান করুন' : 'Search'}
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5 font-medium">
            {language === 'bn' ? 'খুঁজুন' : 'Search'}
          </span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-500 hover:text-[#174D35] transition-colors cursor-pointer select-none"
          aria-label={`Cart, ${cart.totalQuantity} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cart.totalQuantity > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-[#174D35] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {formatNumeral(cart.totalQuantity, language)}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">
            {language === 'bn' ? 'কার্ট' : 'Cart'}
          </span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => navigate('/profile?tab=wishlist')}
          className="relative flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-500 hover:text-rose-600 transition-colors cursor-pointer select-none"
          aria-label={`Wishlist, ${wishlistCount} items`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {formatNumeral(wishlistCount, language)}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">
            {language === 'bn' ? 'পছন্দ' : 'Wishlist'}
          </span>
        </button>
      </div>
    </nav>
  );
};
