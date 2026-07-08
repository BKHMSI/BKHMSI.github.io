<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useActiveSection } from '@/composables/useScrollAnimation'
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import CommandPalette from '@/components/layout/CommandPalette.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import PublicationsSection from '@/components/sections/PublicationsSection.vue'
import TalksSection from '@/components/sections/TalksSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import TimelineSection from '@/components/sections/TimelineSection.vue'
import AwardsSection from '@/components/sections/AwardsSection.vue'
import PeopleSection from '@/components/sections/PeopleSection.vue'
import ServiceSection from '@/components/sections/ServiceSection.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'

const { initTheme } = useTheme()
const { activeSection } = useActiveSection(['hero', 'publications', 'talks', 'projects', 'experience', 'awards', 'people', 'service'])

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="bg-mesh min-h-screen">
    <TheNavbar :activeSection="activeSection" />
    <CommandPalette />

    <main class="max-w-6xl mx-auto px-4 pt-24 space-y-16 pb-28">
      <HeroSection />
      <PublicationsSection />
      <TalksSection />
      <ProjectsSection />
      <TimelineSection />
      <AwardsSection />
      <PeopleSection />
      <ServiceSection />
    </main>

    <TheFooter />

    <!-- Floating social footer -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div class="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border border-ink-200/60 dark:border-dark-border/60 shadow-lg">
        <SocialLinks size="sm" />
      </div>
    </div>
  </div>
</template>
