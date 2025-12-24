import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@myriaddreamin/typst.vue3': path.resolve(__dirname, 'node_modules/@myriaddreamin/typst.vue3/src/index.ts')
    }
  }
})
