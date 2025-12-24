<script setup lang="ts">
import Basics from './Basics.vue'
import Education from './Education.vue'
import Work from './Work.vue'
import Projects from './Projects.vue'
import Skills from './Skills.vue'
import Misc from './Misc.vue'
import Awards from './Awards.vue'
import { ref, watch } from 'vue'
import { ChevronDown, ChevronRight, User, GraduationCap, Briefcase, FolderGit2, Code2, Trophy, MoreHorizontal } from 'lucide-vue-next'

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

// Watch activeSections changes and save to localStorage
watch(activeSections, (newValue) => {
  try {
    const sectionsArray = Array.from(newValue)
    localStorage.setItem(STORAGE_KEY_ACTIVE_SECTIONS, JSON.stringify(sectionsArray))
  } catch (e) {
    console.error('Failed to save active sections to localStorage:', e)
  }
}, { deep: true })

const sections = [
  { id: 'basics', labelKey: 'editor.sections.basics', icon: User, component: Basics },
  { id: 'education', labelKey: 'editor.sections.education', icon: GraduationCap, component: Education },
  { id: 'work', labelKey: 'editor.sections.work', icon: Briefcase, component: Work },
  { id: 'projects', labelKey: 'editor.sections.projects', icon: FolderGit2, component: Projects },
  { id: 'skills', labelKey: 'editor.sections.skills', icon: Code2, component: Skills },
  { id: 'awards', labelKey: 'editor.sections.awards', icon: Trophy, component: Awards },
  { id: 'misc', labelKey: 'editor.sections.misc', icon: MoreHorizontal, component: Misc },
]
</script>

<template>
  <div class="space-y-3">
    <div 
      v-for="section in sections" 
      :key="section.id" 
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
      :class="{ 'ring-2 ring-blue-100 border-blue-200': isSectionActive(section.id) }"
    >
      <button 
        @click="toggleSection(section.id)" 
        class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-3">
          <component :is="section.icon" class="w-5 h-5 text-gray-500" :class="{ 'text-blue-600': isSectionActive(section.id) }" />
          <span class="font-semibold text-gray-700" :class="{ 'text-gray-900': isSectionActive(section.id) }">
            {{ $t(section.labelKey) }}
          </span>
        </div>
        <component 
          :is="isSectionActive(section.id) ? ChevronDown : ChevronRight" 
          class="w-4 h-4 text-gray-400"
        />
      </button>
      
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
