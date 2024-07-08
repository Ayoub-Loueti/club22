import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // charge les traductions à partir d'un serveur
  .use(LanguageDetector) // détecte la langue du navigateur
  .use(initReactI18next) // passe i18n à react-i18next
  .init({
    fallbackLng: 'fr', // langue à utiliser si la traduction est absente
    debug: true,
    interpolation: {
      escapeValue: false, // réagit déjà à l'échappement
    },
  });

export default i18n;
