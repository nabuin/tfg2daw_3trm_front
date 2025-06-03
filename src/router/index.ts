import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import SedesView from '../views/SedesView.vue';
import SalasView from '../views/SalasView.vue';
import PuestosView from '../views/PuestosView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import  UserInfoView from '../views/UserInfoView.vue';
import  PagoView from '../views/PagoView.vue';
import PreciosView from '../views/PreciosView.vue'
import InfoPedidoView from '@/views/InfoPedidoView.vue';
import AdminSedesView from '../views/AdminViews/AdminSedesView.vue';
import AdminUsersView from '@/views/AdminViews/AdminUsersView.vue';
import AdminSalasView from '@/views/AdminViews/AdminSalasView.vue';
import AdminReservasView from '@/views/AdminViews/AdminReservasView.vue';
import GraficoView from '@/views/GraficoView.vue'



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
      path: '/sedes/salas/puestos/pago',
      name: 'Pago',
      component: PagoView,
    },
     {
      path: '/AdminSedes',
      name: 'Admin Sedes',
      component: AdminSedesView,
    },
      {
      path: '/adminusers',
      name: 'Admin users',
      component: AdminUsersView,
    },
      {
      path: '/adminsalas',
      name: 'Admin salas',
      component: AdminSalasView,
    },
     {
      path: '/adminreservas',
      name: 'Admin reservas',
      component: AdminReservasView,
    },
    {
      path: '/precios',
      name: 'Precios',
      component: PreciosView,
    },
    {
      path: '/grafico',
      name: 'GraficoView',
      component: GraficoView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
});

export default router;
