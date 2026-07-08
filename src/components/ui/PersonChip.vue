<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string; inst: string; link?: string }>()

const href = computed(() => {
  if (props.link) return props.link
  return `https://www.google.com/search?q=${encodeURIComponent(props.name + ' ' + props.inst)}`
})
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-ink-100 dark:bg-dark-surface text-ink-700 dark:text-dark-muted hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 border border-ink-200 dark:border-dark-border hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 no-underline"
  >
    <span class="font-medium">{{ name }}</span>
    <span class="text-ink-400 dark:text-dark-muted text-xs">({{ inst }})</span>
  </a>
</template>
