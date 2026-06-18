<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { Volume2 } from 'lucide-vue-next'

const store = useGameStore()

const sessions = computed(() => store.formedSessions)

function borderColor(status: string): string {
  return status === 'playing' ? 'border-l-board-green' : 'border-l-board-amber'
}

function statusText(status: string): string {
  return status === 'playing' ? '游戏中' : '讲解中'
}

function statusColor(status: string): string {
  return status === 'playing' ? 'text-board-green' : 'text-board-amber'
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-4">
      <Volume2 class="w-6 h-6 text-board-green" />
      <h2 class="text-board-green font-serif text-2xl">已开局</h2>
    </div>

    <div class="grid grid-cols-2 gap-3 flex-1 content-start">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="bg-board-brown-light/40 border-l-4 rounded-lg p-3"
        :class="borderColor(session.status)"
      >
        <div class="flex items-center justify-between">
          <span class="text-board-amber font-serif font-bold text-lg">
            {{ session.tableNumber }}号桌
          </span>
          <span class="text-sm font-bold" :class="statusColor(session.status)">
            {{ statusText(session.status) }}
          </span>
        </div>
        <div class="text-board-cream font-serif text-sm mt-1 truncate">
          {{ store.getGameById(session.gameId)?.name }}
        </div>
      </div>
    </div>
  </div>
</template>
