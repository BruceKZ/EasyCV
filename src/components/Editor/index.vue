<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus' // 引入库
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

// --- 保持原本的 LocalStorage 逻辑不变 ---
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

// --- 定义 Section 数据结构 ---
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

// --- 核心：拖动列表的计算属性 ---
// 这是一个代理，Get时将 ID 转换为对象，Set时将对象转回 ID 存入 Store
const draggableList = computed({
  get: () => {
    return store.sectionOrder
      .map((id: string) => sectionDefinitions[id as keyof typeof sectionDefinitions])
      .filter((section): section is NonNullable<typeof section> => section !== undefined)
  },
  set: (val) => {
    // 拖动完成后，将对象数组转回 ID 数组更新 Store
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
/* Ghost Item: 占位符样式
  这是原本列表中的位置，用户希望看到"重点色边框"和"规则布局"
*/
.ghost-item {
  opacity: 1; /* 保持可见，或者设为 0.5 半透明 */
  background-color: #f0f9ff !important; /* 浅蓝色背景 */
  border: 2px dashed #3b82f6 !important; /* 重点色虚线框 */
  box-shadow: none !important;
  
  /* 如果你想让占位符里的内容不可见，只保留框，可以加上这个： */
  /* color: transparent !important; */
}

/* 让占位符内部元素变淡，突出框 */
.ghost-item * {
  opacity: 0.3; 
}

/* Dragging Item: 正在被拖拽的元素样式
  这是跟随鼠标/手指移动的元素
*/
.dragging-item {
  opacity: 1 !important;
  background-color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  transform: scale(1.02); /* 稍微放大一点，增加立体感 */
  cursor: grabbing;
  border: 1px solid #3b82f6; /* 拖拽时给个实线边框 */
  z-index: 9999; /* 确保在最上层 */
}

/* 处理移动端触摸行为，防止页面随拖动滚动 */
.drag-handle {
  touch-action: none; 
}
</style>