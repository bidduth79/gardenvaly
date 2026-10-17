/**
 * @file NewsletterSection.tsx
 * @description Bilingual newsletter signup with client validation and demo feedback.
 */

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

export const NewsletterSection: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      return;
    }

    setStatus('success');
    setEmail('');
    setTimeout(() => {
      setStatus('idle');
    }, 5000);
  };

  return (
    <section className="py-14 sm:py-18 bg-[#174D35] text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-[#C5A059] mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif-botanical font-bold tracking-tight">
          {t('newsletterTitle')}
        </h2>
        <p className="text-sm sm:text-base text-stone-200 mt-2 max-w-xl mx-auto leading-relaxed">
          {t('newsletterSubtitle')}
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder={t('newsletterPlaceholder')}
              className="flex-1 px-4 py-3 rounded-xl bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            <Button
              type="submit"
              variant="gold"
              size="md"
              className="whitespace-nowrap"
            >
              {t('newsletterButton')}
            </Button>
          </div>

          {/* Status Feedback Messages */}
          {status === 'success' && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t('newsletterSuccess')}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-300 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t('newsletterError')}</span>
            </div>
          )}
        </form>

        <p className="mt-4 text-[11px] text-stone-300 opacity-80">
          Demo storefront — No personal data is stored on external servers.
        </p>
      </div>
    </section>
  );
};
