<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { AlertTriangle } from 'lucide-vue-next'

const store = useGameStore()
</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="store.changeNotice"
      class="fixed top-0 left-0 right-0 z-50 bg-board-wine text-white p-4 animate-slide-down"
    >
      <div class="flex items-center justify-center gap-3">
        <AlertTriangle class="w-5 h-5 shrink-0" />
        <span class="text-base font-sans">
          换桌通知: {{ store.changeNotice.gameName }} 从 {{ store.changeNotice.fromTable }}号桌 换至 {{ store.changeNotice.toTable }}号桌
        </span>
      </div>
    </div>
  </Transition>
</template>
