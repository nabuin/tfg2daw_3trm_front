<template>
  <div>
    <div v-if="loading">Cargando...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="!loading && salasDisponibles.length === 0 && !error">
      No hay salas disponibles para esa búsqueda.
    </div>
    <div v-if="salasDisponibles.length > 0">
      <div class="salas-lista">
        <router-link
          v-for="sala in salasDisponibles"
          :key="sala.idSala"
          class="sala-button"
          to="/sedes/salas/puestos"
          @click="seleccionarSala(sala)"
        >
          {{ sala.nombre }} – Capacidad: {{ sala.capacidad }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useSalasStore } from '../store/salasStore';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';

export default defineComponent({
  setup() {
    const { salasDisponibles, error, loading, obtenerSalasDisponibles } = useSalasStore();
    const sedeSeleccionadaStore = useSedeSeleccionadaStore();
    const salaSeleccionadaStore = useSalaSeleccionadaStore();

    const buscarSalas = async () => {
      await obtenerSalasDisponibles();
    };

    const seleccionarSala = (sala: { idSala: number; nombre: string; capacidad: number }) => {
      salaSeleccionadaStore.setId(sala.idSala);
    };

    const idSede = computed(() => sedeSeleccionadaStore.id);

    onMounted(buscarSalas);

    watch(idSede, (newId, oldId) => {
      if (newId !== oldId) {
        buscarSalas();
      }
    });

    return {
      salasDisponibles,
      error,
      loading,
      seleccionarSala
    };
  },
});
</script>

<style scoped>
.salas-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sala-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.sala-button:hover {
  background: #f5f5f5;
}
</style>
