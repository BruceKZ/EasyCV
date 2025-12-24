<script setup lang="ts">
import Basics from './Basics.vue'
import Education from './Education.vue'
import Work from './Work.vue'
import Projects from './Projects.vue'
import Skills from './Skills.vue'
import Misc from './Misc.vue'
import Awards from './Awards.vue'
import { ref, watch, computed } from 'vue'
import { ChevronDown, ChevronRight, User, GraduationCap, Briefcase, FolderGit2, Code2, Trophy, MoreHorizontal, GripVertical } from 'lucide-vue-next'
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

const toggleSection = (section: string) => {
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
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }
}

const handleDragOver = (index: number, event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}

const handleDrop = (index: number, event: DragEvent) => {
  event.preventDefault()
  
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    const newOrder = [...store.sectionOrder]
    const draggedItem = newOrder[draggedIndex.value]
    
    if (draggedItem) {
      // Remove from old position
      newOrder.splice(draggedIndex.value, 1)
      
      // Insert at new position
      newOrder.splice(index, 0, draggedItem)
      
      store.updateSectionOrder(newOrder)
    }
  }
  
  draggedIndex.value = null
  dragOverIndex.value = null
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
  basics: { id: 'basics', labelKey: 'editor.sections.basics', icon: User, component: Basics },
  education: { id: 'education', labelKey: 'editor.sections.education', icon: GraduationCap, component: Education },
  work: { id: 'work', labelKey: 'editor.sections.work', icon: Briefcase, component: Work },
  projects: { id: 'projects', labelKey: 'editor.sections.projects', icon: FolderGit2, component: Projects },
  skills: { id: 'skills', labelKey: 'editor.sections.skills', icon: Code2, component: Skills },
  awards: { id: 'awards', labelKey: 'editor.sections.awards', icon: Trophy, component: Awards },
  misc: { id: 'misc', labelKey: 'editor.sections.misc', icon: MoreHorizontal, component: Misc },
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
  <div class="space-y-3">
    <!-- Fixed section: Basics -->
    <div 
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
      :class="{ 'ring-2 ring-blue-100 border-blue-200': isSectionActive(fixedSection.id) }"
    >
      <div class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div class="flex items-center gap-3 flex-1" @click="toggleSection(fixedSection.id)">
          <component :is="fixedSection.icon" class="w-5 h-5 text-gray-500 flex-shrink-0" :class="{ 'text-blue-600': isSectionActive(fixedSection.id) }" />
          <span class="font-semibold text-gray-700" :class="{ 'text-gray-900': isSectionActive(fixedSection.id) }">
            {{ $t(fixedSection.labelKey) }}
          </span>
        </div>
        <button @click="toggleSection(fixedSection.id)" class="p-1 hover:bg-gray-100 rounded">
          <component 
            :is="isSectionActive(fixedSection.id) ? ChevronDown : ChevronRight" 
            class="w-4 h-4 text-gray-400"
          />
        </button>
      </div>
      
      <div 
        v-show="isSectionActive(fixedSection.id)" 
        class="border-t border-gray-100 bg-gray-50/50"
      >
        <div class="p-5">
          <component :is="fixedSection.component" />
        </div>
      </div>
    </div>

    <!-- Draggable sections -->
    <div 
      v-for="(section, index) in draggableSections" 
      :key="section.id" 
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
      :class="{ 
        'ring-2 ring-blue-100 border-blue-200': isSectionActive(section.id),
        'opacity-50': draggedIndex === index,
        'ring-2 ring-blue-400': dragOverIndex === index && draggedIndex !== index
      }"
      @dragover="handleDragOver(index, $event)"
      @drop="handleDrop(index, $event)"
    >
      <div 
        class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragend="handleDragEnd"
      >
        <div class="flex items-center gap-3 flex-1" @click="toggleSection(section.id)">
          <GripVertical class="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0" />
          <component :is="section.icon" class="w-5 h-5 text-gray-500 flex-shrink-0" :class="{ 'text-blue-600': isSectionActive(section.id) }" />
          <span class="font-semibold text-gray-700" :class="{ 'text-gray-900': isSectionActive(section.id) }">
            {{ $t(section.labelKey) }}
          </span>
        </div>
        <button @click="toggleSection(section.id)" class="p-1 hover:bg-gray-100 rounded">
          <component 
            :is="isSectionActive(section.id) ? ChevronDown : ChevronRight" 
            class="w-4 h-4 text-gray-400"
          />
        </button>
      </div>
      
      <div 
        v-show="isSectionActive(section.id)" 
        class="border-t border-gray-100 bg-gray-50/50"
      >
        <div class="p-5">
          <component :is="section.component" />
        </div>
      </div>
    </div>
  </div>
</template>
