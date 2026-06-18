<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { BookOpen, MapPin } from 'lucide-vue-next'

const store = useGameStore()

const sessions = computed(() => store.teachingSessions)
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 mb-4">
      <BookOpen class="w-6 h-6 text-board-amber" />
      <h2 class="text-board-amber font-serif text-2xl">即将讲解</h2>
    </div>

    <div v-if="sessions.length === 0" class="flex-1 flex items-center justify-center">
      <span class="text-board-muted text-lg">暂无讲解场次</span>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="border-2 border-board-amber rounded-xl p-5 animate-pulse-glow bg-board-brown-light/30"
      >
        <div class="flex items-center gap-3">
          <MapPin class="w-5 h-5 text-board-amber shrink-0" />
          <span class="text-board-amber font-serif font-bold text-3xl">
            {{ session.tableNumber }}号桌
          </span>
        </div>
        <div class="mt-2 text-board-cream font-serif text-xl">
          {{ store.getGameById(session.gameId)?.name }}
        </div>
        <div class="mt-1 text-board-amber-light text-base">
          规则讲解即将开始
        </div>
      </div>
    </div>
  </div>
</template>
