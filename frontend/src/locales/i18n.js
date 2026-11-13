import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import viCommon from './vi/common.json'
import enCommon from './en/common.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        common: viCommon,
      },
      en: {
        common: enCommon,
      },
    },
    lng: localStorage.getItem('language') || 'vi',
    fallbackLng: 'vi',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
