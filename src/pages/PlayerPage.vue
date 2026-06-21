<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import CategoryFilter from '@/components/CategoryFilter.vue'
import PlayerPreferenceBar from '@/components/PlayerPreferenceBar.vue'
import SessionCard from '@/components/SessionCard.vue'
import SessionDetail from '@/components/SessionDetail.vue'
import DrinkPackageBar from '@/components/DrinkPackageBar.vue'
import ConflictDialog from '@/components/ConflictDialog.vue'
import { Dice5, X, Users, Bell } from 'lucide-vue-next'

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
        <div class="flex items-center gap-3">
          <div
            v-if="store.currentUserWaitingSessions.length > 0"
            class="flex items-center gap-1 rounded-full bg-board-amber/15 px-2 py-1"
          >
            <Users class="h-3 w-3 text-board-amber" />
            <span class="text-[10px] font-bold text-board-amber">
              候补{{ store.currentUserWaitingSessions.length }}桌
            </span>
          </div>
          <router-link
            to="/screen"
            class="text-xs text-board-muted hover:text-board-amber transition-colors"
          >
            大屏模式 →
          </router-link>
        </div>
      </div>
      <CategoryFilter />
      <PlayerPreferenceBar />
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

    <div
      v-if="store.releasedNotifications.length > 0"
      class="fixed top-16 left-4 right-4 z-40 space-y-2"
    >
      <div
        v-for="notif in store.releasedNotifications"
        :key="notif.sessionId"
        class="rounded-xl bg-board-brown-light/95 backdrop-blur border border-board-amber/30 p-3 animate-fade-in"
      >
        <div class="flex items-start gap-2">
          <Bell class="h-4 w-4 shrink-0 mt-0.5 text-board-amber" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-board-cream">已退出「{{ notif.gameName }}」候补</p>
            <p class="text-[10px] text-board-cream/60">
              该桌还差<span class="font-bold text-board-wine">{{ notif.missingCount }}人</span>成局
            </p>
          </div>
          <button
            @click="store.dismissReleasedNotification(notif.sessionId)"
            class="text-board-cream/40 hover:text-board-cream/70"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <SessionDetail />
    <ConflictDialog />
    <DrinkPackageBar />
  </div>
</template>
