import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useSalaSeleccionadaStore } from './salaSeleccionadaStore';
import { useFiltrosStore } from './filtrosStore';

export const usePuestosStore = defineStore('puestos', () => {
  const puestosDisponibles = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const salaStore = useSalaSeleccionadaStore();
  const filtrosStore = useFiltrosStore();

  const idSala = computed(() => salaStore.id);
  const fechaInicio = computed(() => filtrosStore.fechaInicio);
  const fechaFin    = computed(() => filtrosStore.fechaFin);
  const horaInicio  = computed(() => filtrosStore.horaInicio);
  const horaFin     = computed(() => filtrosStore.horaFin);

  const endpoint = computed(() => {
    if (idSala.value === null) return '';
    const params = new URLSearchParams({
      idSala:      idSala.value.toString(),
      fechaInicio: fechaInicio.value,
      fechaFin:    fechaFin.value,
      horaInicio:  horaInicio.value,
      horaFin:     horaFin.value,
    });
    return `https://localhost:7179/api/puestostrabajo/disponibles?${params.toString()}`;
  });

  let abortController: AbortController | null = null;

  async function obtenerPuestosDisponibles() {
    if (!endpoint.value) {
      error.value = 'No se ha seleccionado ninguna sala.';
      puestosDisponibles.value = [];
      return;
    }

    // Cancelar la petición anterior si existe
    if (abortController) {
      abortController.abort();
    }

    // Crear nuevo controlador para esta petición
    abortController = new AbortController();
    const signal = abortController.signal;

    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(endpoint.value, { signal });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      puestosDisponibles.value = data;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        error.value = err.message;
        puestosDisponibles.value = [];
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    puestosDisponibles,
    loading,
    error,
    endpoint,
    obtenerPuestosDisponibles,
  };
});