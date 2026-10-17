import React, { useState, useEffect } from 'react';
import { X, Sun, Droplet, Star, ShoppingBag, Check, Flame } from 'lucide-react';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { formatPrice, formatNumeral, getProductSoldCount } from '../../utils/formatters';
import { Button } from '../common/Button';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldCount = product ? getProductSoldCount(product) : 0;

  // Lock body scroll when quick view modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const name = language === 'bn' ? product.nameBn : product.nameEn;
  const desc = language === 'bn' ? product.shortDescBn : product.shortDescEn;
  const sunlight = language === 'bn' ? product.sunlightBn : product.sunlightEn;
  const water = language === 'bn' ? product.waterBn : product.waterEn;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} Quick View`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col md:flex-row z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-stone-600 shadow-xs focus-visible:ring-2 focus-visible:ring-[#174D35]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 h-64 md:h-auto bg-stone-100 relative">
          <img src={product.imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {product.botanicalName && (
              <p className="text-xs italic text-[#5C8D50] font-medium">{product.botanicalName}</p>
            )}
            <h3 className="font-serif-botanical font-bold text-2xl text-stone-900 mt-1">{name}</h3>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.slug}#reviews`);
                }}
                className="flex items-center gap-1.5 text-stone-700 hover:text-[#174D35] hover:underline cursor-pointer group"
                title={language === 'bn' ? 'মতামত দেখতে ক্লিক করুন' : 'Click to view reviews'}
              >
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-stone-800 ml-1">
                    {formatNumeral(product.rating.toFixed(1), language)}
                  </span>
                </div>
                <span className="text-xs text-stone-500 group-hover:text-[#174D35] underline decoration-stone-300">
                  ({formatNumeral(product.reviewsCount, language)} {t('reviews')})
                </span>
              </button>
              <span className="text-xs text-stone-400">·</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                <Flame className="w-3 h-3 text-amber-600 shrink-0" />
                <span>{formatNumeral(soldCount, language)}+ {language === 'bn' ? 'বিক্রি' : 'sold'}</span>
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#174D35]">
                {formatPrice(product.price, language)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.originalPrice, language)}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 mt-3 leading-relaxed">{desc}</p>

            <div className="mt-4 p-3 rounded-xl bg-[#F7F5EC] space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>
                  <strong>{t('sunlight')}:</strong> {sunlight}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-700" />
                <span>
                  <strong>{t('watering')}:</strong> {water}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
            <div className="flex items-center border border-stone-300 rounded-xl px-2 py-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-2 text-stone-500 hover:text-stone-800 text-sm font-bold"
              >
                -
              </button>
              <span className="px-2 text-xs font-bold">{formatNumeral(qty, language)}</span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="px-2 text-stone-500 hover:text-stone-800 text-sm font-bold"
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="md"
              icon={added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              onClick={handleAdd}
            >
              {added ? t('addedToCart') : t('addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
