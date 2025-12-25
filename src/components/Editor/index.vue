<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus' // Import library
import Basics from './Basics.vue'
import Education from './Education.vue'
import Work from './Work.vue'
import Projects from './Projects.vue'
import Skills from './Skills.vue'
import Misc from './Misc.vue'
import Awards from './Awards.vue'
import { 
  UserOutlined, ReadOutlined, SolutionOutlined, ProjectOutlined, 
  CodeOutlined, TrophyOutlined, EllipsisOutlined, HolderOutlined,
  DownOutlined, RightOutlined
} from '@ant-design/icons-vue'
import { useResumeStore } from '../../stores/resume'

const store = useResumeStore()

const STORAGE_KEY_ACTIVE_SECTIONS = 'easycv-editor-active-sections'
const getSavedActiveSections = (): Set<string> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_SECTIONS)
    return saved ? new Set(JSON.parse(saved)) : new Set(['basics'])
  } catch (e) {
    return new Set(['basics'])
  }
}
const activeSections = ref<Set<string>>(getSavedActiveSections())

const toggleSection = (section: string, event?: MouseEvent) => {
  if (event && (event.target as HTMLElement).closest('.drag-handle')) return
  
  if (activeSections.value.has(section)) {
    activeSections.value.delete(section)
  } else {
    activeSections.value.add(section)
  }
  activeSections.value = new Set(activeSections.value)
}

const isSectionActive = (section: string) => activeSections.value.has(section)

watch(activeSections, (newValue) => {
  localStorage.setItem(STORAGE_KEY_ACTIVE_SECTIONS, JSON.stringify(Array.from(newValue)))
}, { deep: true })

// --- Define Section data structure ---
const sectionDefinitions = {
  basics: { id: 'basics', labelKey: 'editor.sections.basics', icon: UserOutlined, component: Basics },
  education: { id: 'education', labelKey: 'editor.sections.education', icon: ReadOutlined, component: Education },
  work: { id: 'work', labelKey: 'editor.sections.work', icon: SolutionOutlined, component: Work },
  projects: { id: 'projects', labelKey: 'editor.sections.projects', icon: ProjectOutlined, component: Projects },
  skills: { id: 'skills', labelKey: 'editor.sections.skills', icon: CodeOutlined, component: Skills },
  awards: { id: 'awards', labelKey: 'editor.sections.awards', icon: TrophyOutlined, component: Awards },
  misc: { id: 'misc', labelKey: 'editor.sections.misc', icon: EllipsisOutlined, component: Misc },
}

const fixedSection = sectionDefinitions.basics

// --- Core: Computed property for draggable list ---
// This is a proxy: converts ID to object on Get, and converts object back to ID on Set to save in Store
const draggableList = computed({
  get: () => {
    return store.sectionOrder
      .map((id: string) => sectionDefinitions[id as keyof typeof sectionDefinitions])
      .filter((section): section is NonNullable<typeof section> => section !== undefined)
  },
  set: (val) => {
    // After dragging, convert object array back to ID array to update Store
    store.updateSectionOrder(val.map(item => item.id))
  }
})
</script>

<template>
  <div class="flex flex-col gap-y-4">
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
          <component :is="fixedSection.icon" :style="{ color: isSectionActive(fixedSection.id) ? '#2563eb' : '#4b5563', fontSize: '18px' }" />
          <span class="font-semibold text-gray-700">{{ $t(fixedSection.labelKey) }}</span>
        </div>
        <component :is="isSectionActive(fixedSection.id) ? DownOutlined : RightOutlined" class="text-xs text-gray-400"/>
      </div>
      <div v-show="isSectionActive(fixedSection.id)" class="border-t border-gray-100 bg-gray-50/30 p-5">
        <component :is="fixedSection.component" />
      </div>
    </a-card>

    <VueDraggable
      v-model="draggableList"
      :animation="200"
      handle=".drag-handle"
      ghost-class="ghost-item"
      drag-class="dragging-item"
      class="flex flex-col gap-y-4"
    >
      <a-card 
        v-for="section in draggableList" 
        :key="section.id" 
        :bordered="false"
        class="shadow-sm transition-all !bg-white group"
        :class="{ 'ring-2 ring-blue-100': isSectionActive(section.id) }"
        :bodyStyle="{ padding: 0 }"
      >
        <div class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3 flex-1 cursor-pointer" @click="toggleSection(section.id, $event)">
            <div class="drag-handle p-1 -ml-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-500 transition-colors touch-none">
              <HolderOutlined :style="{ fontSize: '16px' }" />
            </div>
            
            <component :is="section.icon" :style="{ color: isSectionActive(section.id) ? '#2563eb' : '#4b5563', fontSize: '18px' }" />
            
            <span class="font-semibold text-gray-700 select-none" :class="{ 'text-gray-900': isSectionActive(section.id) }">
              {{ $t(section.labelKey) }}
            </span>
          </div>
          
          <component 
            :is="isSectionActive(section.id) ? DownOutlined : RightOutlined" 
            class="text-xs text-gray-400 cursor-pointer p-1"
            @click="toggleSection(section.id, $event)"
          />
        </div>
        
        <div v-show="isSectionActive(section.id)" class="border-t border-gray-100 bg-gray-50/30 p-5">
          <component :is="section.component" />
        </div>
      </a-card>
    </VueDraggable>
  </div>
</template>

<style scoped>
/* Ghost Item: Placeholder style
  This is the position in the original list; users expect to see "accent color border" and "regular layout"
*/
.ghost-item {
  opacity: 1; /* Keep visible, or set to 0.5 for semi-transparent */
  background-color: #f0f9ff !important; /* Light blue background */
  border: 2px dashed #3b82f6 !important; /* Accent color dashed border */
  box-shadow: none !important;
  
  /* If you want to make the content in the placeholder invisible and only keep the frame, you can add this: */
  /* color: transparent !important; */
}

/* Fade internal elements of the placeholder to highlight the frame */
.ghost-item * {
  opacity: 0.3; 
}

/* Dragging Item: Style for the element being dragged
  This is the element that follows the mouse/finger movement
*/
.dragging-item {
  opacity: 1 !important;
  background-color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  transform: scale(1.02); /* Scale up slightly to add a sense of depth */
  cursor: grabbing;
  border: 1px solid #3b82f6; /* Give a solid border when dragging */
  z-index: 9999; /* Ensure it's on the top layer */
}

/* Handle mobile touch behavior to prevent page scrolling during drag */
.drag-handle {
  touch-action: none; 
}
</style>