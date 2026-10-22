/**
 * @file ProductCard.tsx
 * @description Product card with botanical badges, 1-click buy, compare, stock counters, and quick view.
 */

import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Heart, Zap, GitCompareArrows } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useRouter } from '../../context/RouterContext';
import { formatPrice, formatNumeral, getProductSoldCount } from '../../utils/formatters';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';
import { ProductCardCareBadges } from './ProductCardCareBadges';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { InstantBuyNowModal } from '../shop/InstantBuyNowModal';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onInstantBuy?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onInstantBuy }) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const { navigate } = useRouter();
  const [isJustAdded, setIsJustAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isInstantBuyOpen, setIsInstantBuyOpen] = useState(false);

  const name = language === 'bn' ? product.nameBn : product.nameEn;
  const isAvailable = product.inStock && product.stockQuantity > 0;
  const soldCount = getProductSoldCount(product);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleCardClick = () => navigate(`/product/${product.slug}`);

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
    else setIsQuickViewOpen(true);
  };

  const handleInstantBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInstantBuy) onInstantBuy(product);
    else setIsInstantBuyOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(product, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1400);
  };

  return (
    <>
      <div onClick={handleCardClick} className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer">
        {/* Product Image Area */}
        <div className="relative h-36 min-[360px]:h-44 sm:h-52 overflow-hidden bg-stone-100">
          <img
            src={getSafeImageUrl(product.imageUrl, { type: product.type, categorySlug: product.categorySlug })}
            alt={`${name}${product.botanicalName ? ` (${product.botanicalName})` : ''} - Gardenvaly`}
            width={400}
            height={320}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            onError={(e) => handleImageError(e, getProductFallbackImage(product))}
          />
          {product.discountPercent && (
            <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-red-600 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
              -{formatNumeral(product.discountPercent, language)}%
            </span>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-all shadow-xs cursor-pointer z-10 ${
              isWishlisted ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300' : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-stone-800 shadow-xs z-10">
            <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
            <span>{formatNumeral(product.rating.toFixed(1), language)}</span>
          </div>
        </div>

        {/* Product Body */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            {product.botanicalName && (
              <p className="text-[10px] sm:text-[11px] italic text-[#5C8D50] font-medium truncate">{product.botanicalName}</p>
            )}
            <h3 className="font-serif-botanical font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#174D35] transition-colors mt-0.5 line-clamp-1">
              {name}
            </h3>

            {/* Social Proof & Live Stock (Single clean line on mobile & desktop) */}
            <div className="mt-1 flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10.5px] text-stone-500 whitespace-nowrap overflow-hidden">
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-1 sm:px-1.5 py-0.2 rounded shrink-0">
                {formatNumeral(soldCount, language)}+ {language === 'bn' ? 'বিক্রি' : 'sold'}
              </span>
              <span className="shrink-0">•</span>
              <span className="truncate">{formatNumeral(product.reviewsCount, language)} {language === 'bn' ? 'রিভিউ' : 'reviews'}</span>
              <span className="shrink-0">•</span>
              <span className={`font-semibold px-1 sm:px-1.5 py-0.2 rounded shrink-0 ${
                product.stockQuantity <= 0 ? 'text-rose-600 bg-rose-50' : product.stockQuantity <= 5 ? 'text-amber-700 bg-amber-50' : 'text-stone-600 bg-stone-100'
              }`}>
                {product.stockQuantity <= 0 ? (language === 'bn' ? 'স্টক শেষ' : 'Out of stock') : (language === 'bn' ? `স্টক: ${formatNumeral(product.stockQuantity, language)}টি` : `Stock: ${product.stockQuantity}`)}
              </span>
            </div>

            <ProductCardCareBadges product={product} />
          </div>

          {/* Price & Action Icon Buttons (All 4 buttons + price fit 100% inside mobile & desktop cards) */}
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 leading-none min-w-0 shrink-0">
              <span className="text-xs min-[380px]:text-sm sm:text-base lg:text-lg font-bold text-[#174D35] whitespace-nowrap">
                {formatPrice(product.price, language)}
              </span>
              {product.originalPrice && (
                <span className="text-[9px] sm:text-[11px] text-stone-400 line-through whitespace-nowrap mt-0.5 sm:mt-0">
                  {formatPrice(product.originalPrice, language)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-0.5 min-[380px]:gap-1 sm:gap-1.5 shrink-0">
              {isAvailable && (
                <button
                  type="button"
                  onClick={handleInstantBuyClick}
                  className="w-6 h-6 min-[380px]:w-7 min-[380px]:h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl flex items-center justify-center bg-[#C5A059]/15 hover:bg-[#C5A059] text-[#7A5A1E] hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                  title={language === 'bn' ? '১-ক্লিকে সরাসরি অর্ডার (Buy Now)' : 'Instant Buy Now'}
                  aria-label={language === 'bn' ? 'সরাসরি অর্ডার' : 'Buy Now'}
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                </button>
              )}

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleCompare(product); }}
                className={`w-6 h-6 min-[380px]:w-7 min-[380px]:h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  isCompared ? 'bg-[#174D35] text-[#A3E635]' : 'text-stone-500 hover:text-[#174D35] hover:bg-stone-100'
                }`}
                title={language === 'bn' ? 'পাশাপাশি তুলনা করুন (Compare)' : 'Compare Plant'}
                aria-label={`Compare ${name}`}
              >
                <GitCompareArrows className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickViewClick}
                className="w-6 h-6 min-[380px]:w-7 min-[380px]:h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                title={language === 'bn' ? 'দ্রুত দেখুন (Quick View)' : 'Quick View'}
                aria-label={`Quick view of ${name}`}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                title={isJustAdded ? (language === 'bn' ? 'যোগ হয়েছে' : 'Added') : (language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart')}
                aria-label={isAvailable ? `Add ${name} to cart` : `${name} is out of stock`}
                className={`w-6 h-6 min-[380px]:w-7 min-[380px]:h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shrink-0 shadow-2xs ${
                  !isAvailable ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : isJustAdded ? 'bg-[#5C8D50] text-white' : 'bg-[#174D35] hover:bg-[#123e2a] text-white active:scale-95 cursor-pointer'
                }`}
              >
                {isJustAdded ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isQuickViewOpen && <ProductQuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />}
      {isInstantBuyOpen && <InstantBuyNowModal isOpen={isInstantBuyOpen} onClose={() => setIsInstantBuyOpen(false)} product={product} />}
    </>
  );
};
