import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import translationEN from "../translations/en-CA/translation.json"


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
            debug: true ,
            fallbackLng: 'en',
            resources,
            lng:"en"
        }
        
    );

export default i18n;