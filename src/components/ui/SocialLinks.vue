<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })

const links = [
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?user=0l9UHtQAAAAJ&hl=en',
    icon: 'scholar',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/BKHMSI',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/bkhmsi',
    icon: 'linkedin',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/bkhmsi',
    icon: 'twitter',
  },
  {
    name: 'Email',
    url: 'mailto:badr@khamissi.com',
    icon: 'email',
  },
]
</script>

<template>
  <div class="flex items-center gap-2">
    <a
      v-for="link in links"
      :key="link.name"
      :href="link.url"
      :target="link.icon !== 'email' ? '_blank' : undefined"
      rel="noopener noreferrer"
      :aria-label="link.name"
      class="inline-flex items-center justify-center rounded-lg text-ink-500 dark:text-dark-muted hover:text-brand-600 dark:hover:text-brand-400 hover:bg-ink-100 dark:hover:bg-dark-surface hover:scale-110 transition-all duration-200"
      :class="size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'"
    >
      <!-- Google Scholar -->
      <svg v-if="link.icon === 'scholar'" :class="size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
      </svg>
      <!-- GitHub -->
      <svg v-else-if="link.icon === 'github'" :class="size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
      <!-- LinkedIn -->
      <svg v-else-if="link.icon === 'linkedin'" :class="size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <!-- Twitter / X -->
      <svg v-else-if="link.icon === 'twitter'" :class="size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      <!-- Email -->
      <svg v-else-if="link.icon === 'email'" :class="size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    </a>
  </div>
</template>
