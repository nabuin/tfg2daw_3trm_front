<template>
  <div>
    <h2>Selección de Puestos y Tramos Horarios</h2>

    <p v-if="loading">Cargando puestos disponibles...</p>
    <p v-if="error" style="color: red;">Error al cargar: {{ error }}</p>

    <div v-if="!loading && !error">
      <div v-if="puestosDisponibles.length === 0">
        <p>No se encontraron puestos disponibles con los criterios seleccionados.</p>
      </div>

      <div
        v-for="puesto in puestosDisponibles"
        :key="puesto.idPuestoTrabajo"
        class="puesto-card"
      >
        <h4>Puesto #{{ puesto.numeroAsiento }} (Mesa: {{ puesto.codigoMesa }})</h4>
        <img v-if="puesto.urL_Imagen" :src="puesto.urL_Imagen" alt="Imagen del puesto" class="puesto-imagen"/>
        <p>ID Puesto: {{ puesto.idPuestoTrabajo }}</p>
        <h5>Tramos Horarios:</h5>
        <div class="tramos-container">
          <div
            v-for="slot in puesto.disponibilidadesEnRango"
            :key="slot.idTramoHorario"
            :class="{
              'tramo-slot': true,
              'unavailable': !slot.estado // Clase para tramos no disponibles
            }"
            @click="handleSlotClick(puesto, slot)"
          >
            {{ slot.horaInicio.substring(0, 5) }} - {{ slot.horaFin.substring(0, 5) }}
            <span v-if="!slot.estado">(No Disp.)</span>
          </div>
        </div>
      </div>

      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore'; 
import { useFiltrosStore } from '../store/filtrosStore'; 

import { storeToRefs } from 'pinia';

export default defineComponent({
  setup() {
    const puestosStore = usePuestosStore();
    const salaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();

    onMounted(() => {
   
       if (salaStore.id !== null) {
       }
    });

    watch(
      () => [
        // Watch filters to reload seats
        salaStore.id,
        filtrosStore.fechaInicio,
        filtrosStore.fechaFin,
        filtrosStore.horaInicio,
        filtrosStore.horaFin,
      ],
      () => {
        // Reload seats when filters change, if a room is selected
        if (salaStore.id !== null) {
          puestosStore.obtenerPuestosDisponibles();
        } else {
           // Clear the list if the room becomes null
           puestosStore.puestosDisponibles = [];
        }
      },
      { immediate: true } // Initial load when component mounts AND when filters change for the first time
    );

    // ** Function to handle clicking a time slot **
    const handleSlotClick = (puesto: any, slot: any) => {
      // This function is now simplified - no reservation store logic
      if (slot.estado) {
        console.log(`Clicked available slot: Puesto ID ${puesto.idPuestoTrabajo}, Tramo ID ${slot.idTramoHorario}`);
        // Add basic click feedback or logging here
      } else {
        console.log(`Clicked unavailable slot: Puesto ID ${puesto.idPuestoTrabajo}, Tramo ID ${slot.idTramoHorario}`);
        // Add basic feedback for unavailable slots
      }
    };


    return {
      // From puestosStore:
      ...storeToRefs(puestosStore), // Exposes puestosDisponibles, loading, error reactively

      handleSlotClick,

    };
  },
});
</script>

<style scoped>
/* Estilos super simples como pediste */
.puesto-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.puesto-card h4 {
    margin-top: 0;
    color: #333;
}

.puesto-imagen {
    max-width: 80px; /* Tamaño pequeño para la imagen */
    height: auto;
    margin-bottom: 10px;
    border-radius: 3px;
}

.tramos-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px; /* Espacio entre los tramos */
  margin-top: 8px;
}

.tramo-slot {
  padding: 5px 8px;
  border: 1px solid #aaa;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.15s ease;
}


.tramo-slot:hover:not(.unavailable) {
    background-color: #eee;
}

/* Estilo para tramos no disponibles */
.tramo-slot.unavailable {
  background-color: #e0e0e0;
  color: #888;
  border-color: #bbb;
  cursor: not-allowed;
  text-decoration: line-through; /* Indica visualmente que no está disponible */
}


</style>