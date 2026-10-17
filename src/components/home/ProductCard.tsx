/**
 * @file ProductCard.tsx
 * @description Responsive product card supporting plant/seed specifications, stock validation, and detail routing.
 */

import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Sun, Droplet, MessageSquare, Heart } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRouter } from '../../context/RouterContext';
import { formatPrice, formatNumeral, getProductSoldCount } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { navigate } = useRouter();
  const [isJustAdded, setIsJustAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const name = language === 'bn' ? product.nameBn : product.nameEn;
  const sunlight = language === 'bn' ? product.sunlightBn : product.sunlightEn;
  const water = language === 'bn' ? product.waterBn : product.waterEn;
  const packetSize = language === 'bn' ? product.packetSizeBn : product.packetSizeEn;
  const isAvailable = product.inStock && product.stockQuantity > 0;

  const soldCount = getProductSoldCount(product);

  const handleCardClick = () => {
    if (onQuickView) onQuickView(product);
    else navigate(`/product/${product.slug}`);
  };

  const handleReviewsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/product/${product.slug}#reviews`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(product, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1400);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative h-36 min-[360px]:h-44 sm:h-52 overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={`${name}${product.botanicalName ? ` (${product.botanicalName})` : ''} - Gardenvaly`}
          width={400}
          height={320}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />

        {product.discountPercent && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-red-600 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
            -{formatNumeral(product.discountPercent, language)}%
          </span>
        )}

        {/* Wishlist Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-all shadow-xs cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300'
              : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? (language === 'bn' ? 'পছন্দের তালিকা থেকে সরান' : 'Remove from wishlist') : (language === 'bn' ? 'পছন্দের তালিকায় যুক্ত করুন' : 'Add to wishlist')}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Rating Badge */}
        <button
          type="button"
          onClick={handleReviewsClick}
          className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-stone-800 shadow-xs hover:bg-[#174D35] hover:text-white transition-colors cursor-pointer z-10"
          title={language === 'bn' ? `${formatNumeral(product.reviewsCount, language)}টি মতামত দেখতে ক্লিক করুন` : `Click to view ${product.reviewsCount} reviews`}
        >
          <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
          <span>{formatNumeral(product.rating.toFixed(1), language)}</span>
        </button>

        {packetSize && (
          <span className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 bg-[#174D35]/90 text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md backdrop-blur-xs">
            {packetSize}
          </span>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.botanicalName && (
            <p className="text-[10px] sm:text-[11px] italic text-[#5C8D50] font-medium truncate">
              {product.botanicalName}
            </p>
          )}

          <h3 className="font-serif-botanical font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#174D35] transition-colors mt-0.5 line-clamp-1">
            <a
              href={`/product/${product.slug}`}
              onClick={(e) => {
                e.preventDefault();
                handleCardClick();
              }}
              className="hover:underline"
            >
              {name}
            </a>
          </h3>

          {/* Rating, Reviews Link & Sold Count */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px]">
            <button
              type="button"
              onClick={handleReviewsClick}
              className="inline-flex items-center gap-1 text-stone-600 hover:text-[#174D35] hover:underline cursor-pointer font-medium group/rev"
              title={language === 'bn' ? 'মতামত দেখতে ক্লিক করুন' : 'Click to view reviews'}
            >
              <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059] shrink-0" />
              <span className="font-bold text-stone-800 group-hover/rev:text-[#174D35]">
                {formatNumeral(product.rating.toFixed(1), language)}
              </span>
              <span className="text-stone-400 group-hover/rev:text-[#174D35] underline decoration-stone-300">
                ({formatNumeral(product.reviewsCount, language)} {language === 'bn' ? 'মতামত' : 'reviews'})
              </span>
            </button>
            <span className="text-stone-300">·</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50/80 px-1.5 py-0.5 rounded text-[10px]">
              {formatNumeral(soldCount, language)}+ {language === 'bn' ? 'বিক্রি' : 'sold'}
            </span>
          </div>

          {product.type === 'plant' ? (
            <div className="mt-1.5 sm:mt-2 flex items-center gap-2 text-[10px] sm:text-[11px] text-stone-500">
              <span className="flex items-center gap-1 truncate max-w-[80px] sm:max-w-[90px]">
                <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">{sunlight}</span>
              </span>
              <span className="flex items-center gap-1 truncate max-w-[80px] sm:max-w-[90px]">
                <Droplet className="w-3 h-3 text-cyan-600 shrink-0" />
                <span className="truncate">{water}</span>
              </span>
            </div>
          ) : (
            <p className="mt-1 text-[10px] sm:text-[11px] text-stone-500 line-clamp-1">
              {language === 'bn' ? product.shortDescBn : product.shortDescEn}
            </p>
          )}
        </div>

        {/* Price & Action Controls */}
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-stone-100 flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-[#174D35]">
                {formatPrice(product.price, language)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-[11px] text-stone-400 line-through">
                  {formatPrice(product.originalPrice, language)}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-stone-400 font-medium">
              {isAvailable ? t('inStock') : t('outOfStock')}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 self-end min-[420px]:self-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#174D35]"
              title={t('viewDetails')}
              aria-label={`View details of ${name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              aria-label={isAvailable ? `Add ${name} to cart` : `${name} is out of stock`}
              title={isAvailable ? t('addToCart') : t('outOfStock')}
              className={`w-9 h-9 sm:w-auto min-h-[36px] sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-[#174D35] shrink-0 ${
                !isAvailable
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isJustAdded
                  ? 'bg-[#5C8D50] text-white shadow-xs'
                  : 'bg-[#174D35] hover:bg-[#123e2a] text-white shadow-xs active:scale-95 cursor-pointer'
              }`}
            >
              {isJustAdded ? (
                <>
                  <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{t('addedToCart')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">
                    {isAvailable ? t('addToCart') : t('outOfStock')}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
