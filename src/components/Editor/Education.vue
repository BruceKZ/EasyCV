<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'
import { Trash2, Plus, X } from 'lucide-vue-next'
import { computed } from 'vue'

const store = useResumeStore()

const labels = computed(() => {
  const isCn = store.language === 'cn'
  return {
    school: isCn ? '学校' : 'School',
    degree: isCn ? '学位' : 'Degree',
    time: isCn ? '时间' : 'Time',
    startDate: isCn ? '开始时间' : 'Start Date',
    endDate: isCn ? '结束时间' : 'End Date',
    present: isCn ? '至今' : 'Present',
    details: isCn ? '详情' : 'Details',
    addDetail: isCn ? '添加详情' : 'Add Detail',
    addEducation: isCn ? '添加教育经历' : 'Add Education'
  }
})

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
  store.resumeData.education[eduIndex].details.push('')
}

const removeDetail = (eduIndex: number, detailIndex: number) => {
  store.resumeData.education[eduIndex].details.splice(detailIndex, 1)
}

const parseDate = (dateStr: string) => {
  if (!dateStr) return { start: '', end: '', isPresent: false }
  const parts = dateStr.split(' - ')
  if (parts.length !== 2) return { start: '', end: '', isPresent: false }
  
  const start = parts[0].replace('.', '-')
  const isPresent = parts[1].toLowerCase() === 'present' || parts[1] === '至今'
  const end = isPresent ? '' : parts[1].replace('.', '-')
  
  return { start, end, isPresent }
}

const updateTime = (index: number, start: string, end: string, isPresent: boolean) => {
  const formatDate = (d: string) => d.replace('-', '.')
  const endStr = isPresent ? (store.language === 'cn' ? '至今' : 'Present') : formatDate(end)
  store.resumeData.education[index].time = `${formatDate(start)} - ${endStr}`
}

const getStartDate = (index: number) => parseDate(store.resumeData.education[index].time).start
const getEndDate = (index: number) => parseDate(store.resumeData.education[index].time).end
const getIsPresent = (index: number) => parseDate(store.resumeData.education[index].time).isPresent

const setStartDate = (index: number, value: string) => {
  const { end, isPresent } = parseDate(store.resumeData.education[index].time)
  updateTime(index, value, end, isPresent)
}

const setEndDate = (index: number, value: string) => {
  const { start, isPresent } = parseDate(store.resumeData.education[index].time)
  updateTime(index, start, value, isPresent)
}

const setIsPresent = (index: number, value: boolean) => {
  const { start, end } = parseDate(store.resumeData.education[index].time)
  updateTime(index, start, end, value)
}
</script>

<template>
  <div class="space-y-6">
    <div 
      v-for="(edu, index) in store.resumeData.education" 
      :key="index" 
      class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm relative group hover:border-blue-300 transition-colors"
    >
      <button 
        @click="removeEducation(index)" 
        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
        title="Remove Education"
      >
        <Trash2 class="w-4 h-4" />
      </button>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ labels.school }}</label>
          <input 
            v-model="edu.school" 
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
            :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('school') }"
            placeholder="University Name"
          />
        </div>
        
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ labels.degree }}</label>
          <input 
            v-model="edu.degree" 
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
            :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('degree') }"
            placeholder="Degree"
          />
        </div>
      </div>
      
      <div class="mb-4 space-y-1">
        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ labels.time }}</label>
        <div class="flex items-center gap-2">
          <input 
            type="month"
            :value="getStartDate(index)"
            @input="e => setStartDate(index, (e.target as HTMLInputElement).value)"
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors"
            :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('time') }"
          />
          <span class="text-gray-500">-</span>
          <div class="relative flex-1">
            <input 
              type="month"
              :value="getEndDate(index)"
              @input="e => setEndDate(index, (e.target as HTMLInputElement).value)"
              :disabled="getIsPresent(index)"
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('time') }"
            />
          </div>
          <div class="flex items-center gap-2 min-w-fit">
            <input 
              type="checkbox" 
              :checked="getIsPresent(index)"
              @change="e => setIsPresent(index, (e.target as HTMLInputElement).checked)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :id="'present-edu-' + index"
            />
            <label :for="'present-edu-' + index" class="text-sm text-gray-700 select-none">{{ labels.present }}</label>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">{{ labels.details }}</label>
        <div v-for="(detail, dIndex) in edu.details" :key="dIndex" class="flex gap-2 items-start group/detail">
           <div class="flex-1 space-y-2">
             <input 
               v-model="edu.details[dIndex]" 
               class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors" 
               placeholder="Detail" 
             />
           </div>
           <button 
             @click="removeDetail(index, dIndex)" 
             class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 mt-2 opacity-0 group-hover/detail:opacity-100 transition-all"
             title="Remove Detail"
           >
             <X class="w-4 h-4" />
           </button>
        </div>
        <button 
          @click="addDetail(index)" 
          class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-2 px-2 py-1 rounded hover:bg-blue-50 transition-colors w-fit"
        >
          <Plus class="w-4 h-4" /> {{ labels.addDetail }}
        </button>
      </div>
    </div>
    
    <button 
      @click="addEducation" 
      class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
    >
      <Plus class="w-5 h-5" /> {{ labels.addEducation }}
    </button>
  </div>
</template>
