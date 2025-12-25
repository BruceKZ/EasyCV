<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Preview from './components/Preview.vue'
import Editor from './components/Editor/index.vue'
import { useResumeStore } from './stores/resume'
import { compileResume } from './utils/typst'
import { 
  TranslationOutlined, 
  DeleteOutlined, 
  ExportOutlined, 
  ImportOutlined, 
  DownloadOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from './i18n'
import { Grid } from 'ant-design-vue'

const useBreakpoint = Grid.useBreakpoint
const screens = useBreakpoint()

const store = useResumeStore()
const { t, locale } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)
const editorPanelRef = ref<HTMLElement | null>(null)

// Mobile state
const activeTab = ref<'editor' | 'preview'>('editor')
const isMobile = computed(() => !screens.value.md)

const STORAGE_KEY_SCROLL_POSITION = 'easycv-editor-scroll-position'

// Save scroll position
const saveScrollPosition = () => {
  if (editorPanelRef.value) {
    try {
      localStorage.setItem(STORAGE_KEY_SCROLL_POSITION, editorPanelRef.value.scrollTop.toString())
    } catch (e) {
      console.error('Failed to save scroll position:', e)
    }
  }
}

// Restore scroll position
const restoreScrollPosition = () => {
  if (editorPanelRef.value) {
    try {
      const savedPosition = localStorage.getItem(STORAGE_KEY_SCROLL_POSITION)
      if (savedPosition !== null) {
        editorPanelRef.value.scrollTop = parseInt(savedPosition, 10)
      }
    } catch (e) {
      console.error('Failed to restore scroll position:', e)
    }
  }
}

// Throttle function to avoid frequent saves
let scrollTimeout: number | null = null
const handleScroll = () => {
  if (scrollTimeout !== null) {
    clearTimeout(scrollTimeout)
  }
  scrollTimeout = window.setTimeout(() => {
    saveScrollPosition()
  }, 150)
}

const exportJson = () => {
  const dataStr = JSON.stringify(store.resumeData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  const exportFileDefaultName = 'resume.json'
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const triggerImport = () => {
  fileInput.value?.click()
}

const importJson = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const data = JSON.parse(content)
      store.updateResumeData(data)
    } catch (err) {
      alert(t('app.importFailed'))
    }
  }
  reader.readAsText(file)
}

const isExporting = ref(false)

const exportPdf = async () => {
  if (isExporting.value) return
  
  try {
    isExporting.value = true
    const templateName = locale.value === 'zh-CN' ? 'resume-cn.typ' : 'resume-en.typ'
    const source = await compileResume(templateName, store.resumeData, store.sectionOrder)
    
    const { exportPdf } = await import('./utils/typst')
    const pdfData = await exportPdf(source)
    
    const blob = new Blob([pdfData as any], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
    alert(t('app.exportFailed'))
  } finally {
    isExporting.value = false
  }
}

const clearData = () => {
  if (confirm(t('app.clearConfirm'))) {
    store.resetToEmpty()
  }
}

const handleMenuClick = (e: any) => {
  if (e.key === 'zh-CN' || e.key === 'en-US') {
    setLocale(e.key)
  }
}

onMounted(() => {
  restoreScrollPosition()
  if (editorPanelRef.value) {
    editorPanelRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (editorPanelRef.value) {
    editorPanelRef.value.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimeout !== null) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<template>
  <a-layout class="h-screen overflow-hidden">
    <!-- Header -->
    <a-layout-header :style="{ background: '#fff', padding: '0 16px' }" class="border-b border-gray-200 flex justify-between items-center z-20 h-14 leading-none">
      <div class="flex items-center gap-2">
        <div class="w-9 h-9 bg-[#3B5FE9] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
          CV
        </div>
        <h1 class="text-xl font-bold tracking-tight m-0 leading-none h-8 flex items-center translate-y-1">
          <span class="text-[#2D3748]">Easy</span><span class="text-[#3B5FE9]">CV</span>
        </h1>
      </div>
      
      <div class="flex items-center gap-2">
        <a-space>
          <a-button-group>
            <a-tooltip :title="$t('app.clearData')">
              <a-button danger @click="clearData">
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="$t('app.exportJSON')">
              <a-button @click="exportJson">
                <template #icon><ExportOutlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="$t('app.importJSON')">
              <a-button @click="triggerImport">
                <template #icon><ImportOutlined /></template>
              </a-button>
            </a-tooltip>
          </a-button-group>

          <a-dropdown>
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="zh-CN">中文</a-menu-item>
                <a-menu-item key="en-US">English</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <template #icon><TranslationOutlined /></template>
            </a-button>
          </a-dropdown>

          <a-button type="primary" @click="exportPdf" :loading="isExporting">
            <template #icon><DownloadOutlined /></template>
            <span v-if="!isMobile">{{ isExporting ? $t('app.exporting') : $t('app.exportPDF') }}</span>
          </a-button>
        </a-space>
        
        <input ref="fileInput" type="file" class="hidden" accept=".json" @change="importJson" />
      </div>
    </a-layout-header>

    <a-layout-content class="relative overflow-hidden">
      <!-- Desktop Layout -->
      <div v-show="!isMobile" class="flex h-full">
        <div ref="editorPanelRef" class="w-1/2 h-full border-r border-gray-200 bg-gray-50 overflow-y-auto custom-scrollbar">
          <div class="max-w-3xl mx-auto p-6">
            <Editor />
          </div>
        </div>
        <div class="w-1/2 h-full bg-gray-100 p-8 overflow-y-auto custom-scrollbar">
          <Preview />
        </div>
      </div>

      <!-- Mobile Layout -->
      <div v-show="isMobile" class="h-full overflow-y-auto custom-scrollbar bg-gray-50 pb-16">
        <div v-show="activeTab === 'editor'" class="p-4">
          <Editor />
        </div>
        <div v-show="activeTab === 'preview'" class="p-4 bg-gray-100 min-h-full">
          <Preview />
        </div>
      </div>
    </a-layout-content>

    <!-- Mobile Bottom Nav -->
    <div v-if="isMobile" class="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center h-14 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div 
        class="flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors"
        :class="activeTab === 'editor' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        @click="activeTab = 'editor'"
      >
        <EditOutlined class="text-xl mb-0.5" />
        <span class="text-xs font-medium">Editor</span>
      </div>
      <div 
        class="flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors"
        :class="activeTab === 'preview' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        @click="activeTab = 'preview'"
      >
        <EyeOutlined class="text-xl mb-0.5" />
        <span class="text-xs font-medium">Preview</span>
      </div>
    </div>
  </a-layout>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
