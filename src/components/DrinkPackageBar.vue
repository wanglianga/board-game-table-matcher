<script setup lang="ts">
import { ref, computed } from 'vue'
import { Wine, ChevronRight } from 'lucide-vue-next'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()
const expanded = ref(false)

const cheapestPrice = computed(() => {
  if (store.drinkPackages.length === 0) return 0
  return Math.min(...store.drinkPackages.map(p => p.price))
})

const detailOpen = computed(() => store.selectedSessionId !== null)
</script>

<template>
  <div
    v-if="!detailOpen"
    class="fixed bottom-4 left-4 right-4 z-40"
  >
    <div
      class="rounded-xl border border-board-amber/30 bg-board-brown-light/90 p-3 backdrop-blur"
    >
      <button
        class="flex w-full items-center justify-between"
        @click="expanded = !expanded"
      >
        <div class="flex items-center gap-2">
          <Wine class="h-4 w-4 text-board-amber" />
          <span class="text-sm text-board-cream">饮品套餐</span>
          <span class="text-sm font-bold text-board-amber">¥{{ cheapestPrice }}起</span>
        </div>
        <ChevronRight
          :class="expanded ? 'rotate-90' : ''"
          class="h-4 w-4 text-board-cream/60 transition-transform"
        />
      </button>

      <div v-if="expanded" class="mt-3 space-y-2">
        <div
          v-for="pkg in store.drinkPackages"
          :key="pkg.id"
          class="rounded-lg bg-board-brown/40 p-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-board-cream">{{ pkg.name }}</span>
            <span class="text-xs font-bold text-board-amber">¥{{ pkg.price }}</span>
          </div>
          <p class="mt-0.5 text-[10px] text-board-cream/50">{{ pkg.items.join('、') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
