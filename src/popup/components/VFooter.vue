<script setup lang="ts">
import VIcon from './VIcon.vue';
import { useLocale } from '../useLocale';

const page = defineModel<'home' | 'settings'>('page', { required: true });
const { t } = useLocale();
</script>

<template>
  <footer class="app-footer">
    <nav aria-label="Popup navigation">
      <button type="button" :aria-current="page === 'home' ? 'page' : undefined" @click="page = 'home'"><VIcon name="user" /><span>{{ t('profiles') }}</span></button>
      <button type="button" :aria-current="page === 'settings' ? 'page' : undefined" @click="page = 'settings'"><VIcon name="settings" /><span>{{ t('settings') }}</span></button>
    </nav>
    <span class="autosave-note">{{ t('changesSaved') }}</span>
  </footer>
</template>
