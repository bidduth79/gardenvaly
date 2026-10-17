/**
 * @file WhatsAppOrderButton.tsx
 * @description Button to launch pre-filled WhatsApp message for chat ordering.
 */

import React, { useState } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { CartItem, CustomerInfo } from '../../types/cart';
import { whatsappService } from '../../services/whatsappService';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

interface WhatsAppOrderButtonProps {
  items: CartItem[];
  customer: CustomerInfo;
  deliveryCharge: number;
  onValidate: () => boolean;
}

export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  items,
  customer,
  deliveryCharge,
  onValidate,
}) => {
  const { language, t } = useLanguage();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleWhatsAppClick = () => {
    setErrorMsg(null);
    const isValid = onValidate();
    if (!isValid) return;

    const url = whatsappService.generateWhatsAppOrderUrl(items, customer, deliveryCharge, language);
    if (!url) {
      setErrorMsg(
        language === 'bn'
          ? 'হোয়াটসঅ্যাপ কনফিগারেশন অনুপস্থিত। অনুগ্রহ করে কাস্টমার সাপোর্টে কল করুন।'
          : 'WhatsApp number is not configured in settings.'
      );
      return;
    }

    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-2">
      <Button
        variant="secondary"
        fullWidth
        size="md"
        className="bg-emerald-700 hover:bg-emerald-800 text-white"
        icon={<MessageCircle className="w-4 h-4 text-emerald-200" />}
        onClick={handleWhatsAppClick}
      >
        {t('whatsAppOrder')}
      </Button>
      <p className="text-[11px] text-stone-500 text-center leading-normal">
        {t('whatsAppNotice')}
      </p>
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
