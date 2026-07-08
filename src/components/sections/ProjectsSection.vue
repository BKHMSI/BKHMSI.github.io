<script setup lang="ts">
import projects from '@/data/projects.json'
import type { Project } from '@/types'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'

const typedProjects = projects as Project[]
</script>

<template>
  <section id="projects" class="py-16">
    <SectionHeading title="Projects" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ScrollReveal
        v-for="(project, index) in typedProjects"
        :key="index"
        :delay="index * 80"
      >
        <div class="card-surface p-6 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300 h-full flex flex-col">
          <!-- Project Name -->
          <h3 class="text-lg font-semibold text-ink-900 dark:text-dark-text">
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-brand-500 transition-colors duration-200"
            >
              {{ project.name }}
            </a>
            <span v-else>{{ project.name }}</span>
          </h3>

          <!-- Description -->
          <p
            class="mt-2 text-sm text-ink-600 dark:text-dark-muted leading-relaxed flex-1"
            v-html="project.desc"
          />

          <!-- Collaborators -->
          <p
            v-if="project.collaborators && project.collaborators.length"
            class="mt-3 text-xs text-ink-500 dark:text-dark-muted/70"
          >
            with: {{ project.collaborators.join(' ') }}
          </p>

          <!-- Resource Links -->
          <div class="flex flex-wrap gap-3 mt-3 pt-3 border-t border-ink-100 dark:border-dark-border">
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-xs text-ink-500 dark:text-dark-muted hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website
            </a>
            <a
              v-if="project.code"
              :href="project.code"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-xs text-ink-500 dark:text-dark-muted hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code
            </a>
            <a
              v-if="project.blog"
              :href="project.blog"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-xs text-ink-500 dark:text-dark-muted hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Blog
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
