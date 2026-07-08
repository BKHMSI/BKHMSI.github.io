<script setup lang="ts">
defineProps<{ options: string[]; modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="opt in options"
      :key="opt"
      @click="$emit('update:modelValue', opt)"
      class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
      :class="modelValue === opt
        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
        : 'bg-ink-100 dark:bg-dark-surface text-ink-600 dark:text-dark-muted hover:bg-ink-200 dark:hover:bg-dark-border'"
    >
      {{ opt }}
    </button>
  </div>
</template>
