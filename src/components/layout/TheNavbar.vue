<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'

defineProps<{ activeSection: string }>()

const mobileOpen = ref(false)
const cvOpen = ref(false)

function closeCvDelayed() {
  globalThis.setTimeout(() => { cvOpen.value = false }, 150)
}

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'publications', label: 'Publications' },
  { id: 'talks', label: 'Talks' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'awards', label: 'Awards' },
  { id: 'people', label: 'People' },
  { id: 'service', label: 'Service' },
]
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-4 py-3">
    <div class="max-w-6xl mx-auto">
      <div class="glass rounded-full px-5 py-2 flex items-center justify-between">
        <!-- Brand -->
        <a href="#hero" class="flex items-center gap-2 shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30"></span>
          <span class="font-serif font-bold text-lg text-ink-900 dark:text-dark-text">Badr AlKhamissi</span>
        </a>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-0.5">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="'#' + link.id"
            class="px-2.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            :class="activeSection === link.id
              ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300'
              : 'text-ink-600 dark:text-dark-muted hover:bg-ink-100 dark:hover:bg-dark-border/50 hover:text-ink-900 dark:hover:text-dark-text'"
          >
            {{ link.label }}
          </a>

          <!-- Vertical divider -->
          <div class="w-px h-6 bg-ink-300 dark:bg-dark-border"></div>

          <!-- Blog external link -->
          <a
            href="https://bkhmsi.github.io/blog/"
            target="_blank"
            class="px-3 py-1.5 rounded-full text-sm font-medium text-ink-600 dark:text-dark-muted hover:bg-ink-100 dark:hover:bg-dark-border/50 hover:text-ink-900 dark:hover:text-dark-text transition-all duration-200 flex items-center gap-1"
          >
            Blog
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>

          <a
            href="/CV.pdf"
            target="_blank"
            class="px-3 py-1.5 rounded-full text-sm font-medium text-ink-600 dark:text-dark-muted hover:bg-ink-100 dark:hover:bg-dark-border/50 hover:text-ink-900 dark:hover:text-dark-text transition-all duration-200 flex items-center gap-1"
          >
            CV
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>

          <ThemeToggle />
        </div>

        <!-- Mobile hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-dark-border/50 transition-colors"
        >
          <svg v-if="!mobileOpen" class="w-5 h-5 text-ink-700 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          <svg v-else class="w-5 h-5 text-ink-700 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <Transition name="slide">
        <div v-if="mobileOpen" class="md:hidden mt-2 glass rounded-2xl p-4 space-y-1">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="'#' + link.id"
            @click="mobileOpen = false"
            class="block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            :class="activeSection === link.id
              ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300'
              : 'text-ink-600 dark:text-dark-muted hover:bg-ink-100 dark:hover:bg-dark-border/50'"
          >
            {{ link.label }}
          </a>
          <a href="https://bkhmsi.github.io/blog/" target="_blank" class="block px-4 py-2.5 rounded-xl text-sm font-medium text-ink-600 dark:text-dark-muted hover:bg-ink-100 dark:hover:bg-dark-border/50 transition-all duration-200">Blog</a>
          <a href="/CV.pdf" target="_blank" class="block px-4 py-2.5 rounded-xl text-sm font-medium text-ink-600 dark:text-dark-muted hover:bg-ink-100 dark:hover:bg-dark-border/50 transition-all duration-200">CV</a>
          <div class="flex items-center justify-between px-4 pt-2">
            <SocialLinks size="sm" />
            <ThemeToggle />
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
