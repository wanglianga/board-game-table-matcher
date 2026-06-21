<script setup lang="ts">
import { computed } from 'vue'
import { X, AlertTriangle, Clock, MapPin, CheckCircle, Users, ArrowRight } from 'lucide-vue-next'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const conflict = computed(() => store.pendingConflict)

const handleConfirm = () => {
  if (!conflict.value) return
  store.confirmSessionAndReleaseOthers(conflict.value.targetSession.sessionId)
}

const handleCancel = () => {
  store.dismissConflict()
}

const sameArea = (a: string, b: string) => a === b

const formatMinutes = (m: number) => {
  if (m <= 0) return '即将开始'
  if (m < 5) return `${m}分钟内`
  return `约${m}分钟`
}

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: '低风险', color: 'text-green-400', bg: 'bg-green-500/20' },
  medium: { label: '中风险', color: 'text-board-amber', bg: 'bg-board-amber/20' },
  high: { label: '高风险', color: 'text-board-wine', bg: 'bg-board-wine/20' },
}

const getFriendName = (sessionId: string) => {
  return store.getFriendNameForSession(sessionId)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="conflict">
      <div v-if="conflict" class="fixed inset-0 z-[60] flex items-end justify-center">
        <div class="fixed inset-0 bg-black/70" @click="handleCancel" />

        <div class="relative w-full max-w-lg animate-slide-up rounded-t-2xl bg-board-brown border-t-2 border-board-wine">
          <div class="flex items-center justify-between p-4 pb-2">
            <div class="flex items-center gap-2">
              <AlertTriangle class="h-5 w-5 text-board-wine" />
              <h2 class="font-serif text-base font-bold text-board-cream">候补冲突提醒</h2>
            </div>
            <button @click="handleCancel" class="text-board-cream/60 hover:text-board-cream">
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="px-4 pb-4 space-y-4">
            <div class="flex items-center gap-2">
              <span
                :class="[severityConfig[conflict.severity]?.color, severityConfig[conflict.severity]?.bg]"
                class="rounded-full px-2 py-0.5 text-[10px] font-bold"
              >
                {{ severityConfig[conflict.severity]?.label }}
              </span>
              <span v-if="conflict.timeConflict" class="text-[10px] text-board-wine">
                ⏰ 时间冲突
              </span>
              <span v-if="conflict.distanceConflict" class="text-[10px] text-board-amber">
                📍 距离冲突
              </span>
            </div>

            <p class="text-xs text-board-cream/70">
              你已在 <span class="font-bold text-board-amber">{{ conflict.existingConflicts.length }}桌</span> 等候，再加入第三桌可能时间冲突。请查看对比后选择：
            </p>

            <div class="rounded-lg bg-board-brown-light/40 border border-board-muted/20 p-2">
              <p class="text-[11px] text-board-cream/80">
                <span class="font-bold text-board-amber">💡 建议：</span>{{ conflict.recommendation }}
              </p>
            </div>

            <div class="space-y-2">
              <div
                v-for="existing in conflict.existingConflicts"
                :key="existing.sessionId"
                class="rounded-xl bg-board-brown-light/60 border border-board-muted/20 p-3"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-2">
                    <span class="font-serif text-sm font-bold text-board-cream">{{ existing.gameName }}</span>
                    <span
                      v-if="existing.inviteSource === 'friend'"
                      class="rounded-full bg-pink-500/20 px-1.5 py-0.5 text-[9px] text-pink-300"
                    >
                      {{ getFriendName(existing.sessionId) }}邀请
                    </span>
                  </div>
                  <span class="rounded-full bg-board-brown/60 px-2 py-0.5 text-[10px] text-board-cream/50">
                    已候补
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-board-cream/70">
                  <span class="flex items-center gap-1">
                    <Clock class="h-3 w-3 text-board-amber" />
                    {{ formatMinutes(existing.estimatedStartMinutes) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <MapPin class="h-3 w-3 text-board-amber" />
                    {{ existing.tableArea }}·{{ existing.tableNumber }}号桌
                  </span>
                  <span
                    v-if="existing.hostReady"
                    class="flex items-center gap-0.5 text-green-400"
                  >
                    <CheckCircle class="h-3 w-3" />
                    主持已就位
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center">
              <ArrowRight class="h-5 w-5 text-board-wine animate-bounce" />
            </div>

            <div class="rounded-xl border-2 border-board-wine/40 bg-board-wine/10 p-3">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="font-serif text-sm font-bold text-board-cream">{{ conflict.targetSession.gameName }}</span>
                  <span
                    v-if="conflict.targetSession.inviteSource === 'friend'"
                    class="rounded-full bg-pink-500/20 px-1.5 py-0.5 text-[9px] text-pink-300"
                  >
                    {{ getFriendName(conflict.targetSession.sessionId) }}邀请
                  </span>
                </div>
                <span class="rounded-full bg-board-wine/30 px-2 py-0.5 text-[10px] font-bold text-board-wine">
                  新邀请
                </span>
              </div>
              <div class="flex items-center gap-3 text-xs text-board-cream/70">
                <span class="flex items-center gap-1">
                  <Clock class="h-3 w-3 text-board-wine" />
                  {{ formatMinutes(conflict.targetSession.estimatedStartMinutes) }}
                </span>
                <span class="flex items-center gap-1">
                  <MapPin class="h-3 w-3 text-board-wine" />
                  {{ conflict.targetSession.tableArea }}·{{ conflict.targetSession.tableNumber }}号桌
                </span>
                <span
                  v-if="conflict.targetSession.hostReady"
                  class="flex items-center gap-0.5 text-green-400"
                >
                  <CheckCircle class="h-3 w-3" />
                  主持已就位
                </span>
              </div>
              <div
                v-if="sameArea(conflict.targetSession.tableArea, conflict.existingConflicts[0]?.tableArea)"
                class="mt-2 text-[10px] text-board-cream/50"
              >
                📍 与已候补桌在同一区域，步行可达
              </div>
              <div
                v-else
                class="mt-2 text-[10px] text-board-wine/70"
              >
                ⚠️ 与已候补桌不在同一区域，可能需要移动
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="handleCancel"
                class="flex-1 rounded-xl border border-board-muted/30 bg-board-brown-light py-2.5 text-sm text-board-cream/80 transition-colors hover:bg-board-brown-light/80"
              >
                保持候补
              </button>
              <button
                @click="handleConfirm"
                class="flex-1 rounded-xl bg-board-wine py-2.5 text-sm font-bold text-board-cream transition-colors hover:bg-board-wine-light"
              >
                确认此桌，释放其他
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.conflict-enter-active,
.conflict-leave-active {
  transition: all 0.3s ease;
}
.conflict-enter-from {
  opacity: 0;
}
.conflict-leave-to {
  opacity: 0;
}
</style>
