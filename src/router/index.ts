import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import SedesView from '../views/SedesView.vue';
import SalasView from '../views/SalasView.vue';
import PuestosView from '../views/PuestosView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import  UserInfoView from '../views/UserInfoView.vue';
import InfoPedidoView from '@/views/InfoPedidoView.vue';
import AdminView from '@/views/AdminViews/AdminUsersView.vue';

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
      {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
         {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
         {
      path: '/userinfo',
      name: 'UserInfo',
      component: UserInfoView,
    },

    {
      path: '/infopedido',
      name: 'InfoPedidoView',
      component: InfoPedidoView,
    },
      {
      path: '/admin',
      name: 'AdminView',
      component: AdminView,
    },
  ],
});

export default router;
