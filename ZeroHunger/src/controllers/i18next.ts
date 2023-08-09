import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import translationEN from "../translations/en-CA/en.json"


const resources = {
  en: {
    translation: translationEN
  },
  enCA: {
    translation: translationEN
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      debug: false,
      fallbackLng: 'en',
      resources,
      lng: "en",
      compatibilityJSON: 'v3',
    }

  );

export default i18n;