/**
 * @file CartPage.tsx
 * @description Dedicated Cart page with quantity adjustments, line subtotals, and safe delete dialogs.
 */

import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { formatNumeral } from '../utils/formatters';
import { Breadcrumbs } from '../components/shop/Breadcrumbs';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { Button } from '../components/common/Button';
import { DELIVERY_CONFIG } from '../config/deliveryConfig';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummarySidebar } from '../components/cart/CartSummarySidebar';
import { usePageSeo } from '../hooks/usePageSeo';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { language, t } = useLanguage();
  const { navigate } = useRouter();

  usePageSeo({
    title: language === 'bn' ? 'শপিং কার্ট | Gardenvaly' : 'Shopping Cart | Gardenvaly',
    description: 'Review your selected live plants and organic seeds before checkout.',
    canonicalPath: '/cart',
    robots: 'noindex, nofollow',
    lang: language,
  });

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const deliveryCharge =
    cart.subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold
      ? 0
      : DELIVERY_CONFIG.options[0].rate;
  const estimatedTotal = cart.subtotal + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: t('shoppingCart') }]} />

      <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900">
        {t('shoppingCart')}
      </h1>

      {cart.items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-[#F7F5EC] text-[#174D35] rounded-2xl mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="text-lg font-semibold text-stone-900">{t('cartEmpty')}</h2>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">{t('cartEmptySub')}</p>
          <div className="mt-6">
            <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {t('continueShopping')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Table / Items List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C8D50]">
                {formatNumeral(cart.totalQuantity, language)} {language === 'bn' ? 'টি পণ্য' : 'Items'}
              </span>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-stone-400 hover:text-red-600 underline cursor-pointer transition-colors"
              >
                {t('clearCart')}
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRequestDelete={(id) => setItemToDelete(id)}
                  onNavigateProduct={(slug) => navigate(`/product/${slug}`)}
                />
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                {t('continueShopping')}
              </Button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <CartSummarySidebar
              subtotal={cart.subtotal}
              deliveryCharge={deliveryCharge}
              estimatedTotal={estimatedTotal}
              onProceedToCheckout={() => navigate('/checkout')}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modals (Rule #8) */}
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
