<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { AlertTriangle, ArrowRight } from 'lucide-vue-next'

const store = useGameStore()
</script>

<template>
  <Transition name="notice">
    <div
      v-if="store.changeNotice"
      class="fixed top-0 left-0 right-0 z-[100] p-2"
    >
      <div class="mx-auto max-w-6xl overflow-hidden rounded-xl border-2 border-board-amber bg-gradient-to-r from-board-wine via-board-wine-light to-board-wine shadow-2xl shadow-board-wine/50 animate-notice-pulse">
        <div class="flex items-center justify-center gap-4 px-6 py-4">
          <AlertTriangle class="h-8 w-8 shrink-0 text-board-amber animate-bounce" />

          <div class="flex flex-1 items-center justify-center gap-6">
            <div class="flex items-center gap-3">
              <span class="font-serif text-lg font-bold text-board-cream">换桌通知</span>
              <span class="rounded-full bg-board-brown/60 px-3 py-1 font-serif text-2xl font-bold text-board-amber">
                {{ store.changeNotice.gameName }}
              </span>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex flex-col items-center">
                <span class="text-[11px] text-board-cream/60">原桌号</span>
                <span class="font-serif text-4xl font-black text-board-amber">
                  {{ store.changeNotice.fromTable }}
                </span>
              </div>

              <div class="flex flex-col items-center">
                <ArrowRight class="h-6 w-6 animate-pulse text-board-amber-light" />
              </div>

              <div class="flex flex-col items-center">
                <span class="text-[11px] text-board-cream/60">新桌号</span>
                <span class="font-serif text-4xl font-black text-board-green">
                  {{ store.changeNotice.toTable }}
                </span>
              </div>
            </div>
          </div>

          <AlertTriangle class="h-8 w-8 shrink-0 text-board-amber animate-bounce" style="animation-delay: 0.15s" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.notice-enter-active,
.notice-leave-active {
  transition: all 0.4s ease;
}

.notice-enter-from {
  opacity: 0;
  transform: translateY(-100%) scale(0.9);
}

.notice-leave-to {
  opacity: 0;
  transform: translateY(-100%) scale(0.9);
}

@keyframes noticePulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(245, 166, 35, 0.3);
    border-color: rgba(245, 166, 35, 0.8);
  }
  50% {
    box-shadow: 0 0 50px rgba(245, 166, 35, 0.8);
    border-color: rgba(255, 200, 87, 1);
  }
}

.animate-notice-pulse {
  animation: noticePulse 1s ease-in-out infinite;
}
</style>
