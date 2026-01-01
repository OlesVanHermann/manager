import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { log } from '../services/logger';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('i18nextLng') || 'fr',
    fallbackLng: 'fr',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
      queryStringParams: { v: Date.now().toString() },
    },
    saveMissing: true,
    missingKeyHandler: (_lngs, ns, key) => {
      log.warn('i18n', `Missing: ${ns}:${key}`, { ns, key });
    },
  });

// Capturer les erreurs de chargement (403, 404, etc.)
i18n.on('failedLoading', (lng, ns, msg) => {
  log.error('i18n-load', `Failed to load: ${lng}/${ns}`, { lng, ns, msg });
});

export default i18n;
