<script setup lang="ts">
import type { PeopleCategory, Person } from '@/types'
import mentorsData from '@/data/mentors.json'
import collaboratorsData from '@/data/collaborators.json'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'
import PersonChip from '@/components/ui/PersonChip.vue'

const mentors = mentorsData as PeopleCategory[]
const collaborators = (collaboratorsData as { category: string; people: Person[] }).people
</script>

<template>
  <section id="people">
    <SectionHeading title="People" />

    <div class="card-surface p-6 md:p-8 space-y-8">
      <!-- Mentors & Mentees -->
      <ScrollReveal v-for="group in mentors" :key="group.category">
        <h3 class="text-lg font-serif font-semibold text-ink-800 dark:text-dark-text mb-3">
          {{ group.category }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <PersonChip
            v-for="person in group.people"
            :key="person.name"
            :name="person.name"
            :inst="person.inst"
            :link="person.link"
          />
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
