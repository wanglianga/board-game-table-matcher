<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import ScreenWaitingTables from '@/components/ScreenWaitingTables.vue'
import ScreenFormedTables from '@/components/ScreenFormedTables.vue'
import ScreenTeachingSessions from '@/components/ScreenTeachingSessions.vue'
import ScreenChangeNotice from '@/components/ScreenChangeNotice.vue'
import { Dice5 } from 'lucide-vue-next'

const store = useGameStore()

let timer: ReturnType<typeof setInterval> | null = null
let changeTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    store.tickCountdowns()
  }, 1000)

  changeTimer = setInterval(() => {
    const sessions = store.waitingSessions
    if (sessions.length > 1) {
      const fromSession = sessions[Math.floor(Math.random() * sessions.length)]
      const toSession = sessions.filter(s => s.id !== fromSession.id)[Math.floor(Math.random() * (sessions.length - 1))]
      if (fromSession && toSession) {
        const game = store.getGameById(fromSession.gameId)
        store.triggerChangeNotice(
          String(fromSession.tableNumber),
          String(toSession.tableNumber),
          game?.name ?? ''
        )
      }
    }
  }, 8000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (changeTimer) clearInterval(changeTimer)
})
</script>

<template>
  <div class="h-screen bg-board-brown-dark flex flex-col overflow-hidden">
    <ScreenChangeNotice />

    <header class="shrink-0 flex items-center justify-between px-8 py-4 border-b border-board-muted/20 bg-board-brown/80 backdrop-blur">
      <div class="flex items-center gap-3">
        <Dice5 class="h-8 w-8 text-board-amber" />
        <h1 class="font-serif text-2xl font-bold text-board-cream">桌游吧 · 实时看板</h1>
      </div>
      <div class="flex items-center gap-4">
        <router-link
          to="/"
          class="text-sm text-board-muted hover:text-board-amber transition-colors"
        >
          ← 手机端
        </router-link>
      </div>
    </header>

    <main class="flex-1 flex gap-6 p-6 min-h-0">
      <div class="flex-[3] min-h-0 overflow-hidden">
        <ScreenWaitingTables />
      </div>

      <div class="flex-[2] flex flex-col gap-6 min-h-0">
        <div class="flex-1 min-h-0 overflow-hidden">
          <ScreenFormedTables />
        </div>
        <div class="flex-1 min-h-0 overflow-hidden">
          <ScreenTeachingSessions />
        </div>
      </div>
    </main>

    <footer class="shrink-0 px-8 py-2 border-t border-board-muted/10 bg-board-brown/50">
      <div class="flex items-center justify-between text-xs text-board-muted/50">
        <span>数据每秒自动刷新</span>
        <span>{{ new Date().toLocaleDateString('zh-CN') }}</span>
      </div>
    </footer>
  </div>
</template>
