/**
 * @file ProductDetailPage.tsx
 * @description Dedicated product detail page with thumbnail gallery, specifications, and related picks.
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Sun, Droplet, Check, Star, Flame, User, ThumbsUp, MessageSquare, Send, Heart, Zap, GitCompareArrows } from 'lucide-react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { formatPrice, formatNumeral, getProductSoldCount } from '../utils/formatters';
import { Breadcrumbs } from '../components/shop/Breadcrumbs';
import { ProductGallery } from '../components/shop/ProductGallery';
import { ProductCard } from '../components/home/ProductCard';
import { Button } from '../components/common/Button';
import { PlantCareGuideModal } from '../components/home/PlantCareGuideModal';
import { InstantBuyNowModal } from '../components/shop/InstantBuyNowModal';
import { FrequentlyBoughtTogether } from '../components/shop/FrequentlyBoughtTogether';
import { reviewService, REVIEWS_UPDATED_EVENT } from '../services/reviewService';
import { MOCK_PRODUCTS } from '../data/mockProducts';

import { usePageSeo } from '../hooks/usePageSeo';
import { analyticsService } from '../services/analyticsService';

export const ProductDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { language, t } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const [product, setProduct] = useState<Product | null>(() => {
    if (!params.slug) return null;
    return MOCK_PRODUCTS.find((p) => p.slug === params.slug || p.id === params.slug) || null;
  });
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const isCompared = product ? isInCompare(product.id) : false;
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [justAdded, setJustAdded] = useState(false);
  const [isInstantBuyOpen, setIsInstantBuyOpen] = useState(false);
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState(() => reviewService.getReviews());
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setLocalReviews(reviewService.getReviews());
    };
    window.addEventListener(REVIEWS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(REVIEWS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  useEffect(() => {
    async function loadProduct() {
      if (!params.slug) return;
      const found = await productService.getProductBySlug(params.slug);
      if (found) {
        setProduct(found);
        setQuantity(1);
        analyticsService.trackViewItem(found, language);
        const related = await productService.getProductsByCategory(found.categorySlug);
        setRelatedProducts(related.filter((p: Product) => p.id !== found.id).slice(0, 4));
      } else {
        setProduct(null);
      }
    }
    loadProduct();
  }, [params.slug, language]);

  const soldCount = product ? getProductSoldCount(product) : 0;

  const scrollToReviews = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById('reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#reviews') {
      const timer = setTimeout(() => {
        const el = document.getElementById('reviews');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [params.slug, product?.id]);

  const name = product ? (language === 'bn' ? product.nameBn : product.nameEn) : '';
  const desc = product ? (language === 'bn' ? product.fullDescBn : product.fullDescEn) : '';

  // Reactive SEO & Rich Structured Data
  usePageSeo({
    title: product
      ? language === 'bn'
        ? `${product.nameBn} (${product.nameEn}) | Gardenvaly — by Hasna Hena`
        : `${product.nameEn}${product.botanicalName ? ` – ${product.botanicalName}` : ''} | Gardenvaly by Hasna Hena`
      : language === 'bn'
      ? 'পণ্য পাওয়া যায়নি | Gardenvaly'
      : 'Product Not Found | Gardenvaly',
    description: product ? desc.slice(0, 160) : 'The requested botanical item could not be found.',
    canonicalPath: product ? `/product/${product.slug}` : `/product/${params.slug || ''}`,
    robots: product ? 'index, follow' : 'noindex, nofollow',
    ogType: product ? 'product' : 'website',
    ogImage: product?.imageUrl || (product?.images && product.images[0]),
    lang: language,
    jsonLd: product
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name,
            image: product.images && product.images.length > 0 ? product.images : [product.imageUrl],
            description: desc,
            sku: product.SKU,
            brand: {
              '@type': 'Brand',
              name: 'Gardenvaly by Hasna Hena',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'BDT',
              price: product.price,
              itemCondition: 'https://schema.org/NewCondition',
              availability:
                product.inStock && product.stockQuantity > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'Gardenvaly by Hasna Hena',
              },
            },
            ...(product.rating && product.reviewsCount > 0
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: product.rating,
                    reviewCount: product.reviewsCount,
                  },
                }
              : {}),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: language === 'bn' ? 'হোম' : 'Home', item: '/' },
              { '@type': 'ListItem', position: 2, name: language === 'bn' ? 'শপ' : 'Shop', item: '/shop' },
              { '@type': 'ListItem', position: 3, name: product.category, item: `/category/${product.categorySlug}` },
              { '@type': 'ListItem', position: 4, name, item: `/product/${product.slug}` },
            ],
          },
        ]
      : undefined,
  });

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif-botanical font-bold text-stone-900">{t('productNotFound')}</h1>
        <p className="text-stone-500 text-sm mt-2">{t('productNotFoundDesc')}</p>
        <div className="mt-6">
          <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToShop')}
          </Button>
        </div>
      </div>
    );
  }

  const maxStock = product.stockQuantity || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Breadcrumbs
        items={[
          { label: t('shop'), path: '/shop' },
          { label: product.category, path: `/category/${product.categorySlug}` },
          { label: name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6">
          <ProductGallery
            images={
              product.images && product.images.length > 0
                ? product.images
                : [product.imageUrl].filter((u): u is string => Boolean(u && u.trim().length > 0))
            }
            name={name}
            type={product.type}
            categorySlug={product.categorySlug}
          />
        </div>

        <div className="lg:col-span-6 space-y-5">
          <div>
            {product.botanicalName && (
              <p className="text-xs italic text-[#5C8D50] font-medium tracking-wide">{product.botanicalName}</p>
            )}
            <h1 className="text-2xl sm:text-4xl font-serif-botanical font-bold text-stone-900 mt-1">{name}</h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs text-stone-500">
              <button
                type="button"
                onClick={scrollToReviews}
                className="flex items-center gap-1.5 text-stone-700 hover:text-[#174D35] hover:underline cursor-pointer group"
                title={language === 'bn' ? 'মতামত দেখতে ক্লিক করুন' : 'Click to view reviews'}
              >
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-stone-900 ml-1">{formatNumeral(product.rating.toFixed(1), language)}</span>
                </div>
                <span className="text-[#174D35] font-semibold underline decoration-stone-300 group-hover:decoration-[#174D35]">
                  ({formatNumeral(product.reviewsCount, language)} {t('reviews')})
                </span>
              </button>
              <span>·</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-xs">
                <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{formatNumeral(soldCount, language)}+ {language === 'bn' ? 'বিক্রি' : 'sold'}</span>
              </span>
              <span>·</span>
              <span>{t('sku')}: {product.SKU}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 pt-2 border-t border-stone-100">
            <span className="text-3xl font-bold text-[#174D35]">{formatPrice(product.price, language)}</span>
            {product.originalPrice && (
              <span className="text-base text-stone-400 line-through">{formatPrice(product.originalPrice, language)}</span>
            )}
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {product.inStock ? `${formatNumeral(product.stockQuantity, language)} ${t('stockLeft')}` : t('outOfStock')}
            </span>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">{desc}</p>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-stone-200/80 text-xs">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <span><strong>{t('sunlight')}:</strong> {language === 'bn' ? product.sunlightBn : product.sunlightEn}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-600 shrink-0" />
              <span><strong>{t('watering')}:</strong> {language === 'bn' ? product.waterBn : product.waterEn}</span>
            </div>
          </div>

          {product.type === 'plant' && (
            <button
              onClick={() => setIsCareModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-cyan-50/80 hover:bg-cyan-100/80 border border-cyan-200 text-cyan-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-600" />
              <span>{language === 'bn' ? '💧 পানি দেওয়ার রুটিন ও কেয়ার ক্যালকুলেটর' : '💧 Watering Routine & Care Guide'}</span>
            </button>
          )}

          <div className="space-y-4 pt-3 border-t border-stone-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-between border border-stone-300 rounded-xl bg-white self-center sm:self-auto">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-stone-800 text-base font-bold cursor-pointer rounded-l-xl hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-[#174D35]"
                  disabled={!product.inStock}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-center min-w-[36px]">{formatNumeral(quantity, language)}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-stone-800 text-base font-bold cursor-pointer rounded-r-xl hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-[#174D35]"
                  disabled={!product.inStock || quantity >= maxStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="md"
                className="flex-1 min-h-[44px]"
                disabled={!product.inStock}
                icon={justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                onClick={() => {
                  addToCart(product, quantity);
                  analyticsService.trackAddToCart(product, quantity, language);
                  setJustAdded(true);
                  setTimeout(() => setJustAdded(false), 1500);
                }}
              >
                {justAdded ? t('addedToCart') : t('addToCart')}
              </Button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => product && toggleWishlist(product.id)}
                className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-300'
                }`}
                title={isWishlisted ? (language === 'bn' ? 'পছন্দের তালিকা থেকে সরান' : 'Remove from wishlist') : (language === 'bn' ? 'পছন্দের তালিকায় যুক্ত করুন' : 'Add to wishlist')}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Compare Button */}
              <button
                type="button"
                onClick={() => product && toggleCompare(product)}
                className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  isCompared
                    ? 'bg-[#174D35] border-[#174D35] text-[#A3E635]'
                    : 'bg-white border-stone-200 text-stone-600 hover:text-[#174D35] hover:border-[#174D35]'
                }`}
                title={language === 'bn' ? 'পাশাপাশি তুলনা করুন (Compare)' : 'Compare Plant'}
                aria-label="Toggle Compare"
              >
                <GitCompareArrows className="w-5 h-5" />
              </button>
            </div>

            <Button
              variant="gold"
              fullWidth
              size="md"
              className="min-h-[44px]"
              disabled={!product.inStock}
              icon={<Zap className="w-4 h-4 fill-current" />}
              onClick={() => setIsInstantBuyOpen(true)}
            >
              {language === 'bn' ? '১-ক্লিকে সরাসরি অর্ডার (ক্যাশ অন ডেলিভারি)' : t('buyNow')}
            </Button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle Widget */}
      <FrequentlyBoughtTogether currentProduct={product} />

      {/* Customer Reviews Section */}
      <section id="reviews" className="pt-10 border-t border-stone-200 scroll-mt-24 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C8D50] mb-1">
              <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
              <span>{language === 'bn' ? 'গ্রাহক পর্যালোচনা' : 'Verified Reviews'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-botanical font-bold text-stone-900">
              {language === 'bn' ? 'মতামত ও রিভিউ' : 'Ratings & Customer Reviews'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {language === 'bn'
                ? `এই পণ্যটি নিয়ে ${formatNumeral(product.reviewsCount, language)}টি যাচাইকৃত গ্রাহক মতামত`
                : `${formatNumeral(product.reviewsCount, language)} verified customer ratings`}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 self-start sm:self-auto">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                {formatNumeral(product.rating.toFixed(1), language)}
              </span>
              <span className="text-[11px] text-stone-400 block font-medium">/ ৫.০</span>
            </div>
            <div className="border-l border-stone-200 pl-4 space-y-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{language === 'bn' ? '১০০% খাঁটি ক্রেতার রিভিউ' : '100% Verified Purchases'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {localReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.avatarUrl}
                      alt={language === 'bn' ? rev.authorBn : rev.authorEn}
                      className="w-9 h-9 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900 leading-tight">
                        {language === 'bn' ? rev.authorBn : rev.authorEn}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {language === 'bn' ? rev.locationBn : rev.locationEn}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {language === 'bn' ? rev.dateBn : rev.dateEn}
                  </span>
                </div>

                <div className="flex items-center text-amber-500 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  {language === 'bn' ? 'ভেরিফাইড ক্রেতা' : 'Verified Buyer'}
                </span>
                <span className="flex items-center gap-1 text-stone-500">
                  <ThumbsUp className="w-3 h-3" />
                  {language === 'bn' ? 'সহায়ক' : 'Helpful'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-stone-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-serif-botanical font-bold text-stone-900">{t('relatedProducts')}</h2>
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {product && (
        <>
          <PlantCareGuideModal
            isOpen={isCareModalOpen}
            onClose={() => setIsCareModalOpen(false)}
            product={product}
          />
          <InstantBuyNowModal
            isOpen={isInstantBuyOpen}
            onClose={() => setIsInstantBuyOpen(false)}
            product={product}
          />
        </>
      )}
    </div>
  );
};
