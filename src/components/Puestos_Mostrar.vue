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
          <!-- 2.1 cada puesto al rededor de la mesa -->
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
            <!-- boton sin texto, solo color para estado -->
          </button>

          <!-- 2.2 la mesa en medio -->
          <div class="table"></div>
        </div>
      </div>

      <!-- 3. boton comprar general -->
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

// función para partir el array en trozos de tamaño fijo (4 en este caso)
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
    // stores para traer datos y acciones
    const puestosStore  = usePuestosStore();
    const salaStore     = useSalaSeleccionadaStore();
    const filtrosStore  = useFiltrosStore();
    const reservasStore = useReservasStore();

    // refs pa las variables reactivas
    const { puestosDisponibles, loading } = storeToRefs(puestosStore);
    const { selectedPuestos, isReserving  } = storeToRefs(reservasStore);

    // al montar el componente, pedimos los puestos si hay sala seleccionada
    onMounted(() => {
      if (salaStore.id !== null) {
        puestosStore.obtenerPuestosDisponibles();
      }
    });

    // cuando cambian filtros o sala, recargamos
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
          // actualizamos disponibilidades y reseteamos seleccion
          reservasStore.setPuestoDisponibilidades(puestosStore.puestosDisponibles);
          reservasStore.resetSelection();
        }
      },
      { immediate: true }
    );

    // al click en un puesto togglamos selección
    function handlePuestoClick(puesto: any) {
      reservasStore.togglePuestoSelection(puesto);
    }

    // al click de comprar, enviamos la reserva
    function submitCompra() {
      reservasStore.createReservation('compra de puestos');
    }

    // mapea el indice 0..3 a la clase de posición
    function positionClass(index: number): string {
      return [
        'seat-left-top',
        'seat-right-top',
        'seat-left-bottom',
        'seat-right-bottom'
      ][index] || '';
    }

    // calculo de los grupos de 4 puestos
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
/* mensaje de carga centrado */
.loading-message {
  text-align: center;
  padding: 1em;
  font-weight: 600;
  font-size: 1.1em;
  color: #555;
}

/* rejilla de 2 columnas pa mesas */
.tables-grid {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 32px 24px;       /* 32px entre filas, 24px entre columnas */
  justify-content: center;
  padding: 24px;
  border-radius: 8px;
}

/* cada mesa + sus 4 asientos */
.table-layout {
  display: grid;
  grid-template-columns: 28px 70px 28px; /* asiento, mesa, asiento */
  grid-template-rows: 28px 28px;          /* dos filas de asientos */
  gap: 12px;                              /* espacio entre filas y columnas */
  background: #ffffff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  justify-items: center;
  align-items: center;
}

/* estilo base de cada asiento */
.square {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: #d1e8e2;  /* asiento libre: verde suave */
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

/* hover pa asiento disponible */
.square:hover:not(.unavailable):not(.selected) {
  transform: scale(1.1);
  background: #b5dbce;
}

/* asiento no disponible */
.square.unavailable {
  background: #f8d7da;
  cursor: not-allowed;
}

/* asiento seleccionado */
.square.selected {
  background: #fff3b0;
  transform: scale(1.05);
}

/* colocación de cada asiento en la grid */
.seat-left-top     { grid-column: 1; grid-row: 1; }
.seat-right-top    { grid-column: 3; grid-row: 1; }
.seat-left-bottom  { grid-column: 1; grid-row: 2; }
.seat-right-bottom { grid-column: 3; grid-row: 2; }

/* estilo de la mesa en medio */
.table {
  margin: 0;
  grid-column: 2;
  grid-row: 1 / span 2;
  width: 70px;
  height: 56px;
  background: #c8e1ff;  /* mesa: azul pastel */
  border-radius: 6px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

/* boton comprar al final */
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

/* hover boton comprar */
.buy-button:hover:not(:disabled) {
  background: #b3e5fc;
  transform: translateY(-2px);
}

/* boton desabilitado */
.buy-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
