import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// Get initial locale: localStorage > device language > default en-US
const getInitialLocale = () => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) return savedLocale

  const deviceLanguage = navigator.language
  if (deviceLanguage.startsWith('zh')) {
    return 'zh-CN'
  }
  
  return 'en-US'
}

const initialLocale = getInitialLocale()

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: initialLocale,
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
