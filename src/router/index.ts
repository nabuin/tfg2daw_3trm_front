import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import SedesView from '../views/SedesView.vue';
import SalasView from '../views/SalasView.vue';
import PuestosView from '../views/PuestosView.vue';

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
    {
      path: '/sedes/salas',
      name: 'salas',
      component: SalasView,
    },
    {
      path: '/sedes/salas/puestos',
      name: 'puestos',
      component: PuestosView,
    },
  ],
});

export default router;
