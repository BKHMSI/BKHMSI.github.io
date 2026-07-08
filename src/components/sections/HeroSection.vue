<script setup lang="ts">
import { ref, computed } from 'vue'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'
import { newsItems } from '@/data/news.ts'
import profileImg from '@/assets/images/badr.jpeg'

const showAllNews = ref(false)
const visibleNews = newsItems 
</script>

<template>
  <section id="hero" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Profile Card -->
    <ScrollReveal class="lg:col-span-3">
      <div class="card-surface p-6 md:p-8">
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <img
            :src="profileImg"
            alt="Badr AlKhamissi"
            class="w-[180px] h-[180px] rounded-2xl object-cover shrink-0"
          />
          <div class="flex-1 min-w-0">
            <h1 class="text-3xl md:text-4xl font-serif font-bold tracking-tight">
              <span class="gradient-text">Badr AlKhamissi</span>
              <span class="text-lg md:text-xl text-ink-400 dark:text-dark-muted ml-2 font-normal">
                (&#x628;&#x62F;&#x631; &#x627;&#x644;&#x62E;&#x645;&#x64A;&#x633;&#x64A;)
              </span>
            </h1>

            <ul class="mt-5 space-y-2.5 text-[15px] text-ink-700 dark:text-dark-text leading-relaxed">
              <li class="bio-item">
                <strong>PhD candidate</strong> at
                <a href="https://www.epfl.ch/en/" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">EPFL</a>, co-advised by
                <a href="https://atcbosselut.github.io" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Antoine Bosselut</a> and
                <a href="https://mschrimpf.com" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Martin Schrimpf</a>
              </li>
              <li class="bio-item">
                <strong>Interested in</strong> the intersection of machine learning, neuroscience, and cognitive science
              </li>
              <li class="bio-item">
                <strong>Previously: AI Resident</strong> at
                <a href="https://ai.facebook.com/join-us/residency-program/" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Meta AI</a>
                (Seattle), with
                <a href="https://en.wikipedia.org/wiki/Mona_Diab" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Mona Diab</a> and
                <a href="http://asli.us" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Asli Celikyilmaz</a>
              </li>
              <li class="bio-item">
                <strong>Previously: Research Intern</strong> at
                <a href="https://ai.sony" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Sony AI</a>, with
                <a href="https://ai.sony/people/Michael-Spranger/" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Michael Spranger</a>
              </li>
              <li class="bio-item">
                <strong>MSc</strong> in
                <a href="https://www.gold.ac.uk/pg/msc-computational-cognitive-neuroscience/" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">Computational Cognitive Neuroscience</a>
                (distinction), Goldsmiths, University of London
              </li>
              <li class="bio-item">
                <strong>BSc</strong> in Computer Science (Summa Cum Laude),
                <a href="http://www.aucegypt.edu" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline">American University in Cairo</a>
              </li>
            </ul>

            <div class="mt-5">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>

    <!-- News Sidebar -->
    <ScrollReveal :delay="150" class="lg:col-span-3">
      <div class="card-surface p-6 md:p-8">
        <h2 class="text-xl font-serif font-bold text-ink-900 dark:text-dark-text flex items-center gap-2 mb-5">
          <!-- Bullhorn / megaphone icon -->
          <svg class="w-5 h-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          News
          <button
            @click="showAllNews = !showAllNews"
            class="ml-auto p-1.5 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-dark-surface dark:hover:text-brand-400 transition-colors"
            :title="showAllNews ? 'Collapse' : 'Expand'"
          >
            <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': showAllNews }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </h2>

        <div class="overflow-y-auto scrollbar-thin pr-1 transition-all duration-300" :class="showAllNews ? 'max-h-[600px]' : 'max-h-[250px]'">
          <ul class="space-y-4">
            <li
              v-for="(item, index) in visibleNews"
              :key="index"
              class="flex gap-3 text-sm leading-relaxed"
            >
              <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              <div>
                <span class="inline-block font-semibold text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700 rounded-full px-2 py-0.5 mr-1">{{ item.date }}</span>
                <span class="text-ink-600 dark:text-dark-muted ml-1" v-html="item.html"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ScrollReveal>
  </section>
</template>

<style scoped>
.bio-item {
  position: relative;
  padding-left: 1rem;
}

.bio-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--brand-dot, #0b7f8f);
}

:deep(a) {
  @apply text-brand-600 dark:text-brand-400 hover:underline;
}
</style>
