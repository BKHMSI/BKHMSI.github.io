import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Publication, Talk, Project } from '@/types'
import pubData from '@/data/publications.json'
import talksData from '@/data/talks.json'
import projectsData from '@/data/projects.json'

interface SearchResult {
  type: 'publication' | 'talk' | 'project'
  title: string
  subtitle: string
  sectionId: string
}

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = []

  for (const pub of pubData as Publication[]) {
    results.push({
      type: 'publication',
      title: pub.title,
      subtitle: `${pub.year} — ${pub.venue.replace(/<[^>]*>/g, '')}`,
      sectionId: 'publications',
    })
  }

  for (const talk of talksData as Talk[]) {
    results.push({
      type: 'talk',
      title: talk.title,
      subtitle: `${talk.date} — ${talk.inst}`,
      sectionId: 'talks',
    })
  }

  for (const proj of projectsData as Project[]) {
    results.push({
      type: 'project',
      title: proj.name,
      subtitle: proj.desc.replace(/<[^>]*>/g, '').slice(0, 80),
      sectionId: 'projects',
    })
  }

  return results
}

const allResults = buildIndex()

const filteredResults = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return allResults
    .filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q)
    )
    .slice(0, 12)
})

export function useCommandPalette() {
  function open() {
    isOpen.value = true
    query.value = ''
    selectedIndex.value = 0
  }

  function close() {
    isOpen.value = false
  }

  function selectResult(result: SearchResult) {
    close()
    const el = document.getElementById(result.sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      if (isOpen.value) close()
      else open()
    }
    if (!isOpen.value) return
    if (e.key === 'Escape') {
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredResults.value.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    } else if (e.key === 'Enter' && filteredResults.value.length > 0) {
      e.preventDefault()
      const result = filteredResults.value[selectedIndex.value]
      if (result) selectResult(result)
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    isOpen,
    query,
    selectedIndex,
    filteredResults,
    open,
    close,
    selectResult,
  }
}
