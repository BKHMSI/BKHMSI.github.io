<script setup lang="ts">
defineProps<{ role: string }>()

const roleConfig: Record<string, string> = {
  Reviewer: 'bg-ink-100 dark:bg-white/10 text-ink-500 dark:text-dark-muted',
  'Area Chair': 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
}

function parseRoles(role: string): string[] {
  if (!role) return []
  return role.split(',').map((r) => r.trim()).filter(Boolean)
}
</script>

<template>
  <span
    v-for="r in parseRoles(role)"
    :key="r"
    class="inline-flex items-center whitespace-nowrap text-xs font-medium px-2 py-0.5 rounded-full ml-1.5 align-middle"
    :class="roleConfig[r] ?? 'bg-ink-100 dark:bg-white/10 text-ink-500 dark:text-dark-muted'"
  >
    {{ r }}
  </span>
</template>
