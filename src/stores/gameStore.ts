import { defineStore } from 'pinia'
import type { Game, TableSession, DrinkPackage, Player, PlayerPreference, WaitlistConflict, ConflictWarning, ConflictSeverity, InviteSource } from '@/types'
import { mockGames, mockSessions, mockDrinkPackages, mockFriendInvites } from '@/data/mock'

export const useGameStore = defineStore('game', {
  state: () => ({
    games: mockGames as Game[],
    sessions: mockSessions as TableSession[],
    drinkPackages: mockDrinkPackages as DrinkPackage[],
    currentUserId: 'player-1' as string,
    selectedCategories: [] as string[],
    selectedSessionId: null as string | null,
    changeNotice: null as { fromTable: string; toTable: string; gameName: string } | null,
    currentPlayerPreferences: [] as PlayerPreference[],
    pendingConflict: null as ConflictWarning | null,
    releasedNotifications: [] as { sessionId: string; gameName: string; missingCount: number }[],
    friendInvites: mockFriendInvites as { sessionId: string; friendName: string }[],
  }),

  getters: {
    filteredSessions(state): TableSession[] {
      let result = state.sessions
      if (state.selectedCategories.length > 0) {
        result = result.filter((session) => {
          const game = state.games.find((g) => g.id === session.gameId)
          return game ? state.selectedCategories.includes(game.category) : false
        })
      }
      if (state.currentPlayerPreferences.length > 0) {
        result = [...result].sort((a, b) => {
          const scoreA = getSessionBeginnerScore(a, state.currentPlayerPreferences, state.games)
          const scoreB = getSessionBeginnerScore(b, state.currentPlayerPreferences, state.games)
          return scoreB - scoreA
        })
      }
      return result
    },

    waitingSessions(state): TableSession[] {
      return state.sessions.filter((s) => s.status === 'waiting' || s.status === 'ready')
    },

    formedSessions(state): TableSession[] {
      return state.sessions.filter((s) => s.status === 'playing' || s.status === 'teaching')
    },

    teachingSessions(state): TableSession[] {
      return state.sessions.filter((s) => s.status === 'teaching')
    },

    currentSession(state): TableSession | undefined {
      if (!state.selectedSessionId) return undefined
      return state.sessions.find((s) => s.id === state.selectedSessionId)
    },

    getGameById(state) {
      return (id: string): Game | undefined => {
        return state.games.find((g) => g.id === id)
      }
    },

    currentUserWaitingSessions(state): TableSession[] {
      return state.sessions.filter(
        (s) =>
          (s.status === 'waiting' || s.status === 'ready') &&
          s.players.some((p) => p.id === state.currentUserId)
      )
    },

    isSessionHardcoreForCurrentUser(state) {
      return (session: TableSession): boolean => {
        if (state.currentPlayerPreferences.length === 0) return false
        if (session.ruleWeight === 'hardcore') return true
        const game = state.games.find((g) => g.id === session.gameId)
        if (!game) return false
        if (state.currentPlayerPreferences.includes('noLongSession') && game.estimatedMinutes > 60) return true
        if (state.currentPlayerPreferences.includes('relaxedOnly') && session.ruleWeight === 'medium' && !session.friendlyAtmosphere) return true
        return false
      }
    },
  },

  actions: {
    toggleCategory(category: string) {
      const index = this.selectedCategories.indexOf(category)
      if (index === -1) {
        this.selectedCategories.push(category)
      } else {
        this.selectedCategories.splice(index, 1)
      }
    },

    selectSession(id: string | null) {
      this.selectedSessionId = id
    },

    setPlayerPreference(pref: PlayerPreference) {
      const index = this.currentPlayerPreferences.indexOf(pref)
      if (index === -1) {
        this.currentPlayerPreferences.push(pref)
      } else {
        this.currentPlayerPreferences.splice(index, 1)
      }
    },

    joinSession(sessionId: string) {
      const session = this.sessions.find((s) => s.id === sessionId)
      if (!session) return
      const alreadyIn = session.players.some((p) => p.id === this.currentUserId)
      if (alreadyIn) return
      const player: Player = {
        id: this.currentUserId,
        name: '我',
        avatar: '',
        level: 'casual',
        preferences: [...this.currentPlayerPreferences],
      }
      session.players.push(player)
    },

    leaveSession(sessionId: string) {
      const session = this.sessions.find((s) => s.id === sessionId)
      if (!session) return
      session.players = session.players.filter((p) => p.id !== this.currentUserId)
    },

    confirmSessionAndReleaseOthers(confirmedSessionId: string) {
      const confirmedSession = this.sessions.find((s) => s.id === confirmedSessionId)
      if (!confirmedSession) return

      const otherWaiting = this.sessions.filter(
        (s) =>
          s.id !== confirmedSessionId &&
          (s.status === 'waiting' || s.status === 'ready') &&
          s.players.some((p) => p.id === this.currentUserId)
      )

      this.releasedNotifications = otherWaiting.map((s) => {
        const game = this.games.find((g) => g.id === s.gameId)
        s.players = s.players.filter((p) => p.id !== this.currentUserId)
        return {
          sessionId: s.id,
          gameName: game?.name ?? '',
          missingCount: s.targetPlayerCount - s.players.length,
        }
      })

      if (!confirmedSession.players.some((p) => p.id === this.currentUserId)) {
        const player: Player = {
          id: this.currentUserId,
          name: '我',
          avatar: '',
          level: 'casual',
          preferences: [...this.currentPlayerPreferences],
        }
        confirmedSession.players.push(player)
      }

      this.pendingConflict = null
    },

    isFriendInvite(sessionId: string): boolean {
      return this.friendInvites.some((f) => f.sessionId === sessionId)
    },

    getFriendNameForSession(sessionId: string): string | undefined {
      return this.friendInvites.find((f) => f.sessionId === sessionId)?.friendName
    },

    addFriendInvite(sessionId: string, friendName: string) {
      if (!this.friendInvites.some((f) => f.sessionId === sessionId)) {
        this.friendInvites.push({ sessionId, friendName })
      }
    },

    removeFriendInvite(sessionId: string) {
      this.friendInvites = this.friendInvites.filter((f) => f.sessionId !== sessionId)
    },

    checkConflictForSession(sessionId: string): ConflictWarning | null {
      const targetSession = this.sessions.find((s) => s.id === sessionId)
      if (!targetSession) return null
      if (targetSession.players.some((p) => p.id === this.currentUserId)) return null

      const currentWaiting = this.currentUserWaitingSessions
      if (currentWaiting.length < 2) return null

      const isFriend = this.isFriendInvite(sessionId)
      const friendName = this.getFriendNameForSession(sessionId)

      const game = this.games.find((g) => g.id === targetSession.gameId)
      const targetEstimatedMinutes = Math.ceil(targetSession.countdownSeconds / 60)

      const target: WaitlistConflict = {
        sessionId: targetSession.id,
        gameName: game?.name ?? '',
        tableNumber: targetSession.tableNumber,
        estimatedStartMinutes: targetEstimatedMinutes,
        tableArea: targetSession.tableArea,
        hostReady: targetSession.hostReady,
        inviteSource: isFriend ? 'friend' : 'normal',
      }

      const existingConflicts: WaitlistConflict[] = currentWaiting.map((s) => {
        const g = this.games.find((gg) => gg.id === s.gameId)
        const existingIsFriend = this.isFriendInvite(s.id)
        return {
          sessionId: s.id,
          gameName: g?.name ?? '',
          tableNumber: s.tableNumber,
          estimatedStartMinutes: Math.ceil(s.countdownSeconds / 60),
          tableArea: s.tableArea,
          hostReady: s.hostReady,
          inviteSource: existingIsFriend ? 'friend' : 'normal',
        }
      })

      let timeConflict = false
      let distanceConflict = false
      let severity: ConflictSeverity = 'low'
      let highRiskCount = 0

      for (const existing of existingConflicts) {
        const timeDiff = Math.abs(targetEstimatedMinutes - existing.estimatedStartMinutes)
        if (timeDiff < 10) {
          timeConflict = true
          highRiskCount++
        }

        if (target.tableArea !== existing.tableArea) {
          distanceConflict = true
          if (timeDiff < 15) {
            highRiskCount++
          }
        }

        if (!target.hostReady || !existing.hostReady) {
          if (timeDiff < 20) {
            highRiskCount++
          }
        }
      }

      if (highRiskCount >= 3) {
        severity = 'high'
      } else if (highRiskCount >= 1 || timeConflict || distanceConflict) {
        severity = 'medium'
      }

      let recommendation = ''
      if (isFriend) {
        const existingFriendCount = existingConflicts.filter((e) => e.inviteSource === 'friend').length
        if (existingFriendCount > 0) {
          recommendation = `你有${existingFriendCount}个朋友邀请在候补，建议优先选择时间和位置更合适的一桌`
        } else {
          recommendation = `${friendName || '朋友'}邀请你加入，建议确认时间安排后选择`
        }
      } else if (severity === 'high') {
        recommendation = '时间和位置冲突风险很高，建议谨慎选择'
      } else if (timeConflict) {
        recommendation = '开局时间接近，可能无法同时参与'
      } else if (distanceConflict) {
        recommendation = '不在同一区域，可能需要预留移动时间'
      } else {
        recommendation = '时间和位置相对宽松，可根据兴趣选择'
      }

      return {
        targetSession: target,
        existingConflicts: existingConflicts,
        severity,
        recommendation,
        timeConflict,
        distanceConflict,
      }
    },

    showConflict(warning: ConflictWarning) {
      this.pendingConflict = warning
    },

    dismissConflict() {
      this.pendingConflict = null
    },

    dismissReleasedNotification(sessionId: string) {
      this.releasedNotifications = this.releasedNotifications.filter((n) => n.sessionId !== sessionId)
    },

    clearAllReleasedNotifications() {
      this.releasedNotifications = []
    },

    triggerChangeNotice(from: string, to: string, gameName: string) {
      this.changeNotice = { fromTable: from, toTable: to, gameName }
      setTimeout(() => {
        this.changeNotice = null
      }, 5000)
    },

    tickCountdowns() {
      for (const session of this.sessions) {
        if (session.status !== 'waiting' && session.status !== 'ready') continue
        session.countdownSeconds -= 1
        if (session.countdownSeconds <= 0) {
          session.countdownSeconds = 0
          if (session.needsTeaching) {
            session.status = 'teaching'
          } else {
            session.status = 'playing'
          }
        } else if (session.countdownSeconds < 60 && session.status === 'waiting') {
          session.status = 'ready'
        }
      }
    },
  },
})

function getSessionBeginnerScore(session: TableSession, preferences: PlayerPreference[], games: Game[]): number {
  let score = 0
  const game = games.find((g) => g.id === session.gameId)

  if (preferences.includes('firstTime')) {
    if (session.hasTeachingHost) score += 10
    if (session.ruleWeight === 'light') score += 8
    else if (session.ruleWeight === 'medium') score += 3
    else if (session.ruleWeight === 'hardcore') score -= 10
    if (session.allowSpectating) score += 6
    if (session.needsTeaching) score += 5
    if (game && game.complexity <= 2) score += 5
    else if (game && game.complexity >= 4) score -= 5
  }

  if (preferences.includes('socialAnxiety')) {
    if (session.friendlyAtmosphere) score += 8
    if (session.ruleWeight === 'light') score += 5
    if (session.allowSpectating) score += 10
    if (session.hasTeachingHost) score += 4
    if (!session.friendlyAtmosphere && session.ruleWeight === 'hardcore') score -= 8
  }

  if (preferences.includes('relaxedOnly')) {
    if (session.ruleWeight === 'light') score += 10
    else if (session.ruleWeight === 'medium' && session.friendlyAtmosphere) score += 4
    else if (session.ruleWeight === 'hardcore') score -= 10
    if (session.friendlyAtmosphere) score += 6
    if (session.canMidExit) score += 3
    if (game && game.estimatedMinutes <= 30) score += 5
    else if (game && game.estimatedMinutes > 60) score -= 5
  }

  if (preferences.includes('noLongSession')) {
    if (game && game.estimatedMinutes <= 30) score += 10
    else if (game && game.estimatedMinutes <= 60) score += 4
    else if (game && game.estimatedMinutes > 60) score -= 8
    if (session.canMidExit) score += 5
    if (session.ruleWeight === 'hardcore') score -= 5
  }

  return score
}
