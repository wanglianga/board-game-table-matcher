<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Users, Star, MapPin, BookOpen, LogOut, LogIn } from 'lucide-vue-next'
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
</script>

<template>
  <div
    :class="[cardClasses, { 'border-l-2 !border-l-board-amber': showLeftBorder, 'animate-pulse-glow': showPulseGlow }]"
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

      <div class="flex items-center gap-2 text-xs">
        <template v-if="session.status === 'waiting' || session.status === 'ready'">
          <span class="font-bold text-board-wine">
            {{ formatCountdown(session.countdownSeconds) }}
          </span>
        </template>
        <span v-if="session.needsTeaching" class="flex items-center gap-0.5 text-board-amber">
          <BookOpen class="h-3 w-3" />
          需教学
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
    </div>
  </div>
</template>
