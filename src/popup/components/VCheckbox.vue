<script setup lang="ts">
defineProps<{ label: string; description: string }>();
const model = defineModel<boolean>({ required: true });
</script>

<template>
  <label class="setting-row">
    <span class="setting-copy"><span class="setting-label">{{ label }}</span><span class="setting-description">{{ description }}</span></span>
    <input v-model="model" type="checkbox" role="switch" :aria-label="label">
  </label>
</template>
