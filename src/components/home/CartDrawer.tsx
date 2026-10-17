/**
 * @file CartDrawer.tsx
 * @description Shopping cart drawer with delete confirmation dialogs (Rule #8).
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice, formatNumeral } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useRouter } from '../../context/RouterContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const { language, t } = useLanguage();
  const { navigate } = useRouter();

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#174D35]" />
            <h3 className="font-semibold text-stone-900 text-base">{t('cartTitle')}</h3>
            <span className="text-xs bg-[#174D35]/10 text-[#174D35] px-2 py-0.5 rounded-full font-bold">
              {formatNumeral(cart.totalQuantity, language)}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#174D35]"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-[#F7F5EC] rounded-2xl mx-auto flex items-center justify-center text-[#174D35] mb-4">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h4 className="font-semibold text-stone-800">{t('cartEmpty')}</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">{t('cartEmptySub')}</p>
            </div>
          ) : (
            <>
              {cart.items.map((item) => {
                const name = language === 'bn' ? item.product.nameBn : item.product.nameEn;
                return (
                  <div key={item.product.id} className="flex gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50">
                    <img src={item.product.imageUrl} alt={name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">{name}</h4>
                        <button
                          onClick={() => setItemToDelete(item.product.id)}
                          className="text-stone-400 hover:text-red-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-[#174D35]">
                          {formatPrice(item.product.price * item.quantity, language)}
                        </span>
                        <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) setItemToDelete(item.product.id);
                              else updateQuantity(item.product.id, item.quantity - 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-l-lg cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold px-2">{formatNumeral(item.quantity, language)}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-r-lg cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-stone-500 hover:text-red-600 underline cursor-pointer"
                >
                  {t('clearCart')}
                </button>
              </div>
            </>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-[#F7F5EC]/60 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">{t('subtotal')}</span>
              <span className="font-bold text-stone-900">{formatPrice(cart.subtotal, language)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
              >
                {t('shoppingCart')}
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
              >
                {t('checkout')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={itemToDelete !== null}
        title={t('removeItemConfirmTitle')}
        message={t('removeItemConfirmDesc')}
        onConfirm={() => {
          if (itemToDelete) removeFromCart(itemToDelete);
          setItemToDelete(null);
        }}
        onCancel={() => setItemToDelete(null)}
      />

      <ConfirmationDialog
        isOpen={showClearConfirm}
        title={t('clearCartConfirmTitle')}
        message={t('clearCartConfirmDesc')}
        onConfirm={() => {
          clearCart();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
