/**
 * @file CheckoutPage.tsx
 * @description Master checkout experience with form validation, delivery selection, and multi-channel ordering.
 */

import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';
import { CustomerInfo, DeliveryMethodId, PaymentMethodId, OrderPayload } from '../types/cart';
import { DELIVERY_CONFIG } from '../config/deliveryConfig';
import { isValidBdPhone, isNonEmpty, isValidEmail } from '../utils/validation';
import { Breadcrumbs } from '../components/shop/Breadcrumbs';
import { CustomerInformationForm } from '../components/checkout/CustomerInformationForm';
import { DeliveryMethodSelector } from '../components/checkout/DeliveryMethodSelector';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { OrderSummaryCard } from '../components/checkout/OrderSummaryCard';
import { WhatsAppOrderButton } from '../components/checkout/WhatsAppOrderButton';
import { PhoneOrderButton } from '../components/checkout/PhoneOrderButton';
import { Button } from '../components/common/Button';
import { orderService } from '../services/orderService';
import { integrationService } from '../services/integrationService';
import { usePageSeo } from '../hooks/usePageSeo';
import { analyticsService } from '../services/analyticsService';

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const { language, t } = useLanguage();
  const { navigate } = useRouter();

  usePageSeo({
    title: language === 'bn' ? 'নিরাপদ চেকআউট | Gardenvaly' : 'Secure Checkout | Gardenvaly',
    description: 'Complete your Gardenvaly order with nationwide delivery and Cash on Delivery.',
    canonicalPath: '/checkout',
    robots: 'noindex, nofollow',
    lang: language,
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>('home-delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cash-on-delivery');
  const [trxId, setTrxId] = useState('');
  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    mobileNumber: '',
    email: '',
    division: '',
    district: '',
    upazila: '',
    union: '',
    addressDetail: '',
    deliveryInstructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState<OrderPayload | null>(null);

  const selectedDeliveryOption =
    DELIVERY_CONFIG.options.find((o) => o.id === deliveryMethod) || DELIVERY_CONFIG.options[0];
  const deliveryCharge =
    cart.subtotal >= DELIVERY_CONFIG.freeDeliveryThreshold ? 0 : selectedDeliveryOption.rate;

  React.useEffect(() => {
    if (cart.items.length > 0) {
      analyticsService.trackBeginCheckout(cart.items, cart.subtotal + deliveryCharge);
    }
  }, []);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!isNonEmpty(formData.fullName) || formData.fullName.trim().length < 2) {
      errs.fullName = t('fullNameRequired');
    }
    if (!isValidBdPhone(formData.mobileNumber)) {
      errs.mobileNumber = t('mobileNumberRequired');
    }
    if (formData.email && !isValidEmail(formData.email)) {
      errs.email = t('emailInvalid');
    }
    if (!isNonEmpty(formData.division)) errs.division = t('divisionRequired');
    if (!isNonEmpty(formData.district)) errs.district = t('districtRequired');
    if (!isNonEmpty(formData.upazila)) errs.upazila = t('upazilaRequired');
    if (!isNonEmpty(formData.addressDetail)) errs.addressDetail = t('detailedAddressRequired');

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!trxId || trxId.trim().length < 4)) {
      errs.trxId = language === 'bn' ? 'সঠিক Transaction ID (TrxID) লিখুন' : 'Please provide a valid Transaction ID';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) return;
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const items = cart.items.map((i) => ({
        productId: i.product.id,
        productName: i.product.nameEn,
        slug: i.product.slug,
        imageUrl: i.product.imageUrl,
        quantity: i.quantity,
        unitPrice: i.product.price,
        lineSubtotal: i.product.price * i.quantity,
      }));

      const notes = (paymentMethod === 'bkash' || paymentMethod === 'nagad')
        ? `Payment via ${paymentMethod.toUpperCase()} | TrxID: ${trxId.trim()}`
        : 'Direct store checkout';

      const createdOrder = await orderService.createOrder({
        customer: formData,
        items,
        subtotal: cart.subtotal,
        deliveryCharge,
        totalAmount: cart.subtotal + deliveryCharge,
        deliveryMethod,
        paymentMethod,
        adminNotes: notes,
      });

      // Track verified order purchase in GA4 (without customer PII)
      analyticsService.trackPurchase(
        createdOrder?.orderNumber || `GV-${Date.now()}`,
        cart.subtotal + deliveryCharge,
        items
      );

      // Handle Online Payment Gateway (bKash Checkout or SSLCommerz)
      if (createdOrder && (paymentMethod === 'bkash-online' || paymentMethod === 'sslcommerz')) {
        const payRes = await integrationService.initiatePayment(createdOrder.id, paymentMethod);
        if (payRes.success && payRes.data) {
          if (payRes.data.simulated && payRes.data.transactionId) {
            // Automatically verify sandbox test payment
            await integrationService.verifyPayment(
              createdOrder.id,
              payRes.data.transactionId,
              paymentMethod
            );
          } else if (payRes.data.redirectUrl) {
            window.location.href = payRes.data.redirectUrl;
            return;
          }
        }
      }

      const payload: OrderPayload = {
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.productName,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          lineSubtotal: it.lineSubtotal,
        })),
        customer: formData,
        deliveryMethod,
        deliveryCharge,
        paymentMethod,
        createdAt: new Date().toISOString(),
      };
      setDemoSubmitted(payload);
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-[#F7F5EC] text-[#174D35] rounded-2xl mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 opacity-70" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">{t('emptyCartNotice')}</h2>
        <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          {t('continueShopping')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: t('shoppingCart'), path: '/cart' }, { label: t('checkoutTitle') }]} />
      <h1 className="text-2xl sm:text-3xl font-serif-botanical font-bold text-stone-900">{t('checkoutTitle')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <CustomerInformationForm
            formData={formData}
            errors={errors}
            onChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
          />
          <DeliveryMethodSelector selectedMethod={deliveryMethod} onSelect={setDeliveryMethod} />
          <PaymentMethodSelector selectedPayment={paymentMethod} onSelect={setPaymentMethod} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <OrderSummaryCard items={cart.items} deliveryCharge={deliveryCharge} />

          {/* Checkout Actions */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
            >
              {isSubmitting ? t('orderSubmitting') : t('placeOrder')}
            </Button>

            {/* Alternative Ordering Channels */}
            <div className="pt-2 border-t border-stone-100 space-y-3">
              <WhatsAppOrderButton
                items={cart.items}
                customer={formData}
                deliveryCharge={deliveryCharge}
                onValidate={validateForm}
              />
              <PhoneOrderButton />
            </div>

            {demoSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('demoOrderSuccess')}</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Payload prepared for Node.js API: {demoSubmitted.items.length} items to {demoSubmitted.customer.fullName}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
