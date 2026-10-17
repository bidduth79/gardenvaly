/**
 * @file locales.ts
 * @description Bilingual localization hub combining modular English and Bengali dictionaries.
 */

import { TRANSLATIONS_EN } from './localesEn';
import { TRANSLATIONS_BN } from './localesBn';

export const TRANSLATIONS = {
  en: TRANSLATIONS_EN,
  bn: TRANSLATIONS_BN,
} as const;
