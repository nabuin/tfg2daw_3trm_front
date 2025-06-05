import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSedeSeleccionadaStore } from './sedeSeleccionadaStore';

export const useSalasStore = defineStore('salas', () => {
  const salasDisponibles = ref<any[]>([]);
  const error             = ref<string | null>(null);
  const loading           = ref(false);

  const sedeSeleccionadaStore = useSedeSeleccionadaStore();

  async function obtenerSalasDisponibles(filtros?: {
    fechaInicio?: string;
    fechaFin?:    string;
    horaInicio?:  string;
    horaFin?:     string;
  }) {
    if (!sedeSeleccionadaStore.id) {
      error.value = 'No se ha seleccionado ninguna sede';
      salasDisponibles.value = [];
      return;
    }

    // 1. Intentar cargar las fechas desde localStorage
    const storedFechaInicio = localStorage.getItem('filtroFechaInicio');
    const storedFechaFin = localStorage.getItem('filtroFechaFin');
    const storedHoraInicio = localStorage.getItem('filtroHoraInicio');
    const storedHoraFin = localStorage.getItem('filtroHoraFin');

    // 2. Si no hay fechas en localStorage, asignamos el día siguiente como predeterminado
    const today = new Date();
    today.setDate(today.getDate() + 1); // Día siguiente
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = today.getFullYear();
    const month = pad(today.getMonth() + 1);
    const day   = pad(today.getDate());
    const currentDate = `${year}-${month}-${day}`;

    // Usar las fechas de localStorage si existen, sino usar las predeterminadas
    const fechaInicio = storedFechaInicio || currentDate;
    const fechaFin    = storedFechaFin || currentDate;
    const horaInicio  = storedHoraInicio || '08:00';  // Valor predeterminado
    const horaFin     = storedHoraFin || '19:00';    // Valor predeterminado

    // 3. Guardar las fechas en localStorage para futuras consultas
    localStorage.setItem('filtroFechaInicio', fechaInicio);
    localStorage.setItem('filtroFechaFin', fechaFin);
    localStorage.setItem('filtroHoraInicio', horaInicio);
    localStorage.setItem('filtroHoraFin', horaFin);

    const params = new URLSearchParams({
      idSede:       sedeSeleccionadaStore.id.toString(),
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
    });

    const url = `https://coworking.jblas.me/api/salas/getsalasdisponibles?${params}`;
    console.log('Llamando al endpoint:', url);

    try {
      loading.value = true;
      error.value = null;

      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.statusText}`);

      const data = await resp.json();
      if (!data || data.length === 0) {
        error.value = 'No se encontraron salas disponibles';
        salasDisponibles.value = [];
      } else {
        salasDisponibles.value = data;
      }
    } catch (e) {
      error.value = (e as Error).message;
      salasDisponibles.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    salasDisponibles,
    error,
    loading,
    obtenerSalasDisponibles,
  };
});
