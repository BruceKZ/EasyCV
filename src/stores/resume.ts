import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Education {
  school: string
  degree: string
  time: string
  details: string[]
}

export interface WorkExperience {
  company: string
  team: string
  role: string
  time: string
  details: string[]
}

export interface Project {
  name: string
  description: string
  details: string[]
  link: string
  tech_stack: string
}

export interface Skill {
  key: string
  value: string
}

export interface ResumeData {
  basics: {
    name: string
    email: string
    website: string
    github: string
    phone: string
  }
  education: Education[]
  work: WorkExperience[]
  projects: Project[]
  other_projects: string[]
  open_source: string[]
  skills: Skill[]
  misc: string[]
  awards: string[]
}

const emptyData: ResumeData = {
  basics: {
    name: '',
    email: '',
    website: '',
    github: '',
    phone: ''
  },
  education: [],
  work: [],
  projects: [],
  other_projects: [],
  open_source: [],
  skills: [],
  misc: [],
  awards: []
}

const defaultData: ResumeData = emptyData

export const useResumeStore = defineStore('resume', () => {
  const resumeData = ref<ResumeData>(defaultData)
  const language = ref<'cn' | 'en'>('cn')

  // Load from localStorage on init
  const savedData = localStorage.getItem('resumeData')
  if (savedData) {
    try {
      resumeData.value = JSON.parse(savedData)
    } catch (e) {
      console.error('Failed to load resume data from localStorage', e)
    }
  }

  // Watch for changes and save to localStorage
  watch(resumeData, (newVal) => {
    localStorage.setItem('resumeData', JSON.stringify(newVal))
  }, { deep: true })

  const toggleLanguage = () => {
    language.value = language.value === 'cn' ? 'en' : 'cn'
  }

  const updateResumeData = (newData: ResumeData) => {
    resumeData.value = newData
  }

  const resetToEmpty = () => {
    // Update properties individually to preserve object identity and ensure reactivity
    resumeData.value.basics = JSON.parse(JSON.stringify(emptyData.basics))
    resumeData.value.education = []
    resumeData.value.work = []
    resumeData.value.projects = []
    resumeData.value.other_projects = []
    resumeData.value.open_source = []
    resumeData.value.skills = []
    resumeData.value.misc = []
    resumeData.value.awards = []
  }

  const missingKeys = ref<Set<string>>(new Set())

  const addMissingKey = (key: string) => {
    missingKeys.value.add(key)
  }

  const clearMissingKeys = () => {
    missingKeys.value.clear()
  }

  return {
    resumeData,
    language,
    toggleLanguage,
    updateResumeData,
    resetToEmpty,
    missingKeys,
    addMissingKey,
    clearMissingKeys
  }
})
