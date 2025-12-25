<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'

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
      <div class="flex-1">
        <a-textarea 
          v-model:value="store.resumeData.awards[index]" 
          :auto-size="{ minRows: 2, maxRows: 6 }"
          :status="store.missingKeys.has('awards') ? 'error' : ''"
          :placeholder="$t('editor.awards.award')" 
        />
      </div>
      <a-button type="text" danger @click="removeAward(index)">
        <template #icon><DeleteOutlined /></template>
      </a-button>
    </div>
    
    <a-button type="dashed" block @click="addAward" class="py-4 h-auto">
      <template #icon><PlusOutlined /></template>
      {{ $t('editor.awards.addAward') }}
    </a-button>
  </div>
</template>
