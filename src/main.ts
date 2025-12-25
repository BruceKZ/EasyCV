import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import './style.css'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import i18n from './i18n'

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(Antd)
app.mount('#app')
