export interface Game {
  id: string
  name: string
  category: 'reasoning' | 'strategy' | 'party' | 'cooperation'
  coverUrl: string
  playerRange: [number, number]
  estimatedMinutes: number
  complexity: number
  description: string
}

export type PlayerPreference = 'firstTime' | 'socialAnxiety' | 'relaxedOnly' | 'noLongSession'

export interface Player {
  id: string
  name: string
  avatar: string
  level: 'newbie' | 'casual' | 'veteran' | 'master'
  preferences?: PlayerPreference[]
}

export interface DrinkPackage {
  id: string
  name: string
  price: number
  items: string[]
}

export interface TableSession {
  id: string
  gameId: string
  tableNumber: number
  hostId: string
  players: Player[]
  targetPlayerCount: number
  status: 'waiting' | 'ready' | 'teaching' | 'playing' | 'finished'
  canMidJoin: boolean
  canMidExit: boolean
  needsTeaching: boolean
  countdownSeconds: number
  drinkPackage?: DrinkPackage
  createdAt: string
  hasTeachingHost: boolean
  ruleWeight: 'light' | 'medium' | 'hardcore'
  friendlyAtmosphere: boolean
  allowSpectating: boolean
  ruleReadingMinutes: number
  exitImpact: string
  tableArea: string
  hostReady: boolean
}

export type InviteSource = 'normal' | 'friend'

export interface WaitlistConflict {
  sessionId: string
  gameName: string
  tableNumber: number
  estimatedStartMinutes: number
  tableArea: string
  hostReady: boolean
  inviteSource?: InviteSource
}

export type ConflictSeverity = 'low' | 'medium' | 'high'

export interface ConflictWarning {
  targetSession: WaitlistConflict
  existingConflicts: WaitlistConflict[]
  severity: ConflictSeverity
  recommendation: string
  timeConflict: boolean
  distanceConflict: boolean
}
