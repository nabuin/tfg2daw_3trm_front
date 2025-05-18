<template>
  <div>
    <div class="form-width">
      <form @submit.prevent="buscarSalas" class="filtro-form">
        <!-- Fecha Inicio -->
        <div class="form-group">
          <label for="fechaInicio" class="form-label">Fecha Inicio:</label>
          <input
            type="date"
            id="fechaInicio"
            v-model="fechaInicio"
            required
            :min="hoyStr"
            class="form-input form-input-date"
          />
        </div>

        <!-- Fecha Fin -->
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

        <!-- Hora Inicio -->
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
          <button type="submit" class="btn btn-primary">Filtrar</button>
        </div>
      </form>
    </div>

    <ul v-if="salasDisponibles.length > 0">
      <li v-for="sala in salasDisponibles" :key="sala.idSala">
        {{ sala.nombre }} - Capacidad: {{ sala.capacidad }}
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useSalasStore } from '../store/salasStore';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';

export default defineComponent({
  setup() {
    const { salasDisponibles, error, loading, obtenerSalasDisponibles } = useSalasStore();
    const { id: sedeId } = useSedeSeleccionadaStore();

    // Fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const hoyStr = `${yyyy}-${mm}-${dd}`;

    // Modelos reactivos de fecha y hora
    const fechaInicio = ref(hoyStr);
    const fechaFin = ref(hoyStr);

    const horas = ref<string[]>([]);
    const generarHoras = () => {
      const arr: string[] = [];
      for (let h = 8; h <= 19; h++) {
        const hh = String(h).padStart(2, '0');
        arr.push(`${hh}:00`);
      }
      horas.value = arr;
    };
    generarHoras();

    // Valores por defecto de las horas
    const horaInicio = ref(horas.value[0]);
    const horaFin = ref(horas.value[horas.value.length - 1]);

    // Opciones dinámicas para horaFin cuando es el mismo día
    const horasFin = computed(() => {
      if (fechaInicio.value === fechaFin.value && horaInicio.value) {
        return horas.value.filter(h => h > horaInicio.value);
      }
      return horas.value;
    });

    // Si cambia fecha/hora y horaFin ya no es válida, la reseteamos
    watch(
      [fechaInicio, fechaFin, horaInicio],
      () => {
        if (
          fechaInicio.value === fechaFin.value &&
          horaFin.value &&
          horaFin.value <= horaInicio.value
        ) {
          horaFin.value = horasFin.value[horasFin.value.length - 1] || '';
        }
      }
    );

    const buscarSalas = async () => {
      if (fechaFin.value < fechaInicio.value) {
        alert('La fecha fin no puede ser anterior a la fecha inicio.');
        return;
      }
      if (
        fechaInicio.value === fechaFin.value &&
        horaFin.value <= horaInicio.value
      ) {
        alert('Si fecha inicio y fin son iguales, la hora fin debe ser mayor.');
        return;
      }

      await obtenerSalasDisponibles({
        fechaInicio: fechaInicio.value,
        fechaFin: fechaFin.value,
        horaInicio: horaInicio.value,
        horaFin: horaFin.value,
        sedeId
      });
    };

    return {
      salasDisponibles,
      error,
      loading,
      buscarSalas,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      horas,
      horasFin,
      hoyStr
    };
  }
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

    &:focus {
      outline: none;
      border-color: #007bff;
    }

    &-date {
      color: white;

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
    background: black;
    cursor: pointer;
    color: white;
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

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>
