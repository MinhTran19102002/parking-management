import vi_locale from 'antd/locale/vi_VN';
import en_locale from 'antd/locale/en_US';

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
