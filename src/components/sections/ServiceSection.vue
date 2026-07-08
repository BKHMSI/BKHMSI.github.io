<script setup lang="ts">
import type { ReviewData } from '@/types'
import reviewData from '@/data/review.json'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'
import RoleBadges from '@/components/ui/RoleBadges.vue'

const review = reviewData as ReviewData
</script>

<template>
  <section id="service">
    <SectionHeading title="Academic Service" />

    <div class="card-surface p-6 md:p-8 space-y-8">
      <!-- Organizing -->
      <ScrollReveal>
        <h3 class="text-lg font-serif font-semibold text-ink-800 dark:text-dark-text mb-3">
          Organizing
        </h3>
        <ul class="space-y-2 text-sm text-ink-700 dark:text-dark-text leading-relaxed">
          <li class="flex items-start gap-2">
            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>
              <strong>Co-Organizer:</strong>
              <a href="https://representational-alignment.github.io/2026/" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> Re-Align Workshop</a>
              co-located with
              <a href="https://iclr.cc" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> ICLR 2026</a>
            </span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>
              <strong>Publicity Chair:</strong>
              <a href="https://arabicnlp2025.sigarab.org" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> ArabicNLP 2025</a>
              co-located with
              <a href="https://2025.aclweb.org" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> ACL 2025</a>
            </span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>
              <strong>Social Chair:</strong>
              <a href="https://arabicnlp2024.sigarab.org" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> ArabicNLP 2024</a>
              co-located with
              <a href="https://2024.aclweb.org" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> ACL 2024</a>
            </span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>
              <strong>Co-Organizer:</strong>
              <a href="https://llm-cognition.github.io" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> LLMs and Cognition Workshop</a>
              co-located with
              <a href="https://icml.cc/Conferences/2024" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline"> ICML 2024</a>
            </span>
          </li>
        </ul>
      </ScrollReveal>

      <!-- Journals -->
      <ScrollReveal :delay="100">
        <h3 class="text-lg font-serif font-semibold text-ink-800 dark:text-dark-text mb-3">
          Journals
        </h3>
        <ul class="space-y-2 text-sm text-ink-700 dark:text-dark-text leading-relaxed">
          <li v-for="journal in review.journals" :key="journal.name" class="flex items-start gap-2">
            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>
              <a :href="journal.link" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">
                {{ journal.name }}
              </a>
              <RoleBadges :role="journal.role" />
            </span>
          </li>
        </ul>
      </ScrollReveal>

      <!-- Conferences -->
      <ScrollReveal :delay="200">
        <h3 class="text-lg font-serif font-semibold text-ink-800 dark:text-dark-text mb-3">
          Conferences
        </h3>
        <ul class="space-y-2 text-sm text-ink-700 dark:text-dark-text leading-relaxed">
          <li v-for="conf in review.conferences" :key="conf.name" class="flex items-start gap-2">
            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>
              <a :href="conf.link" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">
                {{ conf.name }}
              </a>
              <RoleBadges :role="conf.role" />
            </span>
          </li>
        </ul>
      </ScrollReveal>

      <!-- Workshops -->
      <ScrollReveal :delay="300">
        <h3 class="text-lg font-serif font-semibold text-ink-800 dark:text-dark-text mb-3">
          Workshops
        </h3>
        <ul class="space-y-2 text-sm text-ink-700 dark:text-dark-text leading-relaxed">
          <li v-for="ws in review.workshops" :key="ws.name + ws.conference" class="flex items-start gap-2">
            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>
              <a :href="ws.link" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">
                {{ ws.name }}
              </a>
              <span class="text-ink-500 dark:text-dark-muted"> @ {{ ws.conference }}</span>
              <RoleBadges :role="ws.role" />
            </span>
          </li>
        </ul>
      </ScrollReveal>
    </div>
  </section>
</template>
