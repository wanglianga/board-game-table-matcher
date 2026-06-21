<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Users, Star, MapPin, BookOpen, LogOut, LogIn, Crown, GraduationCap, Eye, Heart, AlertTriangle } from 'lucide-vue-next'
import { useGameStore } from '@/stores/gameStore'
import type { TableSession } from '@/types'

const props = defineProps<{
  session: TableSession
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const store = useGameStore()

const game = computed(() => store.getGameById(props.session.gameId))

const categoryMap: Record<string, string> = {
  reasoning: '推理',
  strategy: '策略',
  party: '派对',
  cooperation: '合作',
}

const ruleWeightMap: Record<string, { label: string; color: string }> = {
  light: { label: '规则轻', color: 'text-green-400' },
  medium: { label: '规则中等', color: 'text-board-amber' },
  hardcore: { label: '硬核', color: 'text-board-wine' },
}

const missingCount = computed(() => props.session.targetPlayerCount - props.session.players.length)

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const cardClasses = computed(() => {
  const base = 'bg-board-brown-light/80 backdrop-blur border border-board-muted/30 rounded-xl transition-all hover:border-board-amber/50 hover:shadow-lg cursor-pointer'
  if (props.session.status === 'finished') return `${base} opacity-40 grayscale`
  if (props.session.status === 'playing') return `${base} opacity-60`
  return base
})

const showLeftBorder = computed(() => props.session.status === 'teaching')
const showPulseGlow = computed(() => props.session.status === 'ready')

const hostPlayer = computed(() => {
  return props.session.players.find(p => p.id === props.session.hostId)
})

const isHardcore = computed(() => store.isSessionHardcoreForCurrentUser(props.session))

const showBeginnerBadges = computed(() => store.currentPlayerPreferences.length > 0)

const isFriendInvite = computed(() => store.isFriendInvite(props.session.id))

const friendName = computed(() => store.getFriendNameForSession(props.session.id))
</script>

<template>
  <div
    :class="[
      cardClasses,
      {
        'border-l-2 !border-l-board-amber': showLeftBorder && !isHardcore,
        '!border-l-2 !border-l-board-wine': showLeftBorder && isHardcore,
        'animate-pulse-glow': showPulseGlow && !isHardcore,
        'border-board-wine/40': isHardcore,
      }
    ]"
    class="flex gap-3 p-3"
    @click="emit('select', session.id)"
  >
    <img
      v-if="game"
      :src="game.coverUrl"
      :alt="game.name"
      class="h-12 w-12 rounded-lg object-cover opacity-80 shrink-0"
    />

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <div class="flex items-center gap-2">
        <span class="truncate font-serif text-sm font-bold text-board-cream">
          {{ game?.name }}
        </span>
        <span
          v-if="game"
          class="shrink-0 rounded-full bg-board-brown-light px-1.5 py-0.5 text-[10px] text-board-amber"
        >
          {{ categoryMap[game.category] }}
        </span>
        <span
          :class="ruleWeightMap[session.ruleWeight]?.color"
          class="shrink-0 rounded-full bg-board-brown/60 px-1.5 py-0.5 text-[10px] font-bold"
        >
          {{ ruleWeightMap[session.ruleWeight]?.label }}
        </span>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <span class="flex items-center gap-0.5 font-bold text-board-amber">
          <Users class="h-3 w-3" />
          {{ session.players.length }}/{{ session.targetPlayerCount }}
        </span>
        <span v-if="missingCount > 0" class="text-board-wine">
          还差{{ missingCount }}人
        </span>
      </div>

      <div class="flex items-center gap-2 text-xs text-board-cream/70">
        <Clock class="h-3 w-3" />
        <span>约{{ game?.estimatedMinutes }}分钟</span>
        <div v-if="game" class="flex items-center gap-px">
          <Star
            v-for="i in game.complexity"
            :key="i"
            class="h-2.5 w-2.5 fill-board-amber text-board-amber"
          />
        </div>
        <MapPin class="h-3 w-3" />
        <span class="font-bold text-board-amber">{{ session.tableNumber }}号桌</span>
      </div>

      <div class="flex items-center gap-2 text-xs flex-wrap">
        <template v-if="session.status === 'waiting' || session.status === 'ready'">
          <span class="font-bold text-board-wine">
            {{ formatCountdown(session.countdownSeconds) }}
          </span>
        </template>
        <span v-if="hostPlayer" class="flex items-center gap-0.5 text-board-amber">
          <Crown class="h-3 w-3" />
          {{ hostPlayer.name }}
        </span>
        <span v-if="session.needsTeaching" class="flex items-center gap-0.5 text-board-amber">
          <BookOpen class="h-3 w-3" />
          需教学
        </span>
        <span v-if="isFriendInvite" class="flex items-center gap-0.5 text-pink-400">
          <Users class="h-3 w-3" />
          {{ friendName }}邀请
        </span>
        <span v-if="session.canMidExit" class="flex items-center gap-0.5 text-board-cream/60">
          <LogOut class="h-3 w-3" />
          可退出
        </span>
        <span v-if="session.canMidJoin" class="flex items-center gap-0.5 text-board-cream/60">
          <LogIn class="h-3 w-3" />
          可加入
        </span>
      </div>

      <div v-if="showBeginnerBadges" class="flex items-center gap-1.5 flex-wrap">
        <span
          v-if="session.hasTeachingHost"
          class="flex items-center gap-0.5 rounded-full bg-board-amber/15 px-1.5 py-0.5 text-[10px] text-board-amber-light"
        >
          <GraduationCap class="h-2.5 w-2.5" />
          有主持教学
        </span>
        <span
          v-if="session.allowSpectating"
          class="flex items-center gap-0.5 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] text-blue-300"
        >
          <Eye class="h-2.5 w-2.5" />
          可观望
        </span>
        <span
          v-if="session.friendlyAtmosphere"
          class="flex items-center gap-0.5 rounded-full bg-pink-500/15 px-1.5 py-0.5 text-[10px] text-pink-300"
        >
          <Heart class="h-2.5 w-2.5" />
          气氛友好
        </span>
      </div>

      <div
        v-if="isHardcore"
        class="flex items-start gap-1.5 rounded-lg bg-board-wine/15 border border-board-wine/20 px-2 py-1.5"
      >
        <AlertTriangle class="h-3 w-3 shrink-0 mt-0.5 text-board-wine" />
        <div class="text-[10px] text-board-cream/80 leading-tight">
          <span class="font-bold text-board-wine">硬核桌提醒：</span>
          规则阅读约{{ session.ruleReadingMinutes }}分钟 · {{ session.exitImpact }}
        </div>
      </div>
    </div>
  </div>
</template>
