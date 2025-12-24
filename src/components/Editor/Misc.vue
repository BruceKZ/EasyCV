<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { Trash2, Plus } from 'lucide-vue-next'
import { computed } from 'vue'

const store = useResumeStore()

const labels = computed(() => {
  const isCn = store.language === 'cn'
  return {
    item: isCn ? '内容' : 'Item',
    addMisc: isCn ? '添加其他项' : 'Add Misc Item'
  }
})

const addMisc = () => {
  store.resumeData.misc.push('')
}

const removeMisc = (index: number) => {
  store.resumeData.misc.splice(index, 1)
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="(item, index) in store.resumeData.misc" :key="index" class="flex gap-3 items-start group">
      <div class="flex-1 space-y-2">
        <input 
          v-model="store.resumeData.misc[index]" 
          class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
          :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('misc') }"
          :placeholder="labels.item" 
        />
      </div>
      <button 
        @click="removeMisc(index)" 
        class="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 mt-1 transition-colors"
        title="Remove Item"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
    
    <button 
      @click="addMisc" 
      class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
    >
      <Plus class="w-5 h-5" /> {{ labels.addMisc }}
    </button>
  </div>
</template>
