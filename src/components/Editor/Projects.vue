<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { DeleteOutlined, PlusOutlined, CloseOutlined, HolderOutlined } from '@ant-design/icons-vue'
import { VueDraggable } from 'vue-draggable-plus'

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
  <div class="space-y-4">
    <a-card 
      v-for="(project, index) in store.resumeData.projects" 
      :key="index" 
      class="shadow-sm hover:shadow-md transition-shadow"
      :bodyStyle="{ padding: '16px' }"
    >
      <template #extra>
        <a-button type="text" danger @click="removeProject(index)">
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </template>

      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item :label="$t('editor.projects.name')" :validate-status="store.missingKeys.has('name') ? 'error' : ''">
              <a-input v-model:value="project.name" placeholder="Project Name" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('editor.projects.description')" :validate-status="store.missingKeys.has('description') ? 'error' : ''">
              <a-textarea 
                v-model:value="project.description" 
                :auto-size="{ minRows: 2, maxRows: 6 }"
                placeholder="Description" 
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('editor.projects.link')" :validate-status="store.missingKeys.has('link') ? 'error' : ''">
              <a-input v-model:value="project.link" placeholder="Link" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="$t('editor.projects.tech_stack')" :validate-status="store.missingKeys.has('tech_stack') ? 'error' : ''">
              <a-input v-model:value="project.tech_stack" placeholder="Tech Stack" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="$t('editor.projects.details')">
          <VueDraggable v-model="project.details" handle=".handle" class="flex flex-col gap-2 mb-2">
            <div v-for="(_detail, dIndex) in project.details" :key="dIndex" class="flex gap-2 items-start">
              <div class="handle cursor-move mt-2 text-gray-400 hover:text-gray-600">
                <HolderOutlined />
              </div>
              <a-textarea 
                v-model:value="project.details[dIndex]" 
                :auto-size="{ minRows: 2, maxRows: 6 }"
                placeholder="Detail" 
              />
              <a-button type="text" danger size="small" @click="removeDetail(index, dIndex)">
                <template #icon><CloseOutlined /></template>
              </a-button>
            </div>
          </VueDraggable>
          <a-button type="dashed" size="small" block @click="addDetail(index)">
            <template #icon><PlusOutlined /></template>
            {{ $t('editor.projects.addDetail') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    
    <a-button type="dashed" block @click="addProject" class="py-4 h-auto">
      <template #icon><PlusOutlined /></template>
      {{ $t('editor.projects.addProject') }}
    </a-button>
  </div>
</template>
