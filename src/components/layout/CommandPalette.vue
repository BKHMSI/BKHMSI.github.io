<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useCommandPalette } from '@/composables/useCommandPalette'

const { isOpen, query, selectedIndex, filteredResults, close, selectResult } = useCommandPalette()

const inputRef = ref<HTMLInputElement | null>(null)

watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

function iconForType(type: string) {
  return type
}

function handleBackdropClick() {
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="palette">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh]"
        @click.self="handleBackdropClick"
      >
        <div
          class="max-w-lg w-full mx-4 bg-white/90 dark:bg-dark-surface/95 backdrop-blur-xl border border-ink-200/60 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden"
          @click.stop
        >
          <!-- Search Input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-ink-200/50 dark:border-dark-border">
            <svg class="w-5 h-5 text-ink-400 dark:text-dark-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search publications, talks, projects..."
              class="flex-1 bg-transparent text-sm text-ink-900 dark:text-dark-text placeholder-ink-400 dark:placeholder-dark-muted outline-none"
            />
            <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-ink-400 dark:text-dark-muted bg-ink-100 dark:bg-dark-border/50 rounded border border-ink-200 dark:border-dark-border">
              ESC
            </kbd>
          </div>

          <!-- Results List -->
          <div v-if="filteredResults.length" class="max-h-72 overflow-y-auto scrollbar-thin py-2">
            <button
              v-for="(result, i) in filteredResults"
              :key="result.title + result.subtitle"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100"
              :class="i === selectedIndex
                ? 'bg-brand-50 dark:bg-brand-900/20'
                : 'hover:bg-ink-50 dark:hover:bg-dark-border/30'"
              @click="selectResult(result)"
              @mouseenter="selectedIndex = i"
            >
              <!-- Type Icon -->
              <span class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-ink-100 dark:bg-dark-border/50">
                <!-- Publication icon (book) -->
                <svg v-if="iconForType(result.type) === 'publication'" class="w-4 h-4 text-ink-500 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <!-- Talk icon (microphone) -->
                <svg v-else-if="iconForType(result.type) === 'talk'" class="w-4 h-4 text-ink-500 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <!-- Project icon (code/folder) -->
                <svg v-else class="w-4 h-4 text-ink-500 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </span>

              <!-- Result Content -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-ink-900 dark:text-dark-text truncate">
                  {{ result.title }}
                </p>
                <p class="text-xs text-ink-500 dark:text-dark-muted truncate">
                  {{ result.subtitle }}
                </p>
              </div>
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="query.trim()" class="px-4 py-8 text-center">
            <p class="text-sm text-ink-400 dark:text-dark-muted">No results found</p>
          </div>

          <!-- Keyboard Hints -->
          <div class="px-4 py-2.5 border-t border-ink-200/50 dark:border-dark-border flex items-center gap-4 text-[11px] text-ink-400 dark:text-dark-muted">
            <span class="flex items-center gap-1">
              <kbd class="px-1 py-0.5 rounded bg-ink-100 dark:bg-dark-border/50 border border-ink-200 dark:border-dark-border font-mono">&uarr;&darr;</kbd>
              Navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1 py-0.5 rounded bg-ink-100 dark:bg-dark-border/50 border border-ink-200 dark:border-dark-border font-mono">Enter</kbd>
              Select
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1 py-0.5 rounded bg-ink-100 dark:bg-dark-border/50 border border-ink-200 dark:border-dark-border font-mono">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.2s ease;
}
.palette-enter-active > div,
.palette-leave-active > div {
  transition: all 0.2s ease;
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}
.palette-enter-from > div {
  transform: scale(0.95);
  opacity: 0;
}
.palette-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
