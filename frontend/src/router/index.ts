import { readSession } from '@/services/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/tickets' },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('@/views/TicketListView.vue'),
    },
    {
      path: '/tickets/new',
      name: 'ticket-new',
      component: () => import('@/views/NewTicketView.vue'),
    },
    {
      path: '/tickets/:id',
      name: 'ticket-detail',
      component: () => import('@/views/TicketDetailView.vue'),
      props: true,
    },
    {
      path: '/staff',
      name: 'staff',
      component: () => import('@/views/StaffView.vue'),
      meta: { admin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const user = readSession()
  if (to.meta.guest) {
    if (user) return { name: 'tickets' }
    return true
  }
  if (!user) return { name: 'login' }
  if (to.meta.admin && user.role !== 'ADMIN') return { name: 'tickets' }
  return true
})

export default router