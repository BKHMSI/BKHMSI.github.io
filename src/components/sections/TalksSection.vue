<script setup lang="ts">
import talks from '@/data/talks.json'
import type { Talk } from '@/types'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'

const typedTalks = talks as Talk[]

function badgeList(badges: string): string[] {
  if (!badges) return []
  return badges.split(',').map(b => b.trim()).filter(Boolean)
}
</script>

<template>
  <section id="talks" class="py-16">
    <SectionHeading title="Invited Talks" />

    <div class="flex flex-col gap-4">
      <ScrollReveal
        v-for="(talk, index) in typedTalks"
        :key="index"
        :delay="index * 60"
      >
        <div class="card-surface p-4 hover:-translate-y-0.5 transition-all duration-300">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Date -->
            <div class="min-w-[160px] shrink-0">
              <span class="text-sm font-medium text-brand-500">{{ talk.date }}</span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Institution -->
              <div class="font-semibold text-ink-900 dark:text-dark-text">
                <a
                  v-if="talk.link"
                  :href="talk.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-brand-500 transition-colors duration-200"
                >
                  {{ talk.inst }}
                </a>
                <span v-else>{{ talk.inst }}</span>
              </div>

              <!-- Title -->
              <p class="text-sm text-ink-600 dark:text-dark-muted mt-0.5">
                {{ talk.title }}
              </p>

              <!-- Role -->
              <p v-if="talk.role" class="text-xs text-ink-500 dark:text-dark-muted/70 mt-0.5">
                {{ talk.role }}
              </p>

              <!-- Badges -->
              <div v-if="badgeList(talk.badges).length" class="flex flex-wrap gap-2 mt-2">
                <a
                  v-if="badgeList(talk.badges).includes('slides')"
                  :href="talk.slides"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors duration-200"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Slides
                </a>
                <a
                  v-if="badgeList(talk.badges).includes('video')"
                  :href="talk.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-500/20 transition-colors duration-200"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Video
                </a>
                <a
                  v-if="badgeList(talk.badges).includes('podcast')"
                  :href="talk.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors duration-200"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Podcast
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
