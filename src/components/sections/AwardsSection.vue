<script setup lang="ts">
import awards from '@/data/awards.json'
import type { AwardCategory } from '@/types'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'

const typedAwards = awards as AwardCategory[]
</script>

<template>
  <section id="awards" class="py-16">
    <SectionHeading title="Awards & Honors" />

    <div class="flex flex-col gap-4">
      <ScrollReveal
        v-for="(category, index) in typedAwards"
        :key="index"
        :delay="index * 80"
      >
        <details
          class="group rounded-xl bg-ink-50/50 dark:bg-dark-surface border border-ink-100 dark:border-dark-border overflow-hidden"
          :open="index < 3 || undefined"
        >
          <summary
            class="flex items-center justify-between cursor-pointer px-5 py-4 select-none hover:bg-ink-100/50 dark:hover:bg-dark-border/30 transition-colors duration-200"
          >
            <div class="flex items-center gap-3">
              <svg
                class="w-4 h-4 text-ink-400 dark:text-dark-muted transition-transform duration-200 group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <h3 class="font-semibold text-ink-900 dark:text-dark-text">
                {{ category.category }}
              </h3>
            </div>
            <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400">
              {{ category.awards.length }}
            </span>
          </summary>

          <div class="px-5 pb-4">
            <ul class="space-y-2 pt-1">
              <li
                v-for="(award, aIndex) in category.awards"
                :key="aIndex"
                class="flex items-start gap-3 text-sm"
              >
                <span class="text-ink-400 dark:text-dark-muted/60 font-mono text-xs min-w-[70px] shrink-0 pt-0.5">
                  ({{ award.year }})
                </span>
                <span class="text-ink-700 dark:text-dark-muted">
                  <a
                    v-if="award.link"
                    :href="award.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200 underline decoration-ink-200 dark:decoration-dark-border underline-offset-2 hover:decoration-brand-500"
                  >
                    {{ award.name }}
                  </a>
                  <span v-else>{{ award.name }}</span>
                </span>
              </li>
            </ul>
          </div>
        </details>
      </ScrollReveal>
    </div>
  </section>
</template>
