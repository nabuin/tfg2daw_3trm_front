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
          <!-- iterar los tramos y manejarlos-->
          <div
            v-for="slot in puesto.disponibilidadesEnRango" 
            :key="slot.idTramoHorario"
            :class="{
              'tramo-slot': true,
              'unavailable': !slot.estado, 
              'selected': isSlotSelected(puesto.idPuestoTrabajo, slot.idTramoHorario)
            }"
            @click="handleSlotClick(puesto, slot)"
          >
            {{ slot.horaInicio.substring(0, 5) }} - {{ slot.horaFin.substring(0, 5) }}  <!-- substring para obtener las horas sin decimales extra y solo ej 10:00-->
            <span v-if="!slot.estado">(No Disp.)</span>
          </div>
        </div>
      </div>

      <!-- Sección de Resumen y Botón de Compra -->
      <div class="resumen-section" v-if="selectedSlots.length > 0">
        <h3>Resumen de Selección</h3>
        <p>Has seleccionado {{ selectedSlots.length }} tramo(s) horario(s)</p>
        <div class="selected-items">
          <div 
            v-for="(slot, index) in selectedSlots" 
            :key="index" 
            class="selected-item"
          >
            Puesto: {{ slot.idPuestoTrabajo }}, Horario: {{ slot.horaInicio.substring(0, 5) }}
            <button @click="removeSlot(index)" class="remove-button">X</button>
          </div>
        </div>
        
        <div class="action-buttons">
          <button 
            @click="resetSelection" 
            class="cancel-button" 
            :disabled="isReserving"
          >
            Cancelar
          </button>
          <button 
            @click="handleSubmit" 
            class="submit-button" 
            :disabled="isReserving || selectedSlots.length === 0"
          >
            {{ isReserving ? 'Procesando...' : 'Confirmar Reserva' }}
          </button>
        </div>
        
        <!-- condicional si se efectua bien o si da un error como el 409 si algo ya esta seleccionado -->
        <p v-if="reservationSuccess" class="success-message">{{ reservationSuccess }}</p>
        <p v-if="reservationError" class="error-message">{{ reservationError }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore'; 
import { useFiltrosStore } from '../store/filtrosStore';
import { useReservasStore } from '../store/reservasStore';
import { useUserStore } from '../store/userStore'; // Import the user store

import { storeToRefs } from 'pinia';

export default defineComponent({
  setup() {
    const puestosStore = usePuestosStore();
    const salaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();
    const reservasStore = useReservasStore();
    const userStore = useUserStore(); // acceder a la store de usuario para su id

    // Obtener los estados del store de reservas
    const { 
      selectedSlots, 
      isReserving,
      reservationError,
      reservationSuccess,
      isSlotSelected 
    } = storeToRefs(reservasStore);

    // Obtener el estado del usuario del store de usuario
    const { user } = storeToRefs(userStore);

    // funcion para cargar los asientos si hay ID sala
    onMounted(() => {
      if (salaStore.id !== null) {
        puestosStore.obtenerPuestosDisponibles(); // para sacar
      }
    });

    // recargar puestos disponibles al cambiar los filtros
    watch(
      () => [
        salaStore.id,
        filtrosStore.fechaInicio,
        filtrosStore.fechaFin,
        filtrosStore.horaInicio,
        filtrosStore.horaFin,
      ],
      () => {
        if (salaStore.id !== null) {
          puestosStore.obtenerPuestosDisponibles();
        } else {
          puestosStore.puestosDisponibles = [];
        }
      },
      { immediate: true } // ejecutarlo al inicio
    );

    // Función para manejar los clics en los tramos horarios
    const handleSlotClick = (puesto: any, slot: any) => {
      if (!slot.estado) {
        console.warn("Tramo no disponible");
        return;
      }
      
      // Usa la función del store para gestionar la selección
      reservasStore.toggleSlotSelection(puesto, slot);
    };

    // funcion eliminar un tramo clickado
    const removeSlot = (index: number) => {
      selectedSlots.value.splice(index, 1);
    };

    // Funcion para cuando se le de a comprar
    const handleSubmit = () => {
      const description = "Reserva"; // descripcion por defecto

      // ya no se pasa el id del usuario, ya que se obtiene directamente de la store
      reservasStore.createReservation(description);
    };

    return {
      // De puestosStore
      ...storeToRefs(puestosStore),

      // De reservasStore
      selectedSlots,
      isReserving,
      reservationError,
      reservationSuccess,
      isSlotSelected,

      user,

      // Funciones
      handleSlotClick,
      removeSlot,
      handleSubmit,
      resetSelection: reservasStore.resetSelection,
    };
  },
});
</script>

<style scoped>
/* Estilos para los puestos y tramos */
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
  max-width: 80px;
  height: auto;
  margin-bottom: 10px;
  border-radius: 3px;
}

.tramos-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
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
  text-decoration: line-through;
}

/* Estilo para tramos seleccionados */
.tramo-slot.selected {
  background-color: #d4f0fd;
  border-color: #2196F3;
  color: #0d47a1;
  font-weight: bold;
}

/* Estilos para la sección de resumen */
.resumen-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.resumen-section h3 {
  margin-top: 0;
  color: #333;
}

.selected-items {
  margin: 10px 0;
}

.selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.remove-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.submit-button, .cancel-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: bold;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.success-message {
  margin-top: 10px;
  padding: 8px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
}

.error-message {
  margin-top: 10px;
  padding: 8px;
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #f44336;
}
</style>