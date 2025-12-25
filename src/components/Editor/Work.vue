<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { DeleteOutlined, PlusOutlined, CloseOutlined, HolderOutlined } from '@ant-design/icons-vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'

const store = useResumeStore()
const { t } = useI18n()

const addWork = () => {
  store.resumeData.work.push({
    company: '',
    team: '',
    role: '',
    time: '',
    details: []
  })
}

const removeWork = (index: number) => {
  store.resumeData.work.splice(index, 1)
}

const addDetail = (wIndex: number) => {
  store.resumeData.work[wIndex]!.details.push('')
}

const removeDetail = (wIndex: number, dIndex: number) => {
  store.resumeData.work[wIndex]!.details.splice(dIndex, 1)
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
  const endStr = isPresent ? t('editor.work.present') : formatDate(end)
  store.resumeData.work[index]!.time = `${formatDate(start)} - ${endStr}`
}

const getStartDate = (index: number) => parseDate(store.resumeData.work[index]!.time).start
const getEndDate = (index: number) => parseDate(store.resumeData.work[index]!.time).end
const getIsPresent = (index: number) => parseDate(store.resumeData.work[index]!.time).isPresent

const setStartDate = (index: number, value: string) => {
  const { end, isPresent } = parseDate(store.resumeData.work[index]!.time)
  updateTime(index, value, end, isPresent)
}

const setEndDate = (index: number, value: string) => {
  const { start, isPresent } = parseDate(store.resumeData.work[index]!.time)
  updateTime(index, start, value, isPresent)
}

const setIsPresent = (index: number, value: boolean) => {
  const { start, end } = parseDate(store.resumeData.work[index]!.time)
  updateTime(index, start, end, value)
}
</script>

<template>
  <div class="space-y-4">
    <a-card 
      v-for="(work, index) in store.resumeData.work" 
      :key="index" 
      class="shadow-sm hover:shadow-md transition-shadow"
      :bodyStyle="{ padding: '16px' }"
    >
      <template #extra>
        <a-button type="text" danger @click="removeWork(index)">
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </template>

      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item :label="$t('editor.work.company')" :validate-status="store.missingKeys.has('company') ? 'error' : ''">
              <a-input v-model:value="work.company" placeholder="Company Name" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12">
            <a-form-item :label="$t('editor.work.team')" :validate-status="store.missingKeys.has('team') ? 'error' : ''">
              <a-input v-model:value="work.team" placeholder="Team Name" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12">
            <a-form-item :label="$t('editor.work.role')" :validate-status="store.missingKeys.has('role') ? 'error' : ''">
              <a-input v-model:value="work.role" placeholder="Role" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="$t('editor.work.time')" :validate-status="store.missingKeys.has('time') ? 'error' : ''">
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
              {{ $t('editor.work.present') }}
            </a-checkbox>
          </div>
        </a-form-item>

        <a-form-item :label="$t('editor.work.details')">
          <VueDraggable v-model="work.details" handle=".handle" class="flex flex-col gap-2 mb-2">
            <div v-for="(_detail, dIndex) in work.details" :key="dIndex" class="flex gap-2 items-start">
              <div class="handle cursor-move mt-2 text-gray-400 hover:text-gray-600">
                <HolderOutlined />
              </div>
              <a-textarea 
                v-model:value="work.details[dIndex]" 
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
            {{ $t('editor.work.addDetail') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    
    <a-button type="dashed" block @click="addWork" class="py-4 h-auto">
      <template #icon><PlusOutlined /></template>
      {{ $t('editor.work.addWork') }}
    </a-button>
  </div>
</template>
