<script setup lang="ts">
import { Baby, ShieldOff, Smile, Clock } from 'lucide-vue-next'
import { useGameStore } from '@/stores/gameStore'
import type { PlayerPreference } from '@/types'

const store = useGameStore()

const preferences: { key: PlayerPreference; label: string; icon: typeof Baby; desc: string }[] = [
  { key: 'firstTime', label: '第一次玩', icon: Baby, desc: '优先推荐有教学、规则轻的桌' },
  { key: 'socialAnxiety', label: '社恐友好', icon: ShieldOff, desc: '优先推荐气氛友好、可观望的桌' },
  { key: 'relaxedOnly', label: '轻松局', icon: Smile, desc: '优先推荐规则轻、气氛好的桌' },
  { key: 'noLongSession', label: '不想长时长', icon: Clock, desc: '优先推荐短时长、可退出的桌' },
]

function toggle(pref: PlayerPreference) {
  store.setPlayerPreference(pref)
}

function isActive(key: PlayerPreference): boolean {
  return store.currentPlayerPreferences.includes(key)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-1.5 px-4">
      <span class="text-xs text-board-cream/50">选择你的偏好</span>
      <span
        v-if="store.currentPlayerPreferences.length > 0"
        class="rounded-full bg-board-amber/20 px-1.5 py-0.5 text-[10px] text-board-amber"
      >
        已选{{ store.currentPlayerPreferences.length }}项
      </span>
    </div>
    <div class="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
      <button
        v-for="pref in preferences"
        :key="pref.key"
        @click="toggle(pref.key)"
        :class="[
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-all',
          isActive(pref.key)
            ? 'bg-board-amber text-board-brown-dark shadow-sm shadow-board-amber/30'
            : 'bg-board-brown-light/80 text-board-cream/70 border border-board-muted/20',
        ]"
      >
        <component :is="pref.icon" class="h-3.5 w-3.5" />
        {{ pref.label }}
      </button>
    </div>
  </div>
</template>
