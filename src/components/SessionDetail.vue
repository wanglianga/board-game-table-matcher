<script setup lang="ts">
import { computed } from 'vue'
import { X, Clock, Users, Star, MapPin, BookOpen, LogOut, Crown, GraduationCap, Eye, Heart, AlertTriangle, Timer, ArrowRight } from 'lucide-vue-next'
import { useGameStore } from '@/stores/gameStore'
import type { Player } from '@/types'

const store = useGameStore()

const session = computed(() => store.currentSession)
const game = computed(() => session.value ? store.getGameById(session.value.gameId) : undefined)

const isOpen = computed(() => store.selectedSessionId !== null)

const close = () => store.selectSession(null)

const missingCount = computed(() => {
  if (!session.value) return 0
  return session.value.targetPlayerCount - session.value.players.length
})

const progressPercent = computed(() => {
  if (!session.value) return 0
  return Math.min(100, (session.value.players.length / session.value.targetPlayerCount) * 100)
})

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const statusConfig: Record<string, { label: string; color: string }> = {
  waiting: { label: '等待中', color: 'text-board-amber' },
  ready: { label: '即将开局!', color: 'text-board-wine' },
  teaching: { label: '规则讲解中', color: 'text-board-amber-light' },
  playing: { label: '游戏中', color: 'text-board-green' },
  finished: { label: '已结束', color: 'text-board-muted' },
}

const levelConfig: Record<string, { label: string; classes: string }> = {
  newbie: { label: '萌新', classes: 'bg-blue-500/20 text-blue-300' },
  casual: { label: '休闲', classes: 'bg-green-500/20 text-green-300' },
  veteran: { label: '老手', classes: 'bg-board-amber/20 text-board-amber' },
  master: { label: '大师', classes: 'bg-purple-500/20 text-purple-300' },
}

const isCurrentUserInSession = computed(() => {
  if (!session.value) return false
  return session.value.players.some(p => p.id === store.currentUserId)
})

const hostPlayer = computed(() => {
  if (!session.value) return undefined
  return session.value.players.find(p => p.id === session.value.hostId)
})

const isActionDisabled = computed(() => {
  if (!session.value) return true
  return session.value.status === 'playing' || session.value.status === 'finished'
})

const isHardcore = computed(() => {
  if (!session.value) return false
  return store.isSessionHardcoreForCurrentUser(session.value)
})

const hasBeginnerPrefs = computed(() => store.currentPlayerPreferences.length > 0)

const isFriendInvite = computed(() => session.value ? store.isFriendInvite(session.value.id) : false)

const friendName = computed(() => session.value ? store.getFriendNameForSession(session.value.id) : undefined)

const handleAction = () => {
  if (!session.value || isActionDisabled.value) return
  if (isCurrentUserInSession.value) {
    store.leaveSession(session.value.id)
  } else {
    const conflict = store.checkConflictForSession(session.value.id)
    if (conflict) {
      store.showConflict(conflict)
    } else {
      store.joinSession(session.value.id)
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen && session" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-black/60" @click="close" />

      <div class="fixed bottom-0 left-0 right-0 animate-slide-up rounded-t-2xl bg-board-brown max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 pb-2">
          <h2 class="font-serif text-lg font-bold text-board-cream">
            {{ game?.name }}
          </h2>
          <button @click="close" class="text-board-cream/60 hover:text-board-cream">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="px-4 pb-4 space-y-4">
          <div class="flex items-center gap-2">
            <span :class="statusConfig[session.status]?.color" class="text-sm font-bold">
              {{ statusConfig[session.status]?.label }}
            </span>
            <span
              v-if="isFriendInvite"
              class="flex items-center gap-1 rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] text-pink-300"
            >
              <Users class="h-3 w-3" />
              {{ friendName }}邀请你
            </span>
          </div>

          <div
            v-if="isHardcore"
            class="rounded-xl border border-board-wine/40 bg-board-wine/15 p-3 space-y-2"
          >
            <div class="flex items-center gap-2">
              <AlertTriangle class="h-4 w-4 text-board-wine" />
              <span class="text-sm font-bold text-board-wine">硬核桌提醒</span>
            </div>
            <div class="space-y-1.5 text-xs text-board-cream/80">
              <div class="flex items-center gap-2">
                <Timer class="h-3.5 w-3.5 text-board-amber shrink-0" />
                <span>规则阅读约需 <span class="font-bold text-board-amber">{{ session.ruleReadingMinutes }}分钟</span></span>
              </div>
              <div class="flex items-center gap-2">
                <AlertTriangle class="h-3.5 w-3.5 text-board-wine shrink-0" />
                <span>退出影响：<span class="font-bold text-board-wine">{{ session.exitImpact }}</span></span>
              </div>
              <div v-if="!session.canMidExit" class="flex items-center gap-2">
                <LogOut class="h-3.5 w-3.5 text-board-wine shrink-0" />
                <span class="text-board-wine font-bold">本桌不允许中途退出</span>
              </div>
              <div v-if="!session.friendlyAtmosphere" class="flex items-center gap-2">
                <span class="text-board-cream/60">· 气氛偏竞技，不适合轻松体验</span>
              </div>
            </div>
          </div>

          <div v-if="hasBeginnerPrefs && !isHardcore" class="flex items-center gap-2 flex-wrap">
            <span
              v-if="session.hasTeachingHost"
              class="flex items-center gap-1 rounded-full bg-board-amber/15 px-2 py-1 text-xs text-board-amber-light"
            >
              <GraduationCap class="h-3.5 w-3.5" />
              有主持教学
            </span>
            <span
              v-if="session.allowSpectating"
              class="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-1 text-xs text-blue-300"
            >
              <Eye class="h-3.5 w-3.5" />
              可先观望再决定
            </span>
            <span
              v-if="session.friendlyAtmosphere"
              class="flex items-center gap-1 rounded-full bg-pink-500/15 px-2 py-1 text-xs text-pink-300"
            >
              <Heart class="h-3.5 w-3.5" />
              气氛友好
            </span>
          </div>

          <div class="rounded-xl bg-board-brown-light/60 p-3">
            <p class="mb-1 text-xs text-board-cream/50">主持人</p>
            <div class="flex items-center gap-2">
              <div class="relative">
                <img
                  v-if="hostPlayer"
                  :src="hostPlayer.avatar"
                  :alt="hostPlayer.name"
                  class="h-10 w-10 rounded-full object-cover ring-2 ring-board-amber"
                />
                <Crown class="absolute -top-1 -right-1 h-3.5 w-3.5 text-board-amber" />
              </div>
              <div>
                <p class="text-sm font-bold text-board-cream">{{ hostPlayer?.name }}</p>
                <span :class="hostPlayer ? levelConfig[hostPlayer.level]?.classes : ''" class="rounded-full px-1.5 py-0.5 text-[9px]">
                  {{ hostPlayer ? levelConfig[hostPlayer.level]?.label : '' }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="h-3 overflow-hidden rounded-full bg-board-brown-light">
              <div
                class="h-full rounded-full bg-board-amber transition-all"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>
            <p class="text-xs text-board-cream/70">
              {{ session.players.length }}/{{ session.targetPlayerCount }}人
              <span v-if="missingCount > 0" class="text-board-wine"> · 还差{{ missingCount }}人</span>
            </p>
          </div>

          <div v-if="session.status === 'waiting' || session.status === 'ready'" class="text-center">
            <p
              :class="session.countdownSeconds < 60 ? 'text-board-wine' : 'text-board-amber'"
              class="font-serif text-3xl font-bold"
            >
              {{ formatCountdown(session.countdownSeconds) }}
            </p>
            <p class="text-xs text-board-cream/50">距离开局</p>
          </div>

          <div>
            <p class="mb-2 text-xs text-board-cream/50">参与成员</p>
            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div
                v-for="player in session.players"
                :key="player.id"
                class="flex shrink-0 flex-col items-center gap-1"
              >
                <div class="relative">
                  <img
                    :src="player.avatar"
                    :alt="player.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <Crown
                    v-if="player.id === session.hostId"
                    class="absolute -top-1 -right-1 h-3.5 w-3.5 text-board-amber"
                  />
                </div>
                <span class="text-[10px] text-board-cream/80">{{ player.name }}</span>
                <span
                  :class="levelConfig[player.level]?.classes"
                  class="rounded-full px-1.5 py-0.5 text-[9px]"
                >
                  {{ levelConfig[player.level]?.label }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-2 text-xs text-board-cream/70">
            <div class="flex items-center gap-2">
              <MapPin class="h-3.5 w-3.5 text-board-amber" />
              <span>{{ session.tableNumber }}号桌 · {{ session.tableArea }}</span>
            </div>
            <div v-if="game" class="flex items-center gap-2">
              <Clock class="h-3.5 w-3.5 text-board-amber" />
              <span>约{{ game.estimatedMinutes }}分钟</span>
            </div>
            <div class="flex items-center gap-2">
              <BookOpen class="h-3.5 w-3.5 text-board-amber" />
              <span>{{ session.needsTeaching ? '需要教学' : '无需教学' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <LogOut class="h-3.5 w-3.5 text-board-amber" />
              <span>{{ session.canMidExit ? '可中途退出' : '不可退出' }}</span>
            </div>
          </div>

          <div v-if="session.drinkPackage" class="rounded-xl bg-board-brown-light/60 p-3">
            <p class="mb-1 text-xs font-bold text-board-cream">饮品套餐</p>
            <p class="text-sm font-bold text-board-amber">{{ session.drinkPackage.name }} ¥{{ session.drinkPackage.price }}</p>
            <p class="text-xs text-board-cream/60">{{ session.drinkPackage.items.join('、') }}</p>
          </div>

          <button
            :disabled="isActionDisabled"
            @click="handleAction"
            :class="[
              isCurrentUserInSession
                ? 'bg-board-wine hover:bg-board-wine-light'
                : isHardcore
                  ? 'bg-board-wine hover:bg-board-wine-light'
                  : 'bg-board-amber hover:bg-board-amber-dark text-board-brown-dark font-bold',
              isActionDisabled ? 'opacity-40 cursor-not-allowed' : '',
            ]"
            class="w-full rounded-xl py-3 text-sm font-bold text-board-cream transition-colors"
          >
            <span v-if="isCurrentUserInSession">退出拼桌</span>
            <span v-else-if="isHardcore" class="flex items-center justify-center gap-1">
              <AlertTriangle class="h-4 w-4" />
              了解风险，加入硬核桌
            </span>
            <span v-else>加入拼桌</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
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
