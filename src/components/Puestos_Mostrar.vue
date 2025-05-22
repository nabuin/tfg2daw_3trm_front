<template>
  <div>
    <!-- 1.1 Mensaje de “Cargando…” -->
    <p v-if="loading" class="loading-message">
      Cargando puestos disponibles…
    </p>

    <!-- 1.2 Una vez loading = false, mostramos el grid y el botón Comprar -->
    <div v-else>
      <!-- 1.2.1 Grid de cuadrados -->
      <div class="puestos-grid">
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

      <!-- 1.2.2 Botón de comprar -->
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
    // 2.1 Accedemos a los stores relevantes
    const puestosStore = usePuestosStore();
    const salaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();
    const reservasStore = useReservasStore();

    // 2.2 Extraemos refs reactivas del store de puestos
    const { puestosDisponibles, loading } = storeToRefs(puestosStore);
    // 2.3 Extraemos refs del store de reservas
    const { selectedPuestos, isReserving } = storeToRefs(reservasStore);

    // 2.4 onMounted: al montar el componente, si hay salaId, llama al fetch
    onMounted(() => {
      if (salaStore.id !== null) {
        puestosStore.obtenerPuestosDisponibles();
      }
    });

    // 2.5 watch: vuelve a cargar cuando cambian sala o filtros
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
          await puestosStore.obtenerPuestosDisponibles();
          reservasStore.setPuestoDisponibilidades(puestosStore.puestosDisponibles);
          reservasStore.resetSelection();
        }
      },
      { immediate: true } // también corre en el montaje inicial
    );

    // 2.6 Función que se ejecuta al clickar un puesto
    function handlePuestoClick(puesto: any) {
      reservasStore.togglePuestoSelection(puesto);
    }

    // 2.7 Función que lanza la creación de reserva (POST)
    function submitCompra() {
      reservasStore.createReservation('Compra de puestos');
    }

    // 2.8 Exponemos al template lo que necesitamos
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
  padding-top: 100%; /* hace que el alto = ancho, creando cuadrados */
  background: #ddd;
  border: none;
  cursor: pointer;
}

.square.unavailable {
  background: red;      /* indica “ocupado” */
  cursor: not-allowed;  /* cursor de no permitido */
}

.square.selected {
  background: yellow;   /* indica “seleccionado” */
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
