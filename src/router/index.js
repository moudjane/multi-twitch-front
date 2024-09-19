import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:streamers', // Route dynamique pour gérer plusieurs streamers
      name: 'multi-streamers',
      component: () => import('../views/MultiStreamerView.vue') // Vue pour afficher plusieurs streamers
    }
  ]
});

export default router;