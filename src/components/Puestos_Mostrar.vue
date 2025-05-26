<template>
  <div>
    <!-- 1. cargando… -->
    <p v-if="loading" class="loading-message">
      cargando puestos disponibles…
    </p>

    <!-- 2. cuando ya cargó, pintamos las mesas en filas de 2 -->
    <div v-else>
      <div class="tables-grid">
        <!-- para cada grupo de 4 puestos hacemos un bloque -->
        <div
          v-for="(group, gi) in seatGroups"
          :key="gi"
          class="table-layout"
        >
          <!-- 2.1 cada puesto: botón con imagen de silla -->
          <button
            v-for="(puesto, idx) in group"
            :key="puesto.idPuestoTrabajo"
            class="square"
            :class="[ positionClass(idx), {
              unavailable: puesto.disponibilidadesEnRango?.some(s => !s.estado),
              selected:   selectedPuestos.some(sp => sp.idPuestoTrabajo === puesto.idPuestoTrabajo)
            }]"
            :disabled="puesto.disponibilidadesEnRango?.some(s => !s.estado)"
            @click="handlePuestoClick(puesto)"
          >
            <img
              src="../imgs/svg/silla.svg"
              alt="silla"
              class="icon silla-icon"
            />
          </button>

          <!-- 2.2 la mesa en medio: div que carga la imagen -->
          <div class="table">
            <img
              src="../imgs/svg/mesa.svg"
              alt="mesa"
              class="icon mesa-icon"
            />
          </div>
        </div>
      </div>

      <!-- 3. botón comprar general -->
      <button
        class="buy-button"
        :disabled="isReserving || selectedPuestos.length === 0"
        @click="submitCompra"
      >
        {{ isReserving ? 'procesando...' : 'comprar' }}
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
      reservasStore.createReservation('compra de puestos');
    }

    function positionClass(index: number): string {
      return [
        'seat-left-top',
        'seat-right-top',
        'seat-left-bottom',
        'seat-right-bottom'
      ][index] || '';
    }

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
  padding: 1em;
  font-weight: 600;
  font-size: 1.1em;
  color: #555;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 32px 24px;
  justify-content: center;
  padding: 24px;
  border-radius: 8px;
}

/* contenedor de mesa + sillas */
.table-layout {
  display: grid;
  grid-template-columns: 28px 70px 28px;
  grid-template-rows: 28px 28px;
  gap: 12px;
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  justify-items: center;
  align-items: center;
}

/* botón base de asiento */
.square {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

/* la imagen de silla dentro del botón */
.silla-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s, opacity 0.2s;
}
.square:hover .silla-icon:not(.unavailable) {
  transform: scale(1.1);
}
.square.unavailable .silla-icon {
  opacity: 0.4;
}

/* mesa SVG */
.mesa-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* clases de posición para colocar sillas */
.seat-left-top     { grid-column: 1; grid-row: 1; }
.seat-right-top    { grid-column: 3; grid-row: 1; }
.seat-left-bottom  { grid-column: 1; grid-row: 2; }
.seat-right-bottom { grid-column: 3; grid-row: 2; }

/* la celda central es la mesa */
.table {
  grid-column: 2;
  grid-row: 1 / span 2;
  width: 70px;
  height: 56px;
}

/* botón comprar */
.buy-button {
  display: block;
  margin: 36px auto 0;
  padding: 14px 36px;
  font-size: 1.1em;
  font-weight: 600;
  color: #21618c;
  background: #e1f5fe;
  border: 1px solid #81d4fa;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}
.buy-button:hover:not(:disabled) {
  background: #b3e5fc;
  transform: translateY(-2px);
}
.buy-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
