<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { DeleteOutlined, PlusOutlined, CloseOutlined, HolderOutlined } from '@ant-design/icons-vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'

const store = useResumeStore()
const { t } = useI18n()

const addEducation = () => {
  store.resumeData.education.push({
    school: '',
    degree: '',
    time: '',
    details: []
  })
}

const removeEducation = (index: number) => {
  store.resumeData.education.splice(index, 1)
}

const addDetail = (eduIndex: number) => {
  store.resumeData.education[eduIndex]!.details.push('')
}

const removeDetail = (eduIndex: number, detailIndex: number) => {
  store.resumeData.education[eduIndex]!.details.splice(detailIndex, 1)
}

const parseDate = (dateStr: string) => {
  if (!dateStr) return { start: '', end: '', isPresent: false }
  const parts = dateStr.split(' - ')
  if (parts.length !== 2) return { start: '', end: '', isPresent: false }
  
  const start = parts[0]!.replace('.', '-')
  const isPresent = parts[1]!.toLowerCase() === 'present' || parts[1] === 'Present'
  const end = isPresent ? '' : parts[1]!.replace('.', '-')
  
  return { start, end, isPresent }
}

const updateTime = (index: number, start: string, end: string, isPresent: boolean) => {
  const formatDate = (d: string) => d.replace('-', '.')
  const endStr = isPresent ? t('editor.education.present') : formatDate(end)
  store.resumeData.education[index]!.time = `${formatDate(start)} - ${endStr}`
}

const getStartDate = (index: number) => parseDate(store.resumeData.education[index]!.time).start
const getEndDate = (index: number) => parseDate(store.resumeData.education[index]!.time).end
const getIsPresent = (index: number) => parseDate(store.resumeData.education[index]!.time).isPresent

const setStartDate = (index: number, value: string) => {
  const { end, isPresent } = parseDate(store.resumeData.education[index]!.time)
  updateTime(index, value, end, isPresent)
}

const setEndDate = (index: number, value: string) => {
  const { start, isPresent } = parseDate(store.resumeData.education[index]!.time)
  updateTime(index, start, value, isPresent)
}

const setIsPresent = (index: number, value: boolean) => {
  const { start, end } = parseDate(store.resumeData.education[index]!.time)
  updateTime(index, start, end, value)
}
</script>

<template>
  <div class="space-y-4">
    <a-card 
      v-for="(edu, index) in store.resumeData.education" 
      :key="index" 
      class="shadow-sm hover:shadow-md transition-shadow"
      :bodyStyle="{ padding: '16px' }"
    >
      <template #extra>
        <a-button type="text" danger @click="removeEducation(index)">
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </template>
      
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24" :md="12">
            <a-form-item :label="$t('editor.education.school')" :validate-status="store.missingKeys.has('school') ? 'error' : ''">
              <a-input v-model:value="edu.school" placeholder="University Name" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12">
            <a-form-item :label="$t('editor.education.degree')" :validate-status="store.missingKeys.has('degree') ? 'error' : ''">
              <a-input v-model:value="edu.degree" placeholder="Degree" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="$t('editor.education.time')" :validate-status="store.missingKeys.has('time') ? 'error' : ''">
          <div class="flex items-center gap-2 flex-wrap">
            <input 
              type="month"
              :value="getStartDate(index)"
              @input="(e: Event) => setStartDate(index, (e.target as HTMLInputElement).value)"
              class="ant-input w-auto"
            />
            <span class="text-gray-500">-</span>
            <input 
              type="month"
              :value="getEndDate(index)"
              @input="(e: Event) => setEndDate(index, (e.target as HTMLInputElement).value)"
              :disabled="getIsPresent(index)"
              class="ant-input w-auto disabled:bg-gray-100 disabled:text-gray-400"
            />
            <a-checkbox 
              :checked="getIsPresent(index)"
              @change="(e: Event) => setIsPresent(index, (e.target as HTMLInputElement).checked)"
            >
              {{ $t('editor.education.present') }}
            </a-checkbox>
          </div>
        </a-form-item>

        <a-form-item :label="$t('editor.education.details')">
          <VueDraggable v-model="edu.details" handle=".handle" class="flex flex-col gap-2 mb-2">
            <div v-for="(_detail, dIndex) in edu.details" :key="dIndex" class="flex gap-2 items-start">
              <div class="handle cursor-move mt-2 text-gray-400 hover:text-gray-600">
                <HolderOutlined />
              </div>
              <a-textarea 
                v-model:value="edu.details[dIndex]" 
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
            {{ $t('editor.education.addDetail') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    
    <a-button type="dashed" block @click="addEducation" class="py-4 h-auto">
      <template #icon><PlusOutlined /></template>
      {{ $t('editor.education.addEducation') }}
    </a-button>
  </div>
</template>
