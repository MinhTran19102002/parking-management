import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import common_en from './locales/en/common.json';
import event_en from './locales/en/event.json';
import common_vi from './locales/vi/common.json';
import event_vi from './locales/vi/event.json';

i18next.use(initReactI18next).init({
  resources: {
    en: {
      ...common_en,
      event: event_en
    },
    vi: {
      common: common_vi,
      event: event_vi
    }
  },
  fallbackLng: 'vi',
  lng: localStorage.getItem('language'),
  interpolation: { escapeValue: false, formatSeparator: ',' },
  keySeparator: false
});

export default i18next;
