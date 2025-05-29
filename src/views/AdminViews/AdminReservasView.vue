<template>
  <div class="admin-dashboard-container">
    <div v-if="isLoading" class="loading-message">
      Cargando información del usuario...
    </div>
    <div v-else-if="userStore.user && userStore.user.idRol === 1" class="admin-content-wrapper">
      <AdminMenuOpciones />
      <AdminReservas class="admin-sedes-margin" />
    </div>
    <div v-else-if="!tieneTokenJWT" class="access-denied-message">
      <p class="message-text">Por favor, inicie sesión primero.</p>
      <button
        @click="irLogin"
        class="home-button"
      >
        Ir a login
      </button>
    </div>
    <div v-else class="access-denied-message">
      <p class="message-text">Por favor, inicia sesión con un usuario de administrador para acceder aquí.</p>
      <button
        @click="irLogin"
        class="home-button"
      >
        Ir a login
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore';

import AdminReservas from '@/components/AdminComponents/AdminReservas.vue';
import AdminMenuOpciones from '@/components/AdminComponents/AdminMenuOpciones.vue';

const userStore = useUserStore();
const router = useRouter();

const tieneTokenJWT = ref(false); // false por defecto
const isLoading = ref(true);

onMounted(async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    tieneTokenJWT.value = true;
    // si hay token, hacer el fetch del usuario
    await userStore.cargarUsuarioFetch();
  } else {
    tieneTokenJWT.value = false;
  }
  // si el token existe y se tiene info del usuario, se quita el loading
  isLoading.value = false;
});

// funcion verificar si el usuario es un administrador
const isAdmin = computed(() => {
  return userStore.user && userStore.user.idRol === 1;
});

// redirigir a la pagina login
const irLogin = () => {
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.admin-dashboard-container {
  min-height: 64.6vh;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.admin-content-wrapper {
  width: 100%;
  max-width: 72rem;
}

.admin-sedes-margin {
  margin-top: 2rem;
}

.access-denied-message {
  background-color: #fee2e2;
  border-left: 4px solid #ef4444;
  color: #b91c1c;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 28rem;
  width: 100%;
  text-align: center;
}

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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
  transform: scale(1);

  &:hover {
    background-color: #b91c1c;
    transform: scale(1.05);
  }
}

.loading-message {
  text-align: center;
  color: #4b5563;
  font-size: 1.25rem;
}
</style>