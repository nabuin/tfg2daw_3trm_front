<template>
  <div>

    <div v-if="loading">Cargando...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="!loading && salasDisponibles.length === 0 && !error">
      No hay salas disponibles para esa búsqueda. aaaa
    </div>

    <div v-if="salasDisponibles.length > 0">
      <div class="salas-lista">
        <button
          v-for="sala in salasDisponibles"
          :key="sala.idSala"
          class="sala-button"
          @click="seleccionarSala(sala)"
        >
          {{ sala.nombre }} – Capacidad: {{ sala.capacidad }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useSalasStore } from '../store/salasStore';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';

export default defineComponent({
  setup() {
    const { salasDisponibles, error, loading, obtenerSalasDisponibles } = useSalasStore();
    const sedeSeleccionadaStore = useSedeSeleccionadaStore();

    const buscarSalas = async () => {
      await obtenerSalasDisponibles();
      console.log('Salas cargadas:', salasDisponibles.value);
    };

    const seleccionarSala = (sala: { idSala: number; nombre: string; capacidad: number }) => {
      console.log('Sala seleccionada:', sala);
      // Aquí puedes emitir un evento o llamar a otra acción del store
    };

    const idSeleccionada = computed(() => sedeSeleccionadaStore.id);

    const resetId = () => {
      sedeSeleccionadaStore.reset();
    };

    onMounted(() => {
      buscarSalas();
    });

    watch(idSeleccionada, (newId, oldId) => {
      if (newId !== oldId) {
        buscarSalas();
      }
    });

    return {
      salasDisponibles,
      error,
      loading,
      buscarSalas,
      seleccionarSala,
      idSeleccionada,
      resetId,
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
  cursor: pointer;
}

.sala-button:hover {
  background: #f5f5f5;
}
</style>
