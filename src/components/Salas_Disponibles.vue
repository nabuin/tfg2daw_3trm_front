<template>
  <div>
    <button @click="buscarSalas">Buscar salas disponibles</button>
    <p>ID Sede actual: {{ idSeleccionada }}</p>
    <button @click="resetId">Resetear sede seleccionada</button>

    <div v-if="loading">Cargando...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="!loading && salasDisponibles.length === 0 && !error">
      No hay salas disponibles para esa búsqueda.
    </div>

    <ul v-if="salasDisponibles.length > 0">
      <li v-for="sala in salasDisponibles" :key="sala.idSala">
        {{ sala.nombre }} - Capacidad: {{ sala.capacidad }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
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

    const idSeleccionada = computed(() => sedeSeleccionadaStore.id);

    const resetId = () => {
      sedeSeleccionadaStore.reset();
    };

    return {
      salasDisponibles,
      error,
      loading,
      buscarSalas,
      idSeleccionada,
      resetId,
    };
  },
});
</script>
