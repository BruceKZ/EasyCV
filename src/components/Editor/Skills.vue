<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { Trash2, Plus } from 'lucide-vue-next'

const store = useResumeStore()

const addSkill = () => {
  store.resumeData.skills.push({
    key: '',
    value: ''
  })
}

const removeSkill = (index: number) => {
  store.resumeData.skills.splice(index, 1)
}
</script>

<template>
  <div class="space-y-4">
    <div 
      v-for="(skill, index) in store.resumeData.skills" 
      :key="index" 
      class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm relative group hover:border-blue-300 transition-colors"
    >
      <button 
        @click="removeSkill(index)" 
        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
        title="Remove Skill Category"
      >
        <Trash2 class="w-4 h-4" />
      </button>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('editor.skills.category') }}</label>
          <input 
            v-model="skill.key" 
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
            :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('key') }"
            placeholder="Programming Languages"
          />
        </div>
        
        <div class="col-span-1 md:col-span-2 space-y-1">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('editor.skills.items') }}</label>
          <textarea 
            v-model="skill.value" 
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
            :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('value') }"
            rows="2"
            placeholder="C++, Rust, Python..."
          ></textarea>
        </div>
      </div>
    </div>
    
    <button 
      @click="addSkill" 
      class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
    >
      <Plus class="w-5 h-5" /> {{ $t('editor.skills.addSkill') }}
    </button>
  </div>
</template>
