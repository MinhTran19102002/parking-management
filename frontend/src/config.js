import vi_locale from 'antd/locale/vi_VN';
import en_locale from 'antd/locale/en_US';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import common_en from './locales/en/common.json';
import common_vi from './locales/vi/common.json';

window._env_ = {
  ...import.meta.env,
  ...window._env_
};
if (process.env.NODE_ENV?.toLocaleLowerCase() === 'production') {
  console.log = () => {};
  console.debug = () => {};
}

export const getLang = (i18n) => {
  const { store, language } = i18n;
  let all_locate = {
    vi: vi_locale,
    en: en_locale
  };
  all_locate[language].table = store.data[language].common.table;
  all_locate[language].Empty.description = store.data[language].common.table.emptyText;
  return all_locate[language];
};

export const i18nConfig = () => {
  i18next.use(initReactI18next).init({
    resources: {
      en: {
        common: common_en
      },
      vi: {
        common: common_vi
      }
    },
    fallbackLng: 'vi',
    lng: localStorage.getItem('lang'),
    interpolation: { escapeValue: false, formatSeparator: ',' },
    keySeparator: false
  });
};
