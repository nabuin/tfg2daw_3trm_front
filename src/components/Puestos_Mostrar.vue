<template>
  <div>
    <!-- 1. Cargando… -->
    <p v-if="loading" class="loading-message">
      Cargando puestos disponibles…
    </p>

    <!-- 2. Renderizamos las mesas en filas de 2 por fila -->
    <div v-else>
      <div class="tables-grid">
        <div
          v-for="(group, gi) in seatGroups"
          :key="gi"
          class="table-layout"
        >
          <!-- 2.1 Los 4 asientos alrededor de la mesa rectangular -->
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

          <!-- 2.2 Mesa rectangular en el centro -->
          <div class="table"></div>
        </div>
      </div>

      <!-- 3. Botón Comprar general -->
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

// Divide un array en trozos de tamaño fijo
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

    // Mapea el índice 0–3 a la posición alrededor de la mesa
    function positionClass(index: number): string {
      return [
        'seat-left-top',
        'seat-right-top',
        'seat-left-bottom',
        'seat-right-bottom'
      ][index] || '';
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
  font-size: 0.9em;
}

/* Contenedor de mesas: 2 mesas por fila, con poco espacio entre ellas */
.tables-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

/* Layout de cada mesa + sus 4 asientos */
.table-layout {
  display: grid;
  grid-template-areas:
    "seat-left-top  table  seat-right-top"
    "seat-left-bottom table seat-right-bottom";
  grid-template-columns: auto 60px auto;
  grid-template-rows: auto  auto;
  gap: 2px;
  justify-items: center;
  align-items: center;
  padding: 4px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Asientos pequeños y muy pegados a la mesa */
.square {
  width: 20px;
  height: 20px;
  background: #ddd;
  border: none;
  cursor: pointer;
  margin: 0;
}

.square.unavailable {
  background: red;
  cursor: not-allowed;
}

.square.selected {
  background: yellow;
}

/* Posiciones alrededor de la mesa rectangular */
.seat-left-top     { grid-area: seat-left-top; }
.seat-right-top    { grid-area: seat-right-top; }
.seat-left-bottom  { grid-area: seat-left-bottom; }
.seat-right-bottom { grid-area: seat-right-bottom; }

/* Mesa rectangular centrada */
.table {
  grid-area: table;
  width: 80px;
  height: 40px;
  background: #b5651d;
  border-radius: 4px;
}

/* Botón comprar general */
.buy-button {
  display: block;
  margin: 8px auto 0;
  padding: 6px 12px;
  font-size: 0.9em;
  cursor: pointer;
}

.buy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
