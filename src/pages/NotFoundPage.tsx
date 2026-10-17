/**
 * @file NotFoundPage.tsx
 * @description Bilingual 404 page for nonexistent routes.
 */

import React from 'react';
import { Sprout, ArrowLeft } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();
  const { language, t } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-[#174D35]/10 text-[#174D35] rounded-3xl mx-auto flex items-center justify-center mb-6">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-serif-botanical font-bold text-stone-900">
        {language === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
      </h1>
      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
        {language === 'bn'
          ? 'আপনি যে পাতাটিতে পৌঁছাতে চেয়েছেন তা হয়তো পরিবর্তিত হয়েছে বা মুছে ফেলা হয়েছে।'
          : 'The page you requested may have moved or is no longer available in our botanical catalogue.'}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="primary" size="md" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('home')}
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate('/shop')}>
          {t('shop')}
        </Button>
      </div>
    </div>
  );
};
