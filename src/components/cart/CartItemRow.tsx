/**
 * @file CartItemRow.tsx
 * @description Individual cart item row with thumbnail, bilingual name, quantity steppers, and line total.
 */

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRequestDelete: (productId: string) => void;
  onNavigateProduct: (slug: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRequestDelete,
  onNavigateProduct,
}) => {
  const { language, t } = useLanguage();
  const name = language === 'bn' ? item.product.nameBn : item.product.nameEn;
  const maxStock = item.product.stockQuantity || 10;

  return (
    <div className="py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={item.product.imageUrl}
          alt={name}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
        />
        <div>
          <h3
            onClick={() => onNavigateProduct(item.product.slug)}
            className="font-serif-botanical font-bold text-sm sm:text-base text-stone-900 hover:text-[#174D35] cursor-pointer"
          >
            {name}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('unitPrice')}: {formatPrice(item.product.price, language)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
          <button
            onClick={() => {
              if (item.quantity === 1) onRequestDelete(item.product.id);
              else onUpdateQuantity(item.product.id, item.quantity - 1);
            }}
            className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#174D35]"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 text-xs font-bold min-w-[28px] text-center">{formatNumeral(item.quantity, language)}</span>
          <button
            onClick={() => onUpdateQuantity(item.product.id, Math.min(maxStock, item.quantity + 1))}
            className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 cursor-pointer disabled:opacity-40 transition-colors focus-visible:ring-2 focus-visible:ring-[#174D35]"
            disabled={item.quantity >= maxStock}
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Subtotal */}
        <span className="text-sm sm:text-base font-bold text-[#174D35] min-w-[65px] text-right">
          {formatPrice(item.product.price * item.quantity, language)}
        </span>

        {/* Remove action */}
        <button
          onClick={() => onRequestDelete(item.product.id)}
          className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
