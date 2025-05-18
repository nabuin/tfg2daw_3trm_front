<template>
  <div v-if="salaId !== null">
    <h3>Filtros aplicados</h3>
    <ul>
      <li>Fecha Inicio: {{ fechaInicio }}</li>
      <li>Fecha Fin:    {{ fechaFin }}</li>
      <li>Hora Inicio:  {{ horaInicio }}</li>
      <li>Hora Fin:     {{ horaFin }}</li>
    </ul>
    <p>Sala seleccionada: {{ salaId }}</p>
    <!-- Aquí cargarías los puestos vía API usando salaId y los mismos filtros si hiciera falta -->
  </div>
  <div v-else>
    <p>No hay sala seleccionada.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';

export default defineComponent({
  setup() {
    const salaStore   = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();

    const salaId      = computed(() => salaStore.id);
    const { fechaInicio, fechaFin, horaInicio, horaFin } = filtrosStore;

    return { salaId, fechaInicio, fechaFin, horaInicio, horaFin };
  },
});
</script>
