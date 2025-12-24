<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { Trash2, Plus } from 'lucide-vue-next'
import { computed } from 'vue'

const store = useResumeStore()

const labels = computed(() => {
  const isCn = store.language === 'cn'
  return {
    award: isCn ? '奖项' : 'Award',
    addAward: isCn ? '添加奖项' : 'Add Award'
  }
})

const addAward = () => {
  store.resumeData.awards.push('')
}

const removeAward = (index: number) => {
  store.resumeData.awards.splice(index, 1)
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="(item, index) in store.resumeData.awards" :key="index" class="flex gap-3 items-start group">
      <div class="flex-1 space-y-2">
        <input 
          v-model="store.resumeData.awards[index]" 
          class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
          :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('awards') }"
          :placeholder="labels.award" 
        />
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
      <Plus class="w-5 h-5" /> {{ labels.addAward }}
    </button>
  </div>
</template>
