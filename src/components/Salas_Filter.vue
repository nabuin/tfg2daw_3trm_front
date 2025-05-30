<template>
  <div>
    <div class="form-width">
      <form @submit.prevent="filtrar" class="filtro-form">
        <div class="form-group">
          <label for="fechaInicio" class="form-label">Fecha Inicio:</label>
          <input
            type="date"
            id="fechaInicio"
            v-model="fechaInicio"
            required
            :min="fechaMinima"
            class="form-input form-input-date"
          />
        </div>

        <div class="form-group">
          <label for="fechaFin" class="form-label">Fecha Fin:</label>
          <input
            type="date"
            id="fechaFin"
            v-model="fechaFin"
            required
            :min="fechaInicio"
            class="form-input form-input-date"
          />
        </div>

        <div class="form-group">
          <label for="horaInicio" class="form-label">Hora Inicio:</label>
          <select
            id="horaInicio"
            v-model="horaInicio"
            required
            class="form-input form-select"
          >
            <option disabled value="">Selecciona hora</option>
            <option v-for="hora in horas" :key="hora" :value="hora">
              {{ hora }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="horaFin" class="form-label">Hora Fin:</label>
          <select
            id="horaFin"
            v-model="horaFin"
            required
            class="form-input form-select"
          >
            <option disabled value="">Selecciona hora</option>
            <option v-for="hora in horasFin" :key="hora" :value="hora">
              {{ hora }}
            </option>
          </select>
        </div>

        <div class="form-group form-group-button">
          <button type="submit" class="btn btn-primary">
            Filtrar
          </button>
        </div>
      </form>
    </div>

    <!-- Mensaje de error -->
    <div v-if="mensajeError" class="mensaje error">
      {{ mensajeError }}
    </div>

    <!-- Mensaje de “Actualizado” -->
    <div v-if="showUpdated" class="mensaje actualizado">
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
    const salasStore   = useSalasStore();
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
    const fechaFin    = ref(primerDiaDisponible);
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
    const horaFin    = ref('19:00');

    const horasFin = computed(() => {
      if (fechaInicio.value === fechaFin.value) {
        return horas.value.filter(h => h > horaInicio.value);
      }
      return horas.value;
    });

    const showUpdated = ref(false);

    watch(fechaInicio, (nv) => {
      if (esFinDeSemana(nv)) {
        mensajeError.value = 'No se puede elegir sábados ni domingos. Se ajustará al siguiente día hábil.';
        setTimeout(() => (mensajeError.value = ''), 4000);
        fechaInicio.value = getSiguienteHabil(nv);
      }
      if (fechaFin.value < fechaInicio.value) {
        fechaFin.value = fechaInicio.value;
      }
    });

    watch(fechaFin, (nv) => {
      if (esFinDeSemana(nv)) {
        mensajeError.value = 'No se puede elegir sábados ni domingos. Se ajustará al siguiente día hábil.';
        setTimeout(() => (mensajeError.value = ''), 4000);
        fechaFin.value = getSiguienteHabil(nv);
      }
    });

    watch([fechaInicio, fechaFin, horaInicio], () => {
      if (
        fechaInicio.value === fechaFin.value &&
        horaFin.value <= horaInicio.value
      ) {
        horaFin.value = horasFin.value[horasFin.value.length - 1] || '';
      }
    });

    const filtrar = async (showMsg = true) => {
      if (fechaFin.value < fechaInicio.value) {
        mensajeError.value = 'La fecha fin no puede ser anterior a la fecha inicio.';
        return;
      }
      if (
        fechaInicio.value === fechaFin.value &&
        horaFin.value <= horaInicio.value
      ) {
        mensajeError.value = 'Si fecha inicio y fin son iguales, la hora fin debe ser mayor.';
        return;
      }

      filtrosStore.setFiltros({
        fechaInicio: fechaInicio.value,
        fechaFin:    fechaFin.value,
        horaInicio:  horaInicio.value,
        horaFin:     horaFin.value,
      });

      await salasStore.obtenerSalasDisponibles({
        fechaInicio: fechaInicio.value,
        fechaFin:    fechaFin.value,
        horaInicio:  horaInicio.value,
        horaFin:     horaFin.value,
      });

      if (showMsg) {
        showUpdated.value = true;
        setTimeout(() => {
          showUpdated.value = false;
        }, 2000);
      }
    };

    onMounted(() => {
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
.form-width {
  display: flex;
  background-color: black;
  padding-bottom: 15px;
}

.filtro-form {
  margin: 0 auto;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: row;
  gap: 0 1rem;

  .form-group {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    &-button {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }
  }

  .form-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: white;
  }

  .form-input {
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

    &-date {
      &::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: brightness(0) invert(1);
        transition: filter 0.3s ease;
      }
      &:hover::-webkit-calendar-picker-indicator {
        filter: brightness(0) invert(1) opacity(0.8);
      }
    }
  }

  .form-select {
    appearance: none;
    background: transparent;
    cursor: pointer;
    color: white;
    padding: 0.4rem 0.5rem;
    font-size: 1rem;
    border: 1px solid #aaa;
    border-radius: 4px;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  .btn {
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &-primary {
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

.mensaje.actualizado {
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border-radius: 4px;
  text-align: center;
  max-width: 200px;
}

.mensaje.error {
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border-radius: 4px;
  text-align: center;
  max-width: 300px;
}

@media (max-width: 900px) {
  .form-width {
    flex-direction: column;
    align-items: center;
    padding-bottom: 1rem;
  }

  .filtro-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    width: 100%;
    padding: 0 1rem;
    margin: 0;

    .form-group {
      margin-top: 0.5rem;
    }

    .form-group-button {
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }

    .form-input,
    .form-select,
    .btn {
      width: 100%;
    }

    .btn-primary {
      padding: 0.75rem;
    }
  }
}

@media (max-width: 600px) {
  .filtro-form {
    grid-template-columns: 1fr;
    gap: 0.5rem;

    .form-group {
      margin-top: 0.5rem;
    }

    .form-group-button {
      margin-top: 0.75rem;
    }
  }
}
</style>
