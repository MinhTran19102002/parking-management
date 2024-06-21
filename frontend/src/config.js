import vi_locale from 'antd/locale/vi_VN';
import en_locale from 'antd/locale/en_US';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import common_en from './locales/en/common.json';
import common_vi from './locales/vi/common.json';
import { theme } from 'antd';

window._env_ = {
  ...import.meta.env,
  ...window._env_
};
if (process.env.NODE_ENV?.toLocaleLowerCase() === 'production') {
  console.log = () => {};
  console.debug = () => {};
}

export const getLang = (i18n) => {
  const { language } = i18n;
  let all_locate = {
    vi: vi_locale,
    en: en_locale
  };
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

export const getAntd = (mode, i18n) => {
  return {
    locale: getLang(i18n),
    theme: {
      algorithm: mode === 'dark' && theme.darkAlgorithm,
      token: themeByMode[mode]
    }
  };
};

const themeByMode = {
  light: {
    neutral5: '#D9D9D9',
    event: {
      in: ['#389e0d', '#d9f7be'],
      inSlot: ['#389e0d', '#d9f7be'],
      out: ['#1d39c4', '#d6e4ff'],
      outSlot: ['#1d39c4', '#d6e4ff'],
      entry: ['#389e0d', '#d9f7be'],
      exit: ['#1d39c4', '#d6e4ff'],
      almost_full: ['#d48806', '#fff1b8'],
      parking_full: ['#c41d7f', '#ffd6e7']
    }
  },
  dark: {
    neutral5: '#252525',
    event: {
      in: ['#52c41a', '#237804'],
      inSlot: ['#52c41a', '#237804'],
      out: ['#4096ff', '#002c8c'],
      outSlot: ['#4096ff', '#002c8c'],
      entry: ['#389e0d', '#d9f7be'],
      exit: ['#1d39c4', '#d6e4ff'],
      almost_full: ['#d48806', '#fff1b8'],
      parking_full: ['#c41d7f', '#ffd6e7']
    }
  }
};
