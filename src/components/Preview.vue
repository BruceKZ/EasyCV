<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { $typst, loadFonts } from '@myriaddreamin/typst.ts'
import { useResumeStore } from '../stores/resume'
import { compileResume } from '../utils/typst'
import { useI18n } from 'vue-i18n'

const store = useResumeStore()
const { locale } = useI18n()
const templateContent = ref('')
const compiledContent = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Initialize Typst compiler with font loading
const initTypst = async () => {
  $typst.setCompilerInitOptions({
    beforeBuild: [
      loadFonts([
        // Font Awesome icons
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.ttf',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.ttf',
        // Full Noto Serif CJK SC fonts from Google/Adobe's official noto-cjk repository
        // These contain the complete CJK character set including rare characters like "烬"
        // Using raw.githubusercontent.com as it supports large font files
        'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/OTF/SimplifiedChinese/NotoSerifCJKsc-Regular.otf',
        'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/OTF/SimplifiedChinese/NotoSerifCJKsc-Bold.otf'
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
    const templateName = locale.value === 'zh-CN' ? 'resume-cn.typ' : 'resume-en.typ'
    const source = await compileResume(templateName, store.resumeData, store.sectionOrder)
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

watch(() => [store.resumeData, store.sectionOrder, locale.value], () => {
  updatePreview()
}, { deep: true })
</script>

<template>
  <div class="preview-container">
    <a-alert
      v-if="error"
      :message="error"
      type="error"
      show-icon
      class="w-full mb-4"
    />
    
    <a-spin :spinning="loading" class="w-full">
      <div class="preview-content">
        <div v-html="compiledContent" class="preview-svg"></div>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.preview-content {
  position: relative;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 200px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.preview-svg {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.preview-svg :deep(svg) {
  width: 100% !important;
  height: auto !important;
  max-width: 100%;
  display: block;
}
</style>
