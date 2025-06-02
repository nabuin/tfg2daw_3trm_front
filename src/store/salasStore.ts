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

    loading.value = true;
    error.value   = null;

    const idSede = sedeSeleccionadaStore.id;
    const today  = new Date();
    today.setDate(today.getDate() + 1);

    const pad = (n: number) => String(n).padStart(2, '0');
    const year = today.getFullYear();
    const month = pad(today.getMonth() + 1);
    const day   = pad(today.getDate());
    const currentDate = `${year}-${month}-${day}`;

    const params = new URLSearchParams({
      idSede:       idSede.toString(),
      fechaInicio:  filtros?.fechaInicio || currentDate,
      fechaFin:     filtros?.fechaFin    || currentDate,
      horaInicio:   filtros?.horaInicio  || '08:00',
      horaFin:      filtros?.horaFin     || '19:00',
    });

    const url = `https://localhost:7179/api/salas/getsalasdisponibles?${params}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Error en la solicitud');
      const data = await resp.json();
      salasDisponibles.value = data;
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
