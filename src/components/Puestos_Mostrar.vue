<template>
  <div>
    <!-- 1. Cargando… -->
    <p v-if="loading" class="loading-message">
      Cargando puestos disponibles…
    </p>

    <!-- 2. Una vez loading = false, renderizamos tantas mesas como grupos de 4 asientos -->
    <div v-else>
      <div
        v-for="(group, gi) in seatGroups"
        :key="gi"
        class="table-layout"
      >
        <!-- 2.1 Los 4 asientos alrededor de la mesa -->
        <button
          v-for="(puesto, idx) in group"
          :key="puesto.idPuestoTrabajo"
          class="square"
          :class="[
            positionClass(idx),
            {
              unavailable: puesto.disponibilidadesEnRango?.some(s => !s.estado),
              selected:   selectedPuestos.some(sp => sp.idPuestoTrabajo === puesto.idPuestoTrabajo)
            }
          ]"
          :disabled="puesto.disponibilidadesEnRango?.some(s => !s.estado)"
          @click="handlePuestoClick(puesto)"
        ></button>

        <!-- 2.2 La mesa en el centro -->
        <div class="table"></div>
      </div>

      <!-- 3. Botón Comprar general, fuera del v-for -->
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
import { defineComponent, onMounted, watch, computed } from 'vue';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';
import { useReservasStore } from '../store/reservasStore';
import { storeToRefs } from 'pinia';

// Auxiliar para dividir un array en trozos de tamaño fijo
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default defineComponent({
  name: 'PuestoSelectionAroundTable',
  setup() {
    const puestosStore  = usePuestosStore();
    const salaStore     = useSalaSeleccionadaStore();
    const filtrosStore  = useFiltrosStore();
    const reservasStore = useReservasStore();

    const { puestosDisponibles, loading } = storeToRefs(puestosStore);
    const { selectedPuestos, isReserving  } = storeToRefs(reservasStore);

    onMounted(() => {
      if (salaStore.id !== null) {
        puestosStore.obtenerPuestosDisponibles();
      }
    });

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
      { immediate: true }
    );

    function handlePuestoClick(puesto: any) {
      reservasStore.togglePuestoSelection(puesto);
    }

    function submitCompra() {
      reservasStore.createReservation('Compra de puestos');
    }

    function positionClass(index: number): string {
      return ['seat-top', 'seat-right', 'seat-bottom', 'seat-left'][index] || '';
    }

    // Agrupamos todos los puestos de 4 en 4
    const seatGroups = computed(() => chunkArray(puestosDisponibles.value, 4));

    return {
      loading,
      seatGroups,
      selectedPuestos,
      isReserving,
      handlePuestoClick,
      submitCompra,
      positionClass,
    };
  },
});
</script>

<style scoped lang="scss">
.loading-message {
  text-align: center;
  padding: 0.5em;
  font-weight: bold;
}

.table-layout {
  display: grid;
  grid-template-areas:
    ". seat-top   ."
    "seat-left table seat-right"
    ". seat-bottom .";
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto auto;
  justify-items: center;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}

.square {
  width: 30px;
  height: 30px;
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

.seat-top    { grid-area: seat-top; }
.seat-right  { grid-area: seat-right; }
.seat-bottom { grid-area: seat-bottom; }
.seat-left   { grid-area: seat-left; }

.table {
  grid-area: table;
  width: 50px;
  height: 50px;
  background: #b5651d;
  border-radius: 50%;
}

.buy-button {
  display: block;
  margin: 12px auto;
  padding: 6px 12px;
  font-size: 0.9em;
  cursor: pointer;
}

.buy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
