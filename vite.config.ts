import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // 使用自定义域名时设置为根路径
  resolve: {
    alias: {
      '@myriaddreamin/typst.vue3': path.resolve(__dirname, 'node_modules/@myriaddreamin/typst.vue3/src/index.ts')
    }
  }
})
