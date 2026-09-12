<script setup lang="ts">
import VIcon from './VIcon.vue';
import { useStorage } from '../useStorage';
import { useLocale } from '../useLocale';

const { settings } = useStorage();
const { t } = useLocale();
</script>

<template>
  <header class="app-header">
    <div class="brand" aria-label="SSS Autofill">
      <span class="brand-mark"><VIcon name="bolt" /></span>
      <span class="wordmark">sss<span>autofill</span></span>
    </div>
    <button type="button" class="status-button" :class="{ enabled: settings.enabled }"
      :aria-pressed="settings.enabled" :aria-label="t('turnOnAutofill')"
      :title="settings.enabled ? t('pauseAutofill') : t('turnOnAutofill')"
      @click="settings.enabled = !settings.enabled">
      <span class="status-dot" />{{ settings.enabled ? t('autofillOn') : t('paused') }}
    </button>
  </header>
</template>
