import { defineStore } from 'pinia'
import type { Game, TableSession, DrinkPackage, Player } from '@/types'
import { mockGames, mockSessions, mockDrinkPackages } from '@/data/mock'

export const useGameStore = defineStore('game', {
  state: () => ({
    games: mockGames as Game[],
    sessions: mockSessions as TableSession[],
    drinkPackages: mockDrinkPackages as DrinkPackage[],
    currentUserId: 'player-1' as string,
    selectedCategories: [] as string[],
    selectedSessionId: null as string | null,
    changeNotice: null as { fromTable: string; toTable: string; gameName: string } | null,
  }),

  getters: {
    filteredSessions(state): TableSession[] {
      if (state.selectedCategories.length === 0) return state.sessions
      return state.sessions.filter((session) => {
        const game = state.games.find((g) => g.id === session.gameId)
        return game ? state.selectedCategories.includes(game.category) : false
      })
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
      }
      session.players.push(player)
    },

    leaveSession(sessionId: string) {
      const session = this.sessions.find((s) => s.id === sessionId)
      if (!session) return
      session.players = session.players.filter((p) => p.id !== this.currentUserId)
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
