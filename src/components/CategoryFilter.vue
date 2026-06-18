<script setup lang="ts">
import { Brain, Swords, PartyPopper, Handshake } from 'lucide-vue-next'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const categories = [
  { key: 'reasoning', label: '推理', icon: Brain },
  { key: 'strategy', label: '策略', icon: Swords },
  { key: 'party', label: '派对', icon: PartyPopper },
  { key: 'cooperation', label: '合作', icon: Handshake },
] as const
</script>

<template>
  <div class="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
    <button
      v-for="cat in categories"
      :key="cat.key"
      @click="store.toggleCategory(cat.key)"
      :class="[
        'flex items-center gap-1 rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors',
        store.selectedCategories.includes(cat.key)
          ? 'bg-board-amber text-board-brown-dark'
          : 'bg-board-brown-light text-board-cream',
      ]"
    >
      <component :is="cat.icon" class="h-3.5 w-3.5" />
      {{ cat.label }}
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
