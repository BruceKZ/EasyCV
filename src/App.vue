<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Preview from './components/Preview.vue'
import Editor from './components/Editor/index.vue'
import { useResumeStore } from './stores/resume'
import { compileResume } from './utils/typst'
import { Languages, Trash2 } from 'lucide-vue-next'

const store = useResumeStore()
const fileInput = ref<HTMLInputElement | null>(null)

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
      alert('Failed to parse JSON')
    }
  }
  reader.readAsText(file)
}

const isExporting = ref(false)

const exportPdf = async () => {
  if (isExporting.value) return
  
  try {
    isExporting.value = true
    const templateName = store.language === 'cn' ? 'resume-cn.typ' : 'resume-en.typ'
    const source = await compileResume(templateName, store.resumeData)
    
    // Import dynamically to avoid circular dependency issues if any, though direct import is fine too
    const { exportPdf } = await import('./utils/typst')
    const pdfData = await exportPdf(source)
    
    // Create blob and download
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
    alert(store.language === 'cn' ? '导出 PDF 失败，请重试' : 'Failed to export PDF, please try again')
  } finally {
    isExporting.value = false
  }
}

const clearData = () => {
  const message = store.language === 'cn' 
    ? '确定要清空所有数据吗？请确保您已保存当前数据到 JSON 文件。' 
    : 'Are you sure you want to clear all data? Please make sure you have saved your current data to a JSON file.'
  
  if (confirm(message)) {
    store.resetToEmpty()
  }
}

const isLangMenuOpen = ref(false)
const langMenuRef = ref<HTMLElement | null>(null)

const toggleLangMenu = () => {
  isLangMenuOpen.value = !isLangMenuOpen.value
}

const setLanguage = (lang: 'cn' | 'en') => {
  store.language = lang
  isLangMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (langMenuRef.value && !langMenuRef.value.contains(event.target as Node)) {
    isLangMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
    <!-- Toolbar -->
    <header class="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
          CV
        </div>
        <h1 class="text-xl font-bold tracking-tight text-gray-800">EasyCV</h1>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
          <button 
            @click="clearData" 
            class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-white rounded-md transition-all flex items-center gap-1.5"
            :title="store.language === 'cn' ? '清空数据' : 'Clear Data'"
          >
            <Trash2 class="w-4 h-4" />
            {{ store.language === 'cn' ? '清空' : 'Clear' }}
          </button>
          <div class="w-px bg-gray-300 my-1"></div>
          <button 
            @click="exportJson" 
            class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-md transition-all"
            title="Download JSON backup"
          >
            {{ store.language === 'cn' ? '导出 JSON' : 'Export JSON' }}
          </button>
          <div class="w-px bg-gray-300 my-1"></div>
          <button 
            @click="triggerImport" 
            class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-md transition-all"
            title="Import JSON backup"
          >
            {{ store.language === 'cn' ? '导入 JSON' : 'Import JSON' }}
          </button>
        </div>
        
        <input ref="fileInput" type="file" class="hidden" accept=".json" @change="importJson" />
        
        <div class="h-6 w-px bg-gray-300 mx-1"></div>

        <div class="relative" ref="langMenuRef">
          <button 
            @click="toggleLangMenu" 
            class="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center"
            title="Switch Language"
          >
            <Languages class="w-5 h-5" />
          </button>

          <div 
            v-if="isLangMenuOpen" 
            class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 py-1"
          >
            <button 
              @click="setLanguage('cn')" 
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              :class="{ 'bg-gray-50 font-medium text-blue-600': store.language === 'cn' }"
            >
              中文
            </button>
            <button 
              @click="setLanguage('en')" 
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              :class="{ 'bg-gray-50 font-medium text-blue-600': store.language === 'en' }"
            >
              English
            </button>
          </div>
        </div>

        <button 
          @click="exportPdf" 
          :disabled="isExporting"
          class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isExporting" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <svg v-else class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ store.language === 'cn' ? (isExporting ? '导出中...' : '导出 PDF') : (isExporting ? 'Exporting...' : 'Export PDF') }}
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Left Panel: Editor -->
      <div class="w-1/2 h-full border-r border-gray-200 bg-gray-50 overflow-y-auto custom-scrollbar">
        <div class="max-w-3xl mx-auto p-6">
          <Editor />
        </div>
      </div>

      <!-- Right Panel: Preview -->
      <div class="w-1/2 h-full bg-gray-100 p-8 flex justify-center items-start overflow-y-auto custom-scrollbar">
        <Preview />
      </div>
    </div>
  </div>
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

<style scoped>
</style>
