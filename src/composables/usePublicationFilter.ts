import { ref, computed } from 'vue'
import type { Publication } from '@/types'
import pubData from '@/data/publications.json'

const allPublications = pubData as Publication[]
const typeFilter = ref<string>('selected')
const authorshipFilter = ref<string>('all')
const searchQuery = ref('')

const filteredPublications = computed(() => {
  let result = allPublications

  if (typeFilter.value !== 'all') {
    const typeFilterMap: Record<string, string> = {
      selected: 'selected',
      preprints: 'preprint',
      conferences: 'conference',
      workshops: 'workshop',
    }
    const typeKey = typeFilterMap[typeFilter.value]
    if (typeKey) {
      result = result.filter((p) => p.type.includes(typeKey))
    }
  }

  if (authorshipFilter.value !== 'all') {
    const authorshipFilterMap: Record<string, string> = {
      'first-author': 'first',
      'co-author': 'co-author',
      'senior-author': 'senior',
    }
    const roleKey = authorshipFilterMap[authorshipFilter.value]
    if (roleKey) {
      result = result.filter((p) =>
        (p.authorship ?? '')
          .split(',')
          .map((a) => a.trim())
          .includes(roleKey)
      )
    }
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q) ||
        p.year === q.trim() ||
        p.authors.some((a) => a.toLowerCase().includes(q))
    )
  }

  return result
})

export function usePublicationFilter() {
  function setTypeFilter(filter: string) {
    typeFilter.value = filter
  }

  function setAuthorshipFilter(filter: string) {
    authorshipFilter.value = filter
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  return {
    typeFilter,
    authorshipFilter,
    searchQuery,
    filteredPublications,
    setTypeFilter,
    setAuthorshipFilter,
    setSearch,
  }
}
