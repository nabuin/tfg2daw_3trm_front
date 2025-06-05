<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore';

import DashboardCharts from '@/components/GraficasCharts.vue';
import AdminMenuOpciones from '@/components/AdminComponents/AdminMenuOpciones.vue';


const userStore = useUserStore();
const router = useRouter();

const tieneTokenJWT = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    tieneTokenJWT.value = true;
    await userStore.cargarUsuarioFetch();
  } else {
    tieneTokenJWT.value = false;
  }
  isLoading.value = false;
});

const isAdmin = computed(() => {
  return userStore.user && userStore.user.idRol === 1;
});

const irLogin = () => {
  router.push('/login');
};
</script>

<template>
        <AdminMenuOpciones />

  <div class="grafico-view">
    <div v-if="isLoading" class="loading-message">
      Cargando información del usuario...
    </div>

    <div v-else-if="!tieneTokenJWT" class="centered-container">
      <div class="access-denied-message">
        <p class="message-text">Por favor, inicie sesión primero.</p>
        <button @click="irLogin" class="home-button">Ir a login</button>
      </div>
    </div>

    <div v-else-if="!isAdmin" class="centered-container">
      <div class="access-denied-message">
        <p class="message-text">Por favor, inicia sesión con un usuario de administrador para acceder aquí.</p>
        <button @click="irLogin" class="home-button">Ir a login</button>
      </div>
    </div>

    <div v-else>
      <h1 class="page-title">Dashboard de Estadísticas</h1>
      <DashboardCharts />
    </div>
  </div>
</template>

<style scoped lang="scss">

.grafico-view {
  padding: 2rem;
  background-color: #f9fafb;
  margin-bottom: 40px;

  .page-title {
    font-size: 2rem;
    color: #1f2937;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 600;
  }

  .loading-message {
    text-align: center;
    color: #4b5563;
    font-size: 1.25rem;
  }

  .access-denied-message {
    background-color: #fee2e2;
    border-left: 4px solid #ef4444;
    color: #b91c1c;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-width: 28rem;
    width: 100%;
    text-align: center;
    margin-top: 2rem;

    .message-text {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .home-button {
      background-color: #dc2626;
      color: #ffffff;
      font-weight: bold;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                  0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease-in-out;
      transform: scale(1);
      cursor: pointer;

      &:hover {
        background-color: #b91c1c;
        transform: scale(1.05);
      }
    }
  }

  .centered-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 200px);
    flex-direction: column;
  }
}
</style>