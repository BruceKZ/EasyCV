<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { $typst, loadFonts } from '@myriaddreamin/typst.ts'
import { useResumeStore } from '../stores/resume'
import { compileResume } from '../utils/typst'

const store = useResumeStore()
const templateContent = ref('')
const compiledContent = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Initialize Typst compiler with font loading
const initTypst = async () => {
  $typst.setCompilerInitOptions({
    beforeBuild: [
      loadFonts([
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.ttf',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.ttf',
        'https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.0.12/files/noto-serif-sc-chinese-simplified-400-normal.woff',
        'https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.0.12/files/noto-serif-sc-chinese-simplified-700-normal.woff'
      ], {
        assets: ['text', 'cjk']
      })
    ],
    getModule: () => 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.6.1-rc5/pkg/typst_ts_web_compiler_bg.wasm',
  })
  $typst.setRendererInitOptions({
    getModule: () => 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer@0.6.1-rc5/pkg/typst_ts_renderer_bg.wasm',
  })
}

const updatePreview = async () => {
  loading.value = true
  error.value = null
  store.clearMissingKeys() // Clear previous errors
  try {
    // Determine template based on language
    const templateName = store.language === 'cn' ? 'resume-cn.typ' : 'resume-en.typ'
    const source = await compileResume(templateName, store.resumeData)
    templateContent.value = source
    
    // Compile to SVG
    compiledContent.value = await $typst.svg({ mainContent: source })
  } catch (e: any) {
    console.error('Failed to compile resume:', e)
    const errorMessage = e?.toString() || ''
    error.value = 'Failed to render resume. Please check your data.'
    
    // Parse missing key error
    // Example: dictionary does not contain key "name"
    const missingKeyMatch = errorMessage.match(/dictionary does not contain key "(.+?)"/)
    if (missingKeyMatch) {
      const key = missingKeyMatch[1]
      store.addMissingKey(key)
      error.value = `Missing required field: ${key}`
    }
    
    // Parse unknown variable error
    // Example: unknown variable: name
    const unknownVarMatch = errorMessage.match(/unknown variable: (.+)/)
    if (unknownVarMatch) {
      const key = unknownVarMatch[1]
      store.addMissingKey(key)
      error.value = `Missing required field: ${key}`
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await initTypst()
  updatePreview()
})

watch(() => [store.resumeData, store.language], () => {
  updatePreview()
}, { deep: true })
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div v-if="error" class="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-4">
      {{ error }}
    </div>
    
    <div class="relative bg-white shadow-lg flex flex-col">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-html="compiledContent"></div>
    </div>
  </div>
</template>
