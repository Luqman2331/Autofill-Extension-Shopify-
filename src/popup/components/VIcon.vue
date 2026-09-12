<script setup lang="ts">
defineProps<{ name: keyof typeof paths }>();

const paths = {
  bolt: 'm13 2-8 12h6l-1 8 9-12h-6l1-8Z',
  user: 'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  settings: 'M4 7h16M4 17h16M9 4v6M15 14v6',
  plus: 'M12 5v14M5 12h14',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  chevron: 'm6 9 6 6 6-6',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  card: 'M3 4h18v16H3V4ZM3 9h18M7 15h3',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
} as const;
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name]" />
  </svg>
</template>
