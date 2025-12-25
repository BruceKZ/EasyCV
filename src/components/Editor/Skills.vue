<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'

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
    <a-card 
      v-for="(skill, index) in store.resumeData.skills" 
      :key="index" 
      class="shadow-sm hover:shadow-md transition-shadow"
      :bodyStyle="{ padding: '16px' }"
    >
      <template #extra>
        <a-button type="text" danger @click="removeSkill(index)">
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </template>

      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24" :md="12">
            <a-form-item :label="$t('editor.skills.category')" :validate-status="store.missingKeys.has('key') ? 'error' : ''">
              <a-input v-model:value="skill.key" placeholder="Programming Languages" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12">
            <a-form-item :label="$t('editor.skills.items')" :validate-status="store.missingKeys.has('value') ? 'error' : ''">
              <a-textarea 
                v-model:value="skill.value" 
                :auto-size="{ minRows: 2, maxRows: 6 }"
                placeholder="C++, Rust, Python..." 
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    
    <a-button type="dashed" block @click="addSkill" class="py-4 h-auto">
      <template #icon><PlusOutlined /></template>
      {{ $t('editor.skills.addSkill') }}
    </a-button>
  </div>
</template>
