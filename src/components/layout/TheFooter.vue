<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-ink-200 dark:border-dark-border">
    <div class="max-w-6xl mx-auto py-8 px-4 text-center">
      <p class="text-sm text-ink-500 dark:text-dark-muted">
        Badr AlKhamissi
        <span class="mx-2 text-ink-300 dark:text-dark-border">&middot;</span>
        {{ currentYear }}
      </p>
      <p class="mt-1 text-xs text-ink-400 dark:text-dark-muted/60">
        Built with Vue.js &amp; Tailwind CSS
      </p>
    </div>
  </footer>
</template>
