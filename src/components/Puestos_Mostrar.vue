<template>
  <div>
    <!-- 1. cargando… -->
    <p v-if="loading" class="loading-message">
      cargando puestos disponibles…
    </p>

    <!-- 2. cuando ya cargó, pintamos las mesas en filas de 3 -->
    <div v-else>
      <div class="tables-grid">
        <!-- para cada grupo de 4 puestos hacemos un bloque -->
        <div
          v-for="(group, gi) in seatGroups"
          :key="gi"
          class="table-layout"
        >
          <!-- 2.1 cada puesto: botón con SVG inline de silla -->
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
          >
            <svg
              class="silla-icon"
              width="50" height="50"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g class="chair-wheels">
                <circle cx="60" cy="95" r="5"/>
                <circle cx="35" cy="75" r="5"/>
                <circle cx="85" cy="75" r="5"/>
                <circle cx="25" cy="45" r="5"/>
                <circle cx="95" cy="45" r="5"/>
              </g>
              <rect class="chair-seat" x="30" y="30" width="60" height="50" rx="8" ry="8"/>
              <rect class="chair-back"  x="35" y="15" width="50" height="15" rx="7" ry="7"/>
            </svg>
          </button>

          <!-- 2.2 la mesa en medio: SVG inline de mesa -->
          <div class="table">
            <svg
              class="mesa-icon"
              width="120" height="130"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Ajusta el alto de la mesa modificando el atributo height -->
              <rect x="20" y="20" width="80" height="100" rx="6" ry="6"/>
            </svg>
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
          reservasStore.setPuestoDisponibilidades(puestosDisponibles.value);
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

    // Agrupamos de 4 en 4 pero la UI controla número por fila
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
  grid-template-columns: repeat(3, max-content); // 3 columnas por defecto
  gap: 48px 32px;
  justify-content: center;
  padding: 32px;
  border-radius: 8px;
}

/* Centro si es único en la última fila */
.tables-grid > .table-layout:last-child:nth-child(3n+1) {
  grid-column: 2;
}

/* Responsive: 2 columnas hasta 900px */
@media (max-width: 900px) {
  .tables-grid {
    grid-template-columns: repeat(2, max-content);
  }
}

/* Responsive: 1 columna hasta 600px */
@media (max-width: 600px) {
  .tables-grid {
    grid-template-columns: 1fr;
  }
}

.table-layout {
  display: grid;
  grid-template-columns: 50px 120px 50px;
  grid-template-rows: 50px 50px;
  gap: 16px;
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  justify-items: center;
  align-items: center;
}

.square {
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.silla-icon {
  width: 100%;
  height: 100%;
}

/* estilos del SVG internos */
.silla-icon .chair-wheels circle {
  fill: #000;
  stroke: #000;
  stroke-width: 4;
}
.silla-icon .chair-seat,
.silla-icon .chair-back {
  fill: #fff;
  stroke: #000;
  stroke-width: 4;
}

/* ocupados: rojo */
.square.unavailable .silla-icon .chair-seat,
.square.unavailable .silla-icon .chair-back {
  fill: #ff0000;
}

/* seleccionados: amarillo */
.square.selected .silla-icon .chair-seat,
.square.selected .silla-icon .chair-back {
  fill: #ffff00;
}

/* mesa SVG */
.table .mesa-icon rect {
  fill: #ddd;
  stroke: #333;
  stroke-width: 2;
}

.seat-left-top     { grid-column: 1; grid-row: 1; }
.seat-right-top    { grid-column: 3; grid-row: 1; }
.seat-left-bottom  { grid-column: 1; grid-row: 2; }
.seat-right-bottom { grid-column: 3; grid-row: 2; }

.table {
  grid-column: 2;
  grid-row: 1 / span 2;
}

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
