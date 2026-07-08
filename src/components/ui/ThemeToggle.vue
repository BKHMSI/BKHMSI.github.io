<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    @click="toggleTheme"
    aria-label="Toggle theme"
    class="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-ink-500 dark:text-dark-muted hover:text-brand-600 dark:hover:text-brand-400 hover:bg-ink-100 dark:hover:bg-dark-surface transition-all duration-200"
  >
    <!-- Sun icon (shown in dark mode, clicking switches to light) -->
    <svg
      v-if="isDark"
      class="w-5 h-5 transition-transform duration-500 rotate-0"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Moon icon (shown in light mode, clicking switches to dark) -->
    <svg
      v-else
      class="w-5 h-5 transition-transform duration-500 rotate-0"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>
