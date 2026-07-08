<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
const el = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!el.value) return
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        setTimeout(() => { isVisible.value = true }, props.delay)
        observer?.unobserve(entry.target)
      }
    },
    { threshold: 0.1 }
  )
  observer.observe(el.value)
})

onUnmounted(() => { observer?.disconnect() })
</script>

<template>
  <div ref="el" class="transition-all duration-700 ease-out" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'">
    <slot />
  </div>
</template>
