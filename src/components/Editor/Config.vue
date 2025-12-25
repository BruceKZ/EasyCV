<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { SettingOutlined } from '@ant-design/icons-vue'

const store = useResumeStore()
</script>

<template>
  <div v-if="store.resumeData.settings" class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-gray-600">
        <SettingOutlined />
        <span class="font-medium">{{ $t('editor.settings.showPageNumbers') }}</span>
      </div>
      <a-switch v-model:checked="store.resumeData.settings.showPageNumbers" />
    </div>
  </div>
</template>
