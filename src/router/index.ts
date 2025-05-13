import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import SedesView from '../views/SedesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sedes',
      name: 'sedes',
      component: SedesView,
    },
  ],
});

export default router;
