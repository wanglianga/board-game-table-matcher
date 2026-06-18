<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import CategoryFilter from '@/components/CategoryFilter.vue'
import SessionCard from '@/components/SessionCard.vue'
import SessionDetail from '@/components/SessionDetail.vue'
import DrinkPackageBar from '@/components/DrinkPackageBar.vue'
import { Dice5 } from 'lucide-vue-next'

const store = useGameStore()

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    store.tickCountdowns()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen bg-board-brown-dark">
    <header class="sticky top-0 z-30 bg-board-brown/95 backdrop-blur border-b border-board-muted/20">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <Dice5 class="h-6 w-6 text-board-amber" />
          <h1 class="font-serif text-lg font-bold text-board-cream">桌游吧</h1>
          <span class="text-xs text-board-amber">组局拼桌</span>
        </div>
        <router-link
          to="/screen"
          class="text-xs text-board-muted hover:text-board-amber transition-colors"
        >
          大屏模式 →
        </router-link>
      </div>
      <CategoryFilter />
    </header>

    <main class="px-4 pt-3 pb-28 space-y-3">
      <SessionCard
        v-for="session in store.filteredSessions"
        :key="session.id"
        :session="session"
        @select="store.selectSession"
      />

      <div
        v-if="store.filteredSessions.length === 0"
        class="py-16 text-center"
      >
        <p class="text-board-muted text-sm">暂无匹配的对局</p>
        <p class="text-board-muted/60 text-xs mt-1">试试切换其他分类</p>
      </div>
    </main>

    <SessionDetail />
    <DrinkPackageBar />
  </div>
</template>
