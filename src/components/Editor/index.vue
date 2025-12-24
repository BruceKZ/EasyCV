<script setup lang="ts">
import Basics from './Basics.vue'
import Education from './Education.vue'
import Work from './Work.vue'
import Projects from './Projects.vue'
import Skills from './Skills.vue'
import Misc from './Misc.vue'
import Awards from './Awards.vue'
import { ref, computed } from 'vue'
import { useResumeStore } from '../../stores/resume'
import { ChevronDown, ChevronRight, User, GraduationCap, Briefcase, FolderGit2, Code2, Trophy, MoreHorizontal } from 'lucide-vue-next'

const store = useResumeStore()
const activeSection = ref<string | null>('basics')

const toggleSection = (section: string) => {
  activeSection.value = activeSection.value === section ? null : section
}

const sections = computed(() => {
  const isCn = store.language === 'cn'
  return [
    { id: 'basics', label: isCn ? '基本信息' : 'Basic Information', icon: User, component: Basics },
    { id: 'education', label: isCn ? '教育经历' : 'Education', icon: GraduationCap, component: Education },
    { id: 'work', label: isCn ? '工作经历' : 'Work Experience', icon: Briefcase, component: Work },
    { id: 'projects', label: isCn ? '项目经历' : 'Projects', icon: FolderGit2, component: Projects },
    { id: 'skills', label: isCn ? '技能' : 'Skills', icon: Code2, component: Skills },
    { id: 'awards', label: isCn ? '获奖情况' : 'Awards', icon: Trophy, component: Awards },
    { id: 'misc', label: isCn ? '其他' : 'Miscellaneous', icon: MoreHorizontal, component: Misc },
  ]
})
</script>

<template>
  <div class="space-y-3">
    <div 
      v-for="section in sections" 
      :key="section.id" 
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
      :class="{ 'ring-2 ring-blue-100 border-blue-200': activeSection === section.id }"
    >
      <button 
        @click="toggleSection(section.id)" 
        class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-3">
          <component :is="section.icon" class="w-5 h-5 text-gray-500" :class="{ 'text-blue-600': activeSection === section.id }" />
          <span class="font-semibold text-gray-700" :class="{ 'text-gray-900': activeSection === section.id }">
            {{ section.label }}
          </span>
        </div>
        <component 
          :is="activeSection === section.id ? ChevronDown : ChevronRight" 
          class="w-4 h-4 text-gray-400"
        />
      </button>
      
      <div 
        v-show="activeSection === section.id" 
        class="border-t border-gray-100 bg-gray-50/50"
      >
        <div class="p-5">
          <component :is="section.component" />
        </div>
      </div>
    </div>
  </div>
</template>
