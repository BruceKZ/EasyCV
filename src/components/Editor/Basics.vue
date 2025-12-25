<script setup lang="ts">
import { useResumeStore } from '../../stores/resume'

const store = useResumeStore()
</script>

<template>
  <a-form layout="vertical">
    <a-row :gutter="16">
      <a-col :span="24" :md="12">
        <a-form-item :label="$t('editor.basics.name')" :validate-status="store.missingKeys.has('name') ? 'error' : ''">
          <a-input v-model:value="store.resumeData.basics.name" placeholder="Your Name" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12">
        <a-form-item :label="$t('editor.basics.email')" :validate-status="store.missingKeys.has('email') ? 'error' : ''">
          <a-input v-model:value="store.resumeData.basics.email" placeholder="example@email.com" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12">
        <a-form-item :label="$t('editor.basics.phone')" :validate-status="store.missingKeys.has('phone') ? 'error' : ''">
          <a-input v-model:value="store.resumeData.basics.phone" placeholder="+86 123 4567 8901" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12">
        <a-form-item :label="$t('editor.basics.website')" :validate-status="store.missingKeys.has('website') ? 'error' : ''">
          <a-input v-model:value="store.resumeData.basics.website" placeholder="example.com" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12">
        <a-form-item :label="$t('editor.basics.github')" :validate-status="store.missingKeys.has('github') ? 'error' : ''">
          <a-input v-model:value="store.resumeData.basics.github" placeholder="username" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
