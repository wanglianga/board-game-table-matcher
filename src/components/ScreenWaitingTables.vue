<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { Users, Brain, Swords, PartyPopper, Handshake, BookOpen } from 'lucide-vue-next'
import type { Game } from '@/types'

const store = useGameStore()

const categoryIconMap: Record<Game['category'], typeof Brain> = {
  reasoning: Brain,
  strategy: Swords,
  party: PartyPopper,
  cooperation: Handshake,
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const sessions = computed(() => store.waitingSessions)
const needsScroll = computed(() => sessions.value.length > 5)
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-4">
      <Users class="w-6 h-6 text-board-amber" />
      <h2 class="text-board-amber font-serif text-2xl">等位中</h2>
    </div>

    <div class="flex-1 overflow-hidden relative">
      <div
        :class="[
          'flex flex-col gap-3',
          needsScroll ? 'animate-scroll-vertical' : '',
        ]"
      >
        <template v-for="(session, idx) in (needsScroll ? [...sessions, ...sessions] : sessions)" :key="idx + '-' + session.id">
          <div
            class="bg-board-brown-light/60 border border-board-muted/20 rounded-xl p-4 flex items-center gap-4"
          >
            <div class="text-3xl font-serif font-bold text-board-amber w-10 shrink-0 text-center">
              {{ session.tableNumber }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="text-board-cream font-serif text-lg truncate">
                {{ store.getGameById(session.gameId)?.name }}
              </div>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-board-muted">{{ session.players.length }}/{{ session.targetPlayerCount }}人</span>
                <span
                  v-if="session.targetPlayerCount - session.players.length > 0"
                  class="text-board-wine text-sm font-bold"
                >
                  还差{{ session.targetPlayerCount - session.players.length }}人
                </span>
              </div>
            </div>

            <div class="flex flex-col items-center gap-2 shrink-0">
              <component
                :is="categoryIconMap[store.getGameById(session.gameId)?.category ?? 'reasoning']"
                class="w-6 h-6 text-board-muted"
              />
              <BookOpen
                v-if="session.needsTeaching"
                class="w-5 h-5 text-board-amber-light"
              />
            </div>

            <div class="text-board-amber-light font-mono text-xl shrink-0">
              {{ formatCountdown(session.countdownSeconds) }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scrollVertical {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
.animate-scroll-vertical {
  animation: scrollVertical 30s linear infinite;
}
</style>
