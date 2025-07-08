import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation resources
import enTranslation from './locales/en/translation.json';

// Configure i18next
i18n
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;