import type { Game, Player, DrinkPackage, TableSession } from '@/types'

export const games: Game[] = [
  {
    id: 'game-avalon',
    name: '阿瓦隆',
    category: 'reasoning',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E9%98%BF%E7%93%A6%E9%9A%86&image_size=square_hd',
    playerRange: [5, 10],
    estimatedMinutes: 30,
    complexity: 3,
    description: '亚瑟王时代的隐藏身份博弈，正义阵营需要完成三次任务才能获胜，而刺客可能潜伏在任何人身边。'
  },
  {
    id: 'game-werewolf',
    name: '狼人杀',
    category: 'reasoning',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E7%8B%BC%E4%BA%BA%E6%9D%80&image_size=square_hd',
    playerRange: [6, 12],
    estimatedMinutes: 45,
    complexity: 4,
    description: '经典身份推理游戏，白天讨论投票放逐可疑玩家，夜晚狼人猎杀平民，神职各怀绝技。'
  },
  {
    id: 'game-catan',
    name: '卡坦岛',
    category: 'strategy',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E5%8D%A1%E5%9D%A6%E5%B2%9B&image_size=square_hd',
    playerRange: [3, 4],
    estimatedMinutes: 60,
    complexity: 3,
    description: '在资源丰富的岛屿上建造聚落与城市，通过贸易和精妙布局率先获得十分。'
  },
  {
    id: 'game-brass',
    name: '镉铸策略',
    category: 'strategy',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E9%95%89%E9%93%B8%E7%AD%96%E7%95%A5&image_size=square_hd',
    playerRange: [2, 4],
    estimatedMinutes: 90,
    complexity: 5,
    description: '工业革命时期的重策经济游戏，建造运河与铁路，发展棉花与煤炭产业，争夺最高分。'
  },
  {
    id: 'game-exploding',
    name: '爆炸炸弹猫',
    category: 'party',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E7%88%86%E7%82%B8%E7%82%B8%E5%BC%B9%E7%8C%AB&image_size=square_hd',
    playerRange: [2, 5],
    estimatedMinutes: 15,
    complexity: 1,
    description: '快节奏卡牌派对游戏，用各种搞怪卡牌避免抽到炸弹猫，最后幸存者获胜。'
  },
  {
    id: 'game-spyfall',
    name: '谁是卧底',
    category: 'party',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E8%B0%81%E6%98%AF%E5%8D%A7%E5%BA%95&image_size=square_hd',
    playerRange: [4, 8],
    estimatedMinutes: 20,
    complexity: 2,
    description: '每人拿到一个词语，其中卧底拿到相近但不同的词，通过描述和推理找出卧底。'
  },
  {
    id: 'game-saboteur',
    name: '潜行坏蛋',
    category: 'cooperation',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E6%BD%9C%E8%A1%8C%E5%9D%8F%E8%9B%8B&image_size=square_hd',
    playerRange: [3, 10],
    estimatedMinutes: 30,
    complexity: 2,
    description: '矿工合作挖路寻找金子，但坏蛋矿工会暗中破坏，谁能笑到最后？'
  },
  {
    id: 'game-pandemic',
    name: '瘟疫危机',
    category: 'cooperation',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=board+game+cover+art+%E7%98%9F%E7%96%AB%E5%8D%B1%E6%9C%BA&image_size=square_hd',
    playerRange: [2, 4],
    estimatedMinutes: 45,
    complexity: 3,
    description: '全球合作对抗四种病毒爆发，玩家扮演不同专业角色，在感染扩散前研发解药。'
  }
]

export const players: Player[] = [
  {
    id: 'player-1',
    name: '林小风',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon+avatar+%E6%9E%97%E5%B0%8F%E9%A3%8E&image_size=square_hd',
    level: 'veteran'
  },
  {
    id: 'player-2',
    name: '赵大勇',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon+avatar+%E8%B5%B5%E5%A4%A7%E5%8B%87&image_size=square_hd',
    level: 'master'
  },
  {
    id: 'player-3',
    name: '王美丽',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon+avatar+%E7%8E%8B%E7%BE%8E%E4%B8%BD&image_size=square_hd',
    level: 'casual'
  },
  {
    id: 'player-4',
    name: '陈思远',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon+avatar+%E9%99%88%E6%80%9D%E8%BF%9C&image_size=square_hd',
    level: 'newbie'
  },
  {
    id: 'player-5',
    name: '张晓东',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon+avatar+%E5%BC%A0%E6%99%93%E4%B8%9C&image_size=square_hd',
    level: 'veteran'
  },
  {
    id: 'player-6',
    name: '刘雨桐',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon+avatar+%E5%88%98%E9%9B%A8%E6%A1%90&image_size=square_hd',
    level: 'casual'
  }
]

export const drinkPackages: DrinkPackage[] = [
  {
    id: 'drink-classic',
    name: '经典畅饮',
    price: 68,
    items: ['可乐', '雪碧', '美年达', '柠檬水', '冰红茶']
  },
  {
    id: 'drink-tipsy',
    name: '微醺特调',
    price: 88,
    items: ['莫吉托', '长岛冰茶', '威士忌酸', '金汤力', '果味啤酒']
  },
  {
    id: 'drink-luxury',
    name: '豪华全配',
    price: 128,
    items: ['精酿啤酒', '红酒', '鸡尾酒任选', '鲜榨果汁', '气泡水', '特调奶茶']
  }
]

export const tableSessions: TableSession[] = [
  {
    id: 'session-1',
    gameId: 'game-avalon',
    tableNumber: 1,
    hostId: 'player-1',
    players: [players[0], players[2], players[5]],
    targetPlayerCount: 7,
    status: 'waiting',
    canMidJoin: true,
    canMidExit: true,
    needsTeaching: false,
    countdownSeconds: 300,
    createdAt: '2026-06-18T14:00:00Z'
  },
  {
    id: 'session-2',
    gameId: 'game-werewolf',
    tableNumber: 2,
    hostId: 'player-2',
    players: [players[1], players[0], players[3]],
    targetPlayerCount: 9,
    status: 'waiting',
    canMidJoin: true,
    canMidExit: false,
    needsTeaching: true,
    countdownSeconds: 600,
    createdAt: '2026-06-18T14:10:00Z'
  },
  {
    id: 'session-3',
    gameId: 'game-exploding',
    tableNumber: 3,
    hostId: 'player-3',
    players: [players[2]],
    targetPlayerCount: 4,
    status: 'waiting',
    canMidJoin: true,
    canMidExit: true,
    needsTeaching: false,
    countdownSeconds: 120,
    createdAt: '2026-06-18T14:20:00Z'
  },
  {
    id: 'session-4',
    gameId: 'game-catan',
    tableNumber: 4,
    hostId: 'player-1',
    players: [players[0], players[1], players[4]],
    targetPlayerCount: 4,
    status: 'ready',
    canMidJoin: false,
    canMidExit: false,
    needsTeaching: true,
    countdownSeconds: 120,
    createdAt: '2026-06-18T13:50:00Z'
  },
  {
    id: 'session-5',
    gameId: 'game-spyfall',
    tableNumber: 5,
    hostId: 'player-5',
    players: [players[4], players[2], players[3], players[5]],
    targetPlayerCount: 4,
    status: 'ready',
    canMidJoin: false,
    canMidExit: false,
    needsTeaching: false,
    countdownSeconds: 60,
    createdAt: '2026-06-18T14:05:00Z'
  },
  {
    id: 'session-6',
    gameId: 'game-brass',
    tableNumber: 6,
    hostId: 'player-2',
    players: [players[1], players[0], players[4]],
    targetPlayerCount: 3,
    status: 'teaching',
    canMidJoin: false,
    canMidExit: true,
    needsTeaching: true,
    countdownSeconds: 0,
    drinkPackage: drinkPackages[1],
    createdAt: '2026-06-18T13:30:00Z'
  },
  {
    id: 'session-7',
    gameId: 'game-pandemic',
    tableNumber: 7,
    hostId: 'player-5',
    players: [players[4], players[1], players[0], players[5]],
    targetPlayerCount: 4,
    status: 'playing',
    canMidJoin: false,
    canMidExit: true,
    needsTeaching: false,
    countdownSeconds: 0,
    drinkPackage: drinkPackages[2],
    createdAt: '2026-06-18T13:00:00Z'
  },
  {
    id: 'session-8',
    gameId: 'game-saboteur',
    tableNumber: 8,
    hostId: 'player-3',
    players: [players[2], players[3], players[5], players[0], players[4]],
    targetPlayerCount: 5,
    status: 'finished',
    canMidJoin: false,
    canMidExit: false,
    needsTeaching: false,
    countdownSeconds: 0,
    drinkPackage: drinkPackages[0],
    createdAt: '2026-06-18T12:00:00Z'
  }
]

export const mockGames = games
export const mockSessions = tableSessions
export const mockDrinkPackages = drinkPackages
