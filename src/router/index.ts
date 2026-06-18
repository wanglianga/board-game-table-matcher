import { createRouter, createWebHistory } from 'vue-router'
import PlayerPage from '@/pages/PlayerPage.vue'
import ScreenPage from '@/pages/ScreenPage.vue'

const routes = [
  {
    path: '/',
    name: 'player',
    component: PlayerPage,
  },
  {
    path: '/screen',
    name: 'screen',
    component: ScreenPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
