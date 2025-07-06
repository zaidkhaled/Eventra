'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../locales/ar/translation.json';
import en from '../locales/en/translation.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    ar: { translation: ar }
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
