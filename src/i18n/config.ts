import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import itTranslation from './locales/it.json';
import ptTranslation from './locales/pt.json';
import ruTranslation from './locales/ru.json';
import jaTranslation from './locales/ja.json';
import koTranslation from './locales/ko.json';
import zhTranslation from './locales/zh.json';
import hiTranslation from './locales/hi.json';
import arTranslation from './locales/ar.json';
import urTranslation from './locales/ur.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
  it: { translation: itTranslation },
  pt: { translation: ptTranslation },
  ru: { translation: ruTranslation },
  ja: { translation: jaTranslation },
  ko: { translation: koTranslation },
  zh: { translation: zhTranslation },
  hi: { translation: hiTranslation },
  ar: { translation: arTranslation },
  ur: { translation: urTranslation },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('appLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
