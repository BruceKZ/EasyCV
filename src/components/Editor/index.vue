<script setup lang="ts">
import Basics from './Basics.vue'
import Education from './Education.vue'
import Work from './Work.vue'
import Projects from './Projects.vue'
import Skills from './Skills.vue'
import Misc from './Misc.vue'
import Awards from './Awards.vue'
import { ref, watch, computed } from 'vue'
import { 
  UserOutlined, 
  ReadOutlined, 
  SolutionOutlined, 
  ProjectOutlined, 
  CodeOutlined, 
  TrophyOutlined, 
  EllipsisOutlined, 
  HolderOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import { useResumeStore } from '../../stores/resume'

const store = useResumeStore()

const STORAGE_KEY_ACTIVE_SECTIONS = 'easycv-editor-active-sections'

// Restore state from localStorage
const getSavedActiveSections = (): Set<string> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_SECTIONS)
    if (saved) {
      const parsed = JSON.parse(saved)
      return new Set(Array.isArray(parsed) ? parsed : ['basics'])
    }
    return new Set(['basics'])
  } catch (e) {
    console.error('Failed to load active sections from localStorage:', e)
    return new Set(['basics'])
  }
}

const activeSections = ref<Set<string>>(getSavedActiveSections())

// Drag state
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const isDragging = ref(false)
const dragPreviewElement = ref<HTMLElement | null>(null)
const containerRect = ref<DOMRect | null>(null)
const lastSwapTime = ref<number>(0)
const swapThrottleMs = 150 // 节流时间,防止过快切换

const toggleSection = (section: string, event?: MouseEvent) => {
  // Prevent toggle when clicking on drag handle
  if (event && (event.target as HTMLElement).closest('.drag-handle')) {
    return
  }
  
  if (activeSections.value.has(section)) {
    activeSections.value.delete(section)
  } else {
    activeSections.value.add(section)
  }
  // Trigger reactivity by creating a new Set
  activeSections.value = new Set(activeSections.value)
}

const isSectionActive = (section: string) => {
  return activeSections.value.has(section)
}

// Drag handlers
const handleDragStart = (index: number, event: DragEvent) => {
  draggedIndex.value = index
  isDragging.value = true
  lastSwapTime.value = 0 // 重置节流计时器
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
    
    // Create invisible drag image (we'll use custom preview)
    const emptyImage = document.createElement('div')
    emptyImage.style.width = '1px'
    emptyImage.style.height = '1px'
    emptyImage.style.opacity = '0'
    document.body.appendChild(emptyImage)
    event.dataTransfer.setDragImage(emptyImage, 0, 0)
    setTimeout(() => document.body.removeChild(emptyImage), 0)
    
    // Get container bounds for constraining drag preview
    const target = event.currentTarget as HTMLElement
    const container = target.parentElement
    if (container) {
      containerRect.value = container.getBoundingClientRect()
    }
    
    // Create custom drag preview
    createDragPreview(target, event.clientY)
  }
}

const createDragPreview = (sourceElement: HTMLElement, initialY: number) => {
  // Clone the element
  const preview = sourceElement.cloneNode(true) as HTMLElement
  const rect = sourceElement.getBoundingClientRect()
  
  // Style the preview
  preview.style.position = 'fixed'
  preview.style.left = `${rect.left}px`
  preview.style.top = `${initialY - 20}px`
  preview.style.width = `${rect.width}px`
  preview.style.opacity = '0.8'
  preview.style.pointerEvents = 'none'
  preview.style.zIndex = '9999'
  preview.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'
  preview.classList.add('drag-preview')
  
  document.body.appendChild(preview)
  dragPreviewElement.value = preview
}

const updateDragPreview = (event: DragEvent) => {
  if (dragPreviewElement.value && containerRect.value) {
    // Keep X position fixed, only update Y
    // 使用 requestAnimationFrame 确保流畅更新
    requestAnimationFrame(() => {
      if (dragPreviewElement.value) {
        dragPreviewElement.value.style.top = `${event.clientY - 20}px`
      }
    })
  }
}

const removeDragPreview = () => {
  if (dragPreviewElement.value && document.body.contains(dragPreviewElement.value)) {
    document.body.removeChild(dragPreviewElement.value)
    dragPreviewElement.value = null
  }
}

const handleDragOver = (index: number, event: DragEvent) => {
  event.preventDefault()
  
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  
  // Update drag preview position (always update for smooth movement)
  updateDragPreview(event)
  
  // Update drag over index for visual feedback
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const handleDragEnter = (index: number, event: DragEvent) => {
  event.preventDefault()
  
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    // 节流控制:只有距离上次换位超过指定时间才执行
    const now = Date.now()
    if (now - lastSwapTime.value < swapThrottleMs) {
      // 仍然更新视觉反馈,但不执行换位
      dragOverIndex.value = index
      return
    }
    
    lastSwapTime.value = now
    dragOverIndex.value = index
    
    // Perform the swap immediately for smooth animation
    const newOrder = [...store.sectionOrder]
    const draggedItem = newOrder[draggedIndex.value]
    
    if (draggedItem) {
      // Remove from old position
      newOrder.splice(draggedIndex.value, 1)
      
      // Insert at new position
      newOrder.splice(index, 0, draggedItem)
      
      // Update the store (this triggers the animation)
      store.updateSectionOrder(newOrder)
      
      // Update dragged index to new position
      draggedIndex.value = index
    }
  }
}

const handleDragEnd = () => {
  isDragging.value = false
  draggedIndex.value = null
  dragOverIndex.value = null
  removeDragPreview()
  containerRect.value = null
  lastSwapTime.value = 0
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  handleDragEnd()
}

// Watch activeSections changes and save to localStorage
watch(activeSections, (newValue) => {
  try {
    const sectionsArray = Array.from(newValue)
    localStorage.setItem(STORAGE_KEY_ACTIVE_SECTIONS, JSON.stringify(sectionsArray))
  } catch (e) {
    console.error('Failed to save active sections to localStorage:', e)
  }
}, { deep: true })

const sectionDefinitions = {
  basics: { id: 'basics', labelKey: 'editor.sections.basics', icon: UserOutlined, component: Basics },
  education: { id: 'education', labelKey: 'editor.sections.education', icon: ReadOutlined, component: Education },
  work: { id: 'work', labelKey: 'editor.sections.work', icon: SolutionOutlined, component: Work },
  projects: { id: 'projects', labelKey: 'editor.sections.projects', icon: ProjectOutlined, component: Projects },
  skills: { id: 'skills', labelKey: 'editor.sections.skills', icon: CodeOutlined, component: Skills },
  awards: { id: 'awards', labelKey: 'editor.sections.awards', icon: TrophyOutlined, component: Awards },
  misc: { id: 'misc', labelKey: 'editor.sections.misc', icon: EllipsisOutlined, component: Misc },
}

// Fixed section (basics)
const fixedSection = sectionDefinitions.basics

// Draggable sections (ordered by store.sectionOrder)
const draggableSections = computed(() => {
  return store.sectionOrder
    .map((id: string) => sectionDefinitions[id as keyof typeof sectionDefinitions])
    .filter((section): section is NonNullable<typeof section> => section !== undefined)
})
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <!-- Fixed section: Basics -->
    <a-card 
      :bordered="false" 
      class="shadow-sm transition-all duration-200 !bg-white"
      :class="{ 'ring-2 ring-blue-100': isSectionActive(fixedSection.id) }"
      :bodyStyle="{ padding: 0 }"
    >
      <div 
        class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
        @click="toggleSection(fixedSection.id, $event)"
      >
        <div class="flex items-center gap-3 flex-1">
          <component :is="fixedSection.icon" :style="{ color: isSectionActive(fixedSection.id) ? '#2563eb' : '#4b5563', fontSize: '18px', display: 'inline-flex' }" />
          <span class="font-semibold text-gray-700" :class="{ 'text-gray-900': isSectionActive(fixedSection.id) }">
            {{ $t(fixedSection.labelKey) }}
          </span>
        </div>
        <component 
          :is="isSectionActive(fixedSection.id) ? DownOutlined : RightOutlined" 
          class="text-xs text-gray-400"
        />
      </div>
      
      <div v-show="isSectionActive(fixedSection.id)" class="border-t border-gray-100 bg-gray-50/30 p-5">
        <component :is="fixedSection.component" />
      </div>
    </a-card>

    <!-- Draggable sections with TransitionGroup -->
    <TransitionGroup name="drag-list" tag="div" class="flex flex-col gap-y-4">
      <a-card 
        v-for="(section, index) in draggableSections" 
        :key="section.id" 
        :bordered="false"
        class="shadow-sm transition-all duration-200 !bg-white drag-item"
        :class="{ 
          'ring-2 ring-blue-100': isSectionActive(section.id),
          'dragging': draggedIndex === index,
          'drag-over': dragOverIndex === index && draggedIndex !== index
        }"
        :bodyStyle="{ padding: 0 }"
        draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragend="handleDragEnd"
        @dragover="handleDragOver(index, $event)"
        @dragenter="handleDragEnter(index, $event)"
        @drop="handleDrop($event)"
      >
        <div 
          class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3 flex-1 cursor-pointer" @click="toggleSection(section.id, $event)">
            <HolderOutlined class="drag-handle text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 hover:text-blue-500 transition-colors" />
            <component :is="section.icon" :style="{ color: isSectionActive(section.id) ? '#2563eb' : '#4b5563', fontSize: '18px', display: 'inline-flex' }" />
            <span class="font-semibold text-gray-700" :class="{ 'text-gray-900': isSectionActive(section.id) }">
              {{ $t(section.labelKey) }}
            </span>
          </div>
          <component 
            :is="isSectionActive(section.id) ? DownOutlined : RightOutlined" 
            class="text-xs text-gray-400 cursor-pointer"
            @click="toggleSection(section.id, $event)"
          />
        </div>
        
        <div v-show="isSectionActive(section.id)" class="border-t border-gray-100 bg-gray-50/30 p-5">
          <component :is="section.component" />
        </div>
      </a-card>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Drag list transition animations */
.drag-list-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Item being dragged */
.drag-item.dragging {
  opacity: 0.4;
  transform: scale(0.98);
  cursor: grabbing !important;
}

/* Drop target indicator */
.drag-item.drag-over {
  border: 2px dashed #3b82f6 !important;
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02));
}

/* Smooth transitions for all drag states */
.drag-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent text selection during drag */
.drag-item.dragging * {
  user-select: none;
  pointer-events: none;
}

/* Enhanced drag handle hover effect */
.drag-handle {
  transition: all 0.2s ease;
}

.drag-handle:hover {
  transform: scale(1.1);
}
</style>
