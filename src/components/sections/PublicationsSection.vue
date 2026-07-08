<script setup lang="ts">
import { usePublicationFilter } from '@/composables/usePublicationFilter'
import FilterPills from '@/components/ui/FilterPills.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'

const {
  typeFilter,
  authorshipFilter,
  searchQuery,
  filteredPublications,
  setTypeFilter,
  setAuthorshipFilter,
  setSearch,
} = usePublicationFilter()

const badgeConfig: Record<string, { label: string; classes: string }> = {
  preprint:   { label: 'Preprint',    classes: 'bg-ink-100 dark:bg-white/10 text-ink-500 dark:text-dark-muted' },
  submission: { label: 'Under Review',classes: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  oral:       { label: 'Oral',        classes: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  award:      { label: 'Award',       classes: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  poster:     { label: 'Poster',      classes: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' },
  spotlight:  { label: 'Spotlight',   classes: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' },
  sota:       { label: 'SoTA',        classes: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' },
}

function parseBadges(badges: string): string[] {
  if (!badges) return []
  return badges.split(',').map((b) => b.trim()).filter(Boolean)
}

const typeFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Selected', value: 'selected' },
  { label: 'Preprints', value: 'preprints' },
  { label: 'Conferences', value: 'conferences' },
  { label: 'Workshops', value: 'workshops' },
]

const authorshipFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'First Author', value: 'first-author' },
  { label: 'Co-Author', value: 'co-author' },
  { label: 'Senior Author', value: 'senior-author' },
]

const typePillLabels = typeFilterOptions.map((o) => o.label)
const authorshipPillLabels = authorshipFilterOptions.map((o) => o.label)

function makeLabelToValue(options: { label: string; value: string }[]) {
  return (label: string) =>
    options.find((o) => o.label === label)?.value ?? label.toLowerCase()
}

function makeValueToLabel(options: { label: string; value: string }[]) {
  return (value: string) => options.find((o) => o.value === value)?.label ?? value
}

const typeLabelToValue = makeLabelToValue(typeFilterOptions)
const typeValueToLabel = makeValueToLabel(typeFilterOptions)
const authorshipLabelToValue = makeLabelToValue(authorshipFilterOptions)
const authorshipValueToLabel = makeValueToLabel(authorshipFilterOptions)
</script>

<template>
  <section id="publications">
    <SectionHeading title="Publications" />

    <div class="flex flex-col md:flex-row md:items-start gap-4 mb-8">
      <div class="flex-1 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <span
            class="w-16 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-dark-muted"
          >
            Type
          </span>
          <FilterPills
            :options="typePillLabels"
            :model-value="typeValueToLabel(typeFilter)"
            @update:model-value="setTypeFilter(typeLabelToValue($event))"
          />
        </div>
        <div class="flex items-center gap-3">
          <span
            class="w-16 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-dark-muted"
          >
            Author
          </span>
          <FilterPills
            :options="authorshipPillLabels"
            :model-value="authorshipValueToLabel(authorshipFilter)"
            @update:model-value="setAuthorshipFilter(authorshipLabelToValue($event))"
          />
        </div>
      </div>
      <SearchInput
        :model-value="searchQuery"
        @update:model-value="setSearch($event)"
        placeholder="Search publications..."
        class="md:w-72"
      />
    </div>

    <div class="space-y-5">
      <ScrollReveal
        v-for="(pub, index) in filteredPublications"
        :key="`${pub.title}-${pub.year}-${pub.type.join(',')}`"
        :delay="Math.min(index * 50, 300)"
      >
        <div
          class="card-surface p-5 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300 border-l-2 border-brand-500 relative"
        >
          <!-- Year badge -->
          <span
            class="absolute top-4 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
          >
            {{ pub.year }}
          </span>

          <!-- Title -->
          <h3 class="text-base font-semibold pr-16 leading-snug">
            <a
              v-if="pub.link"
              :href="pub.link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-700 dark:text-brand-400 hover:underline"
            >
              {{ pub.title }}
            </a>
            <span v-else class="text-ink-900 dark:text-dark-text">
              {{ pub.title }}
            </span>
          </h3>

          <!-- Authors -->
          <p class="mt-1.5 text-sm text-ink-600 dark:text-dark-muted leading-relaxed">
            <span
              v-for="(author, i) in pub.authors"
              :key="i"
              v-html="author + (i < pub.authors.length - 1 ? ' ' : '')"
              class="inline"
            />
          </p>

          <!-- Badges -->
          <div v-if="parseBadges(pub.badges).length" class="mt-2 flex flex-wrap gap-1.5">
            <span
              v-for="badge in parseBadges(pub.badges)"
              :key="badge"
              class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
              :class="badgeConfig[badge]?.classes ?? 'bg-ink-100 dark:bg-white/10 text-ink-500 dark:text-dark-muted'"
            >
              {{ badgeConfig[badge]?.label ?? badge }}
            </span>
          </div>

          <!-- Resource links -->
          <div class="mt-3 flex flex-wrap gap-3 text-xs">
            <a
              v-if="pub.link"
              :href="pub.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Paper
            </a>
            <a
              v-if="pub.presentation"
              :href="pub.presentation"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Presentation
            </a>
            <a
              v-if="pub.website"
              :href="pub.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Website
            </a>
            <a
              v-if="pub.poster"
              :href="pub.poster"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
              Poster
            </a>
            <a
              v-if="pub.twitter"
              :href="pub.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Tweets
            </a>
            <a
              v-if="pub.github"
              :href="pub.github"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Code
            </a>
          </div>

          <!-- Abstract -->
          <details v-if="pub.abstract" class="mt-3 group">
            <summary
              class="text-xs font-medium text-ink-500 dark:text-dark-muted cursor-pointer select-none hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Abstract
            </summary>
            <p class="mt-2 text-sm text-ink-600 dark:text-dark-muted leading-relaxed">
              {{ pub.abstract }}
            </p>
          </details>

          <!-- Venue -->
          <p
            v-if="pub.venue"
            class="mt-3 text-sm text-ink-500 dark:text-dark-muted"
            v-html="pub.venue"
          ></p>

          <!-- Location -->
          <p
            v-if="pub.location"
            class="mt-1 text-xs text-ink-400 dark:text-dark-muted inline-flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {{ pub.location }}
          </p>
        </div>
      </ScrollReveal>

      <!-- Empty state -->
      <div
        v-if="filteredPublications.length === 0"
        class="text-center py-12 text-ink-400 dark:text-dark-muted"
      >
        <p class="text-lg">No publications found.</p>
        <p class="text-sm mt-1">Try adjusting your search or filter.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(a) {
  @apply text-brand-600 dark:text-brand-400 hover:underline;
}

details[open] summary {
  @apply text-brand-600 dark:text-brand-400;
}
</style>
