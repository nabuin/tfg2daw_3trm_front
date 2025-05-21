<template>
  <div>
    <!-- Mensaje de carga sólo mientras loading === true -->
    <p v-if="loading" class="loading-message">Cargando puestos disponibles…</p>

    <!-- Grid y botón sólo cuando loading === false
    v-key: identificador unico

    -->
    <div v-else>
      <div class="puestos-grid">

        <!--Comprueba que el estado del asiento sea libre ocupado en base al estado de la disponibilidad-->
        <button
          v-for="puesto in puestosDisponibles"
          :key="puesto.idPuestoTrabajo"
          class="square"
          :class="{
            unavailable: puesto.disponibilidadesEnRango?.some(s => !s.estado),
            selected: selectedPuestos.some(sp => sp.idPuestoTrabajo === puesto.idPuestoTrabajo)
          }"
          :disabled="puesto.disponibilidadesEnRango?.some(s => !s.estado)"
          @click="handlePuestoClick(puesto)"
        ></button>
      </div>

      <button
        class="buy-button"
        :disabled="isReserving || selectedPuestos.length === 0"
        @click="submitCompra"
      >
        {{ isReserving ? 'Procesando...' : 'Comprar' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';
import { useReservasStore } from '../store/reservasStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'PuestoSelectionMini',
  setup() {

    //info de los store
    const puestosStore = usePuestosStore();
    const salaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();
    const reservasStore = useReservasStore();

    // sacamos loading además de puestosDisponibles
    const { puestosDisponibles, loading } = storeToRefs(puestosStore);
    const { selectedPuestos, isReserving } = storeToRefs(reservasStore);

    //hace que si existe un salaId muestre todo
    onMounted(() => {
      if (salaStore.id !== null) {
        puestosStore.obtenerPuestosDisponibles(); // aquí loading = true, luego false
      }
    });

    //Esto se encarga, de que si algunos de esos datos cambia, vuelve a hacer el fetch
    watch(
      () => [
        salaStore.id,
        filtrosStore.fechaInicio,
        filtrosStore.fechaFin,
        filtrosStore.horaInicio,
        filtrosStore.horaFin,
      ],
      async () => {
        if (salaStore.id !== null) {

          //vuelve a traer la info
          await puestosStore.obtenerPuestosDisponibles();
          //actualiza los viejos datos si tenia par amostrar los nuevos
          reservasStore.setPuestoDisponibilidades(puestosStore.puestosDisponibles);
          //limpia lo antiguo
          reservasStore.resetSelection();
        }
      },
    );

    const handlePuestoClick = (puesto: any) =>
      reservasStore.togglePuestoSelection(puesto);
    const submitCompra = () => reservasStore.createReservation();

    return {
      puestosDisponibles,
      loading,
      selectedPuestos,
      isReserving,
      handlePuestoClick,
      submitCompra,
    };
  },
});
</script>

<style scoped>
.loading-message {
  text-align: center;
  padding: 1em;
  font-weight: bold;
}

.puestos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.square {
  width: 100%;
  padding-top: 100%;
  background: #ddd;
  border: none;
  cursor: pointer;
}

.square.unavailable {
  background: red;
  cursor: not-allowed;
}

.square.selected {
  background: yellow;
}

.buy-button {
  margin-top: 16px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
}

.buy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
