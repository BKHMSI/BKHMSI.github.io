<script setup lang="ts">
import { ref, computed } from 'vue'
import experience from '@/data/experience.json'
import education from '@/data/education.json'
import type { Experience } from '@/types'
import FilterPills from '@/components/ui/FilterPills.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'

const filters = ['Experience', 'Education']
const activeFilter = ref('Experience')

const typedExperience = experience as Experience[]
const typedEducation = education as Experience[]

const items = computed<Experience[]>(() =>
  activeFilter.value === 'Experience' ? typedExperience : typedEducation
)

function resolveImage(imagePath: string): string {
  return imagePath.replace('../assets/', '/images/')
}
</script>

<template>
  <section id="experience" class="py-16">
    <SectionHeading title="Experience & Education" />

    <div class="mb-8">
      <FilterPills
        :options="filters"
        :model-value="activeFilter"
        @update:model-value="activeFilter = $event"
      />
    </div>

    <!-- Timeline -->
    <div class="relative">
      <!-- Vertical line -->
      <div class="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-ink-200 dark:bg-dark-border md:-translate-x-px" />

      <div class="flex flex-col gap-8">
        <ScrollReveal
          v-for="(item, index) in items"
          :key="activeFilter + '-' + index"
          :delay="index * 100"
        >
          <div
            class="relative flex items-start gap-6"
            :class="[
              'md:gap-0',
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            ]"
          >
            <!-- Dot on timeline -->
            <div
              class="absolute left-5 md:left-1/2 w-3 h-3 rounded-full bg-brand-500 border-2 border-white dark:border-dark-bg z-10 -translate-x-1/2 top-6"
            />

            <!-- Spacer for mobile left margin -->
            <div class="w-10 shrink-0 md:hidden" />

            <!-- Desktop spacer (left side) -->
            <div class="hidden md:block md:w-1/2" :class="index % 2 === 0 ? 'pr-8' : 'pl-8'" />

            <!-- Card -->
            <div
              class="flex-1 md:w-1/2"
              :class="index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'"
            >
              <div class="card-surface p-5">
                <div class="flex items-start gap-4">
                  <!-- Institution Logo -->
                  <img
                    :src="resolveImage(item.image)"
                    :alt="item.title"
                    class="w-12 h-12 rounded-lg object-cover shrink-0"
                  />

                  <div class="flex-1 min-w-0">
                    <!-- Title -->
                    <h3 class="font-bold text-ink-900 dark:text-dark-text leading-snug">
                      {{ item.title }}
                    </h3>

                    <!-- Date -->
                    <p class="text-sm text-ink-500 dark:text-dark-muted mt-0.5">
                      {{ item.date }}
                    </p>

                    <!-- Location -->
                    <p class="text-sm text-ink-500 dark:text-dark-muted mt-0.5 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ item.location }}
                    </p>

                    <!-- Points -->
                    <ul v-if="item.points.length" class="mt-3 space-y-1.5">
                      <li
                        v-for="(point, pIndex) in item.points"
                        :key="pIndex"
                        class="text-sm text-ink-600 dark:text-dark-muted flex items-start gap-2"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                        <span v-html="point" />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>
