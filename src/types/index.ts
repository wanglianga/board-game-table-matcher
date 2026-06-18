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

export interface Player {
  id: string
  name: string
  avatar: string
  level: 'newbie' | 'casual' | 'veteran' | 'master'
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
}
