<script setup lang="ts">
import { ref } from 'vue';
import Home from './pages/Home.vue';
import Settings from './pages/Settings.vue';
import VHeader from './components/VHeader.vue';
import VFooter from './components/VFooter.vue';

const page = ref<'home' | 'settings'>('home');
</script>

<template>
  <div class="app">
    <VHeader />
    <main :key="page"><Home v-if="page === 'home'" /><Settings v-else /></main>
    <VFooter v-model:page="page" />
  </div>
</template>
