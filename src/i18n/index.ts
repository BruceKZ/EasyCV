import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// Get saved locale from localStorage, default to zh-CN
const savedLocale = localStorage.getItem('locale') || 'zh-CN'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// Watch for locale changes and save to localStorage
export function setLocale(locale: 'zh-CN' | 'en-US') {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}

export default i18n
