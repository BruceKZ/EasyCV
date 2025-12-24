<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { Trash2, Plus, X } from 'lucide-vue-next'

const store = useResumeStore()

const addProject = () => {
  store.resumeData.projects.push({
    name: '',
    description: '',
    details: [],
    link: '',
    tech_stack: ''
  })
}

const removeProject = (index: number) => {
  store.resumeData.projects.splice(index, 1)
}

const addDetail = (pIndex: number) => {
  store.resumeData.projects[pIndex]!.details.push('')
}

const removeDetail = (pIndex: number, dIndex: number) => {
  store.resumeData.projects[pIndex]!.details.splice(dIndex, 1)
}
</script>

<template>
  <div class="space-y-6">
    <div 
      v-for="(project, index) in store.resumeData.projects" 
      :key="index" 
      class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm relative group hover:border-blue-300 transition-colors"
    >
      <button 
        @click="removeProject(index)" 
        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
        title="Remove Project"
      >
        <Trash2 class="w-4 h-4" />
      </button>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="col-span-1 md:col-span-2 space-y-1">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('editor.projects.name') }}</label>
            <input 
              v-model="project.name" 
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
              :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('name') }"
              placeholder="Project Name"
            />
        </div>

        <div class="col-span-1 md:col-span-2 space-y-1">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('editor.projects.description') }}</label>
            <textarea 
              v-model="project.description" 
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors resize-y" 
              :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('description') }"
              rows="2"
              wrap="soft"
              style="white-space: pre-wrap; overflow-wrap: break-word; word-wrap: break-word;"
              placeholder="Description" 
            ></textarea>
        </div>
        
        <div class="col-span-1 md:col-span-2 space-y-1">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('editor.projects.link') }}</label>
            <input 
              v-model="project.link" 
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
              :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('link') }"
              placeholder="Link"
            />
        </div>

        <div class="col-span-1 md:col-span-2 space-y-1">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('editor.projects.tech_stack') }}</label>
            <input 
              v-model="project.tech_stack" 
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
              :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('tech_stack') }"
              placeholder="Tech Stack"
            />
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('editor.projects.details') }}</label>
        <div v-for="(_detail, dIndex) in project.details" :key="dIndex" class="flex gap-2 items-start group/detail">
           <div class="flex-1 space-y-2">
             <textarea 
               v-model="project.details[dIndex]" 
               class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors resize-y" 
               rows="2"
               wrap="soft"
               style="white-space: pre-wrap; overflow-wrap: break-word; word-wrap: break-word;"
               placeholder="Detail" 
             ></textarea>
           </div>
           <button 
             @click="removeDetail(index, dIndex)" 
             class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 mt-2 opacity-0 group-hover/detail:opacity-100 transition-all"
             title="Remove Detail"
           >
             <X class="w-4 h-4" />
           </button>
        </div>
        <button 
          @click="addDetail(index)" 
          class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-2 px-2 py-1 rounded hover:bg-blue-50 transition-colors w-fit"
        >
          <Plus class="w-4 h-4" /> {{ $t('editor.projects.addDetail') }}
        </button>
      </div>
    </div>
    
    <button 
      @click="addProject" 
      class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
    >
      <Plus class="w-5 h-5" /> {{ $t('editor.projects.addProject') }}
    </button>
  </div>
</template>
