/**
 * @file LanguageContext.tsx
 * @description Bilingual language state provider and localization hook.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../config/locales';
import { loggerService } from '../services/loggerService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
}

const STORAGE_KEY = 'gardenvaly_language_preference';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const queryLang = urlParams.get('lang');
        if (queryLang === 'en' || queryLang === 'bn') {
          return queryLang;
        }
        if (window.localStorage) {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          if (saved === 'en' || saved === 'bn') {
            return saved;
          }
        }
      }
    } catch {
      // Safe fallback
    }
    return 'bn'; // Default to Bangla
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, language);
      }
      document.documentElement.lang = language;
      if (language === 'bn') {
        document.body.classList.add('lang-bn');
      } else {
        document.body.classList.remove('lang-bn');
      }
    } catch (err) {
      loggerService.error('Failed to update language DOM attribute', err, 'LanguageContext');
    }
  }, [language]);

  const setLanguage = (lang: Language): void => {
    setLanguageState(lang);
    loggerService.info(`Language switched to: ${lang}`, 'LanguageContext');
  };

  const toggleLanguage = (): void => {
    setLanguageState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    const dict = TRANSLATIONS[language];
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
