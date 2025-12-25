<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'

const store = useResumeStore()

const addMisc = () => {
  store.resumeData.misc.push('')
}

const removeMisc = (index: number) => {
  store.resumeData.misc.splice(index, 1)
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="(_item, index) in store.resumeData.misc" :key="index" class="flex gap-3 items-start group">
      <div class="flex-1">
        <a-textarea 
          v-model:value="store.resumeData.misc[index]" 
          :auto-size="{ minRows: 2, maxRows: 6 }"
          :status="store.missingKeys.has('misc') ? 'error' : ''"
          :placeholder="$t('editor.misc.item')" 
        />
      </div>
      <a-button type="text" danger @click="removeMisc(index)">
        <template #icon><DeleteOutlined /></template>
      </a-button>
    </div>
    
    <a-button type="dashed" block @click="addMisc" class="py-4 h-auto">
      <template #icon><PlusOutlined /></template>
      {{ $t('editor.misc.addMisc') }}
    </a-button>
  </div>
</template>
