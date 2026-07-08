import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollReveal(el: Ref<HTMLElement | null>, options?: { threshold?: number; delay?: number }) {
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!el.value) return
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          if (options?.delay) {
            setTimeout(() => { isVisible.value = true }, options.delay)
          } else {
            isVisible.value = true
          }
          observer?.unobserve(entry.target)
        }
      },
      { threshold: options?.threshold ?? 0.1 }
    )
    observer.observe(el.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { isVisible }
}

export function useActiveSection(sectionIds: string[]) {
  const activeSection = ref(sectionIds[0] || '')

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        }
      },
      { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  return { activeSection }
}
