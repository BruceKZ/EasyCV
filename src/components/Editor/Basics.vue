<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'

const store = useResumeStore()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">{{ $t('editor.basics.name') }}</label>
      <input 
        v-model="store.resumeData.basics.name" 
        type="text" 
        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors"
        :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('name') }"
        placeholder="Your Name"
      />
    </div>
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">{{ $t('editor.basics.email') }}</label>
      <input 
        v-model="store.resumeData.basics.email" 
        type="email" 
        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors"
        :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('email') }"
        placeholder="example@email.com"
      />
    </div>
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">{{ $t('editor.basics.phone') }}</label>
      <input 
        v-model="store.resumeData.basics.phone" 
        type="text" 
        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors"
        :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('phone') }"
        placeholder="+86 123 4567 8901"
      />
    </div>
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">{{ $t('editor.basics.website') }}</label>
      <input 
        v-model="store.resumeData.basics.website" 
        type="text" 
        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors"
        :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('website') }"
        placeholder="example.com"
      />
    </div>
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">{{ $t('editor.basics.github') }}</label>
      <input 
        v-model="store.resumeData.basics.github" 
        type="text" 
        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border transition-colors"
        :class="{ '!border-red-500 !ring-red-500': store.missingKeys.has('github') }"
        placeholder="username"
      />
    </div>
  </div>
</template>
