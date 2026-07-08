<script setup lang="ts">
withDefaults(defineProps<{ modelValue: string; placeholder?: string }>(), { placeholder: 'Search...' })
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="relative">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2.5 rounded-full border border-ink-200 dark:border-dark-border bg-white dark:bg-dark-surface text-ink-900 dark:text-dark-text placeholder-ink-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-sm"
    />
  </div>
</template>
