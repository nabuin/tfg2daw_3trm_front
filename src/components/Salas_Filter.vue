<template>
  <div>
    <div class="form-width">
      <form @submit.prevent="buscarSalas" class="filtro-form">
        <div class="form-group">
          <label for="fechaInicio" class="form-label">Fecha Inicio (dd/mm/aaaa):</label>
          <input
            type="date"
            id="fechaInicio"
            v-model="fechaInicio"
            required
            :max="fechaFin || null"
            class="form-input form-input-date"
          />
        </div>
    
        <div class="form-group">
          <label for="fechaFin" class="form-label">Fecha Fin (dd/mm/aaaa):</label>
          <input
            type="date"
            id="fechaFin"
            v-model="fechaFin"
            required
            :min="fechaInicio || null"
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
            <option v-for="hora in horas" :key="hora" :value="hora">{{ hora }}</option>
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
            <option v-for="hora in horas" :key="hora" :value="hora">{{ hora }}</option>
          </select>
        </div>
    
        <div class="form-group form-group-button">
          <button type="submit" class="btn btn-primary">Filtrar</button>
        </div>
      </form>
    </div>

    <p>ID Sede actual: {{ idSeleccionada }}</p>
    
    <div v-if="loading">Cargando...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    <div v-if="!loading && salasDisponibles.length === 0 && !error">
      No hay salas disponibles para esa búsqueda.
    </div>
    
    <ul v-if="salasDisponibles.length > 0">
      <li v-for="sala in salasDisponibles" :key="sala.idSala">
        {{ sala.nombre }} - Capacidad: {{ sala.capacidad }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useSalasStore } from '../store/salasStore';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';

export default defineComponent({
  setup() {
    const { salasDisponibles, error, loading, obtenerSalasDisponibles } = useSalasStore();
    const sedeSeleccionadaStore = useSedeSeleccionadaStore(); // store con el id de la sede elegida
    
    // Datos para el filtro de fechas y horas
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const hoyStr = `${yyyy}-${mm}-${dd}`; // fecha actual con el formato que acepta la api

    const fechaInicio = ref(hoyStr); // datos por default, el dia de hoy
    const fechaFin = ref(hoyStr);  // datos por default, el dia de hoy
    const horaInicio = ref(""); // hora de inicio seleccionada, inicializada en null
    const horaFin = ref(""); // hora de fin seleccionada, inicializada en null
    const horas = ref([]);
    
    // crear horas dinánicamente
 const generarHoras = () => {
  const horasArray = []; // Array donde se guardarán las horas
  for (let h = 8; h < 19; h++) { // desde 08 hasta 19, que son los tramos horarios definidos en la bbdd
    const hh = String(h).padStart(2, "0"); // Convierte a string con dos digidos y el 0 primero si es solo 1, ejemplo: si es 3 será 03, si es 12 seguirá siendo 12
    horasArray.push(`${hh}:00`); // Solo agrega horas exactas, ya que los tramos horarios predefinidos son de horas puntas
  }

      horas.value = horasArray;
    };
    
    // Inicializar las horas
    generarHoras();
    
    const buscarSalas = async () => {
      // Validar que la fecha inicio no sea posterior a la final
      if (fechaFin.value < fechaInicio.value) {
        alert("La fecha fin no puede ser anterior a la fecha inicio.");
        return;
      }
      // si es el mismo dia la fecha de inicio y fin, se validan que la hora de comienzo sea menor q la de fin
      if (fechaInicio.value === fechaFin.value && horaFin.value <= horaInicio.value) {
        alert(
          "Si la fecha inicio y fecha fin son iguales, la hora fin debe ser mayor que la hora inicio."
        );
        return;
      }
      
      // Llamar a la funcion del store con los datos escogidos en la web
      await obtenerSalasDisponibles({
        fechaInicio: fechaInicio.value,
        fechaFin: fechaFin.value,
        horaInicio: horaInicio.value,
        horaFin: horaFin.value
      });
      
      console.log('Salas cargadas:', salasDisponibles.value); // debug
    };

    const idSeleccionada = computed(() => sedeSeleccionadaStore.id); // obtener el id de la sede de su store

      // return de toda la data necesaria
    return {
      salasDisponibles,
      error,
      loading,
      buscarSalas,
      idSeleccionada,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      horas
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
  