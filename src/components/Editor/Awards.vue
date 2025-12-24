<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { Trash2, Plus } from 'lucide-vue-next'

const store = useResumeStore()

const addAward = () => {
  store.resumeData.awards.push('')
}

const removeAward = (index: number) => {
  store.resumeData.awards.splice(index, 1)
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="(_item, index) in store.resumeData.awards" :key="index" class="flex gap-3 items-start group">
      <div class="flex-1 space-y-2">
        <textarea 
          v-model="store.resumeData.awards[index]" 
          class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors resize-y" 
          :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('awards') }"
          rows="2"
          wrap="soft"
          style="white-space: pre-wrap; overflow-wrap: break-word; word-wrap: break-word;"
          :placeholder="$t('editor.awards.award')" 
        ></textarea>
      </div>
      <button 
        @click="removeAward(index)" 
        class="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 mt-1 transition-colors"
        title="Remove Award"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
    
    <button 
      @click="addAward" 
      class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
    >
      <Plus class="w-5 h-5" /> {{ $t('editor.awards.addAward') }}
    </button>
  </div>
</template>
