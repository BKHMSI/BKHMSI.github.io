<script setup lang="ts">
defineProps<{ title: string; icon?: string }>()
</script>

<template>
  <div class="mb-8">
    <h2 class="text-2xl md:text-3xl font-serif font-bold tracking-tight text-ink-900 dark:text-dark-text">
      <span v-if="icon" class="mr-2">{{ icon }}</span>
      {{ title }}
    </h2>
    <div class="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-accent-400"></div>
  </div>
</template>
