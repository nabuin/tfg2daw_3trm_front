<template>
  <div>
    <div class="filtro__contenedor">
      <form @submit.prevent="filtrar" class="filtro__formulario">
        <div class="filtro__grupo">
          <label for="fechaInicio" class="filtro__label">Fecha Inicio:</label>
          <input type="date" id="fechaInicio" v-model="fechaInicio" required :min="fechaMinima"
            class="filtro__input filtro__input--date" />
        </div>

        <div class="filtro__grupo">
          <label for="fechaFin" class="filtro__label">Fecha Fin:</label>
          <input type="date" id="fechaFin" v-model="fechaFin" required :min="fechaInicio"
            class="filtro__input filtro__input--date" />
        </div>

        <div class="filtro__grupo">
          <label for="horaInicio" class="filtro__label">Hora Inicio:</label>
          <select id="horaInicio" v-model="horaInicio" required class="filtro__select">
            <option disabled value="">Selecciona hora</option>
            <option v-for="hora in horas" :key="hora" :value="hora">
              {{ hora }}
            </option>
          </select>
        </div>

        <div class="filtro__grupo">
          <label for="horaFin" class="filtro__label">Hora Fin:</label>
          <select id="horaFin" v-model="horaFin" required class="filtro__select">
            <option disabled value="">Selecciona hora</option>
            <option v-for="hora in horasFin" :key="hora" :value="hora">
              {{ hora }}
            </option>
          </select>
        </div>

        <div class="filtro__grupo filtro__grupo--boton">
          <button type="submit" class="filtro__boton filtro__boton--primario">
            Filtrar
          </button>
        </div>
      </form>
    </div>

    <div v-if="mensajeError" class="filtro__mensaje filtro__mensaje--error">
      {{ mensajeError }}
    </div>

    <div v-if="showUpdated" class="filtro__mensaje filtro__mensaje--ok">
      Actualizado
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useSalasStore } from '../store/salasStore';
import { useFiltrosStore } from '../store/filtrosStore';

export default defineComponent({
  setup() {
    const salasStore = useSalasStore();
    const filtrosStore = useFiltrosStore();

    const pad = (n: number) => String(n).padStart(2, '0');
    const toDateStr = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const esFinDeSemana = (dateStr: string) => {
      const day = new Date(dateStr).getDay();
      return day === 6 || day === 0;
    };

    const getSiguienteHabil = (dateStr: string): string => {
      const d = new Date(dateStr);
      while (d.getDay() === 6 || d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
      }
      return toDateStr(d);
    };

    const hoy = new Date();
    const primerDiaDisponible = getSiguienteHabil(
      toDateStr(new Date(hoy.setDate(hoy.getDate() + 1)))
    );

    const fechaMinima = primerDiaDisponible;
    const fechaInicio = ref(primerDiaDisponible);
    const fechaFin = ref(primerDiaDisponible);
    const mensajeError = ref('');

    const horas = ref<string[]>([]);
    const generarHoras = () => {
      const arr: string[] = [];
      for (let h = 8; h <= 19; h++) {
        arr.push(`${pad(h)}:00`);
      }
      horas.value = arr;
    };
    generarHoras();

    const horaInicio = ref('08:00');
    const horaFin = ref('19:00');

    const horasFin = computed(() => {
      if (fechaInicio.value === fechaFin.value) {
        return horas.value.filter(h => h > horaInicio.value);
      }
      return horas.value;
    });

    const showUpdated = ref(false);

    // Al cambiar cualquier filtro, actualizamos localStorage
    const actualizarLocalStorage = () => {
      localStorage.setItem('filtroFechaInicio', fechaInicio.value);
      localStorage.setItem('filtroFechaFin', fechaFin.value);
      localStorage.setItem('filtroHoraInicio', horaInicio.value);
      localStorage.setItem('filtroHoraFin', horaFin.value);
    };

    // Manejo de los cambios en los filtros
    watch([fechaInicio, fechaFin], ([nuevaInicio, nuevaFin]) => {
      if (esFinDeSemana(nuevaInicio)) {
        fechaInicio.value = getSiguienteHabil(nuevaInicio);
      }
      if (esFinDeSemana(nuevaFin)) {
        fechaFin.value = getSiguienteHabil(nuevaFin);
      }
      actualizarLocalStorage();
    });

    watch([horaInicio, horaFin], () => {
      actualizarLocalStorage();
    });


    // Función para el filtrado
    const filtrar = async (showMsg = true) => {
      // Aseguramos que la fecha fin no sea anterior a la fecha inicio
      if (fechaFin.value < fechaInicio.value) {
        mensajeError.value = 'La fecha fin no puede ser anterior a la fecha inicio.';
        return;
      }

      // Guardamos los filtros en localStorage
      actualizarLocalStorage();

      // Actualizamos los filtros en el store
      filtrosStore.setFiltros({
        fechaInicio: fechaInicio.value,
        fechaFin: fechaFin.value,
        horaInicio: horaInicio.value,
        horaFin: horaFin.value,
      });

      // Realizamos el fetch para obtener las salas con los filtros correctos
      await salasStore.obtenerSalasDisponibles({
        fechaInicio: fechaInicio.value,
        fechaFin: fechaFin.value,
        horaInicio: horaInicio.value,
        horaFin: horaFin.value,
      });

      // Mostrar mensaje de éxito si es necesario
      if (showMsg) {
        showUpdated.value = true;
        setTimeout(() => {
          showUpdated.value = false;
        }, 2000);
      }
    };

    onMounted(() => {
      const storedFechaInicio = localStorage.getItem('filtroFechaInicio');
      const storedFechaFin = localStorage.getItem('filtroFechaFin');
      const storedHoraInicio = localStorage.getItem('filtroHoraInicio');
      const storedHoraFin = localStorage.getItem('filtroHoraFin');

      if (storedFechaInicio) {
        fechaInicio.value = esFinDeSemana(storedFechaInicio)
          ? getSiguienteHabil(storedFechaInicio)
          : storedFechaInicio;
      }

      if (storedFechaFin) {
        fechaFin.value = esFinDeSemana(storedFechaFin)
          ? getSiguienteHabil(storedFechaFin)
          : storedFechaFin;
      }

      if (storedHoraInicio) horaInicio.value = storedHoraInicio;
      if (storedHoraFin) horaFin.value = storedHoraFin;

      filtrar(false);
    });


    return {
      fechaMinima,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      horas,
      horasFin,
      filtrar,
      showUpdated,
      salasDisponibles: salasStore.salasDisponibles,
      mensajeError,
    };
  },
});
</script>

<style scoped lang="scss">
.filtro__contenedor {
  display: flex;
  background-color: #234b59;
  padding-bottom: 15px;
}

.filtro__formulario {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  gap: 0 1rem;
  font-family: Arial, sans-serif;

  .filtro__grupo {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    &--boton {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }
  }

  .filtro__label {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: white;
  }

  .filtro__input,
  .filtro__select {
    padding: 0.4rem 0.5rem;
    font-size: 1rem;
    border: 1px solid #aaa;
    border-radius: 4px;
    transition: border-color 0.3s ease;
    background: transparent;
    color: white;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  .filtro__input--date {
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      filter: brightness(0) invert(1);
      transition: filter 0.3s ease;
    }

    &:hover::-webkit-calendar-picker-indicator {
      filter: brightness(0) invert(1) opacity(0.8);
    }
  }

  .filtro__boton {
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &--primario {
      background-color: #007bff;
      color: white;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #0056b3;
      }
    }
  }

  option {
    background-color: black;
    color: white;
  }
}

.filtro__mensaje {
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-align: center;

  &--ok {
    background: #28a745;
    color: white;
    max-width: 200px;
  }

  &--error {
    background: #dc3545;
    color: white;
    max-width: 300px;
  }
}

@media (max-width: 900px) {
  .filtro__contenedor {
    flex-direction: column;
    align-items: center;
    padding-bottom: 1rem;
  }

  .filtro__formulario {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    width: 100%;
    padding: 0 1rem;
    margin: 0;

    .filtro__grupo {
      margin-top: 0.5rem;
    }

    .filtro__grupo--boton {
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }

    .filtro__input,
    .filtro__select,
    .filtro__boton {
      width: 100%;
    }

    .filtro__boton--primario {
      padding: 0.75rem;
    }
  }
}

@media (max-width: 600px) {
  .filtro__formulario {
    grid-template-columns: 1fr;
    gap: 0.5rem;

    .filtro__grupo {
      margin-top: 0.5rem;
    }

    .filtro__grupo--boton {
      margin-top: 0.75rem;
    }
  }
}
</style>
