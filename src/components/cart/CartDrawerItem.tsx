/**
 * @file CartDrawerItem.tsx
 * @description Single line item row inside the slide-out cart drawer.
 */

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { getSafeImageUrl, getProductFallbackImage, handleImageError } from '../../utils/imageFallback';

interface CartDrawerItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onDeleteRequest: (id: string) => void;
}

export const CartDrawerItem: React.FC<CartDrawerItemProps> = ({
  item,
  onUpdateQuantity,
  onDeleteRequest,
}) => {
  const { language } = useLanguage();
  const name = language === 'bn' ? item.product.nameBn : item.product.nameEn;

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50">
      <img
        src={getSafeImageUrl(item.product.imageUrl, { type: item.product.type, categorySlug: item.product.categorySlug })}
        alt={name}
        className="w-16 h-16 rounded-xl object-cover shrink-0"
        onError={(e) => handleImageError(e, getProductFallbackImage(item.product))}
      />
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-1">
          <h4 className="text-sm font-semibold text-stone-900 truncate">{name}</h4>
          <button
            onClick={() => onDeleteRequest(item.product.id)}
            className="text-stone-400 hover:text-red-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-[#174D35]">
            {formatPrice(item.product.price * item.quantity, language)}
          </span>
          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5">
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold w-6 text-center font-mono">
              {formatNumeral(item.quantity, language)}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
