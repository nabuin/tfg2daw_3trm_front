import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useSalaSeleccionadaStore } from './salaSeleccionadaStore';
import { useFiltrosStore } from './filtrosStore';

export const usePuestosStore = defineStore('puestos', () => {
  const puestosDisponibles = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Para almacenar el controlador de la solicitud activa
  let currentController = null;

  const salaStore = useSalaSeleccionadaStore();
  const filtrosStore = useFiltrosStore();

  const idSala = computed(() => salaStore.id);
  const fechaInicio = computed(() => filtrosStore.fechaInicio);
  const fechaFin    = computed(() => filtrosStore.fechaFin);
  const horaInicio  = computed(() => filtrosStore.horaInicio);
  const horaFin     = computed(() => filtrosStore.horaFin);

  // Computed endpoint URL con todos los parámetros de consulta
  const endpoint = computed(() => {
    if (idSala.value === null) return '';
    const params = new URLSearchParams({
      idSala:      idSala.value.toString(),
      fechaInicio: fechaInicio.value,
      fechaFin:    fechaFin.value,
      horaInicio:  horaInicio.value,
      horaFin:     horaFin.value,
    });
    return `https://coworkingapi.jblas.me/api/puestostrabajo/disponibles?${params.toString()}`;
  });

  // Función para obtener los puestos disponibles
  async function obtenerPuestosDisponibles() {
    if (!endpoint.value) {
      error.value = 'No se ha seleccionado ninguna sala.';
      puestosDisponibles.value = [];
      return;
    }

    // Si ya hay una solicitud en curso, cancelarla
    if (currentController) {
      currentController.abort();
    }

    // Crear un nuevo controlador para la nueva solicitud
    const controller = new AbortController();
    currentController = controller;

    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(endpoint.value, { signal: controller.signal });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      puestosDisponibles.value = data;
    } catch (err: any) {
      // Si el error es debido a la cancelación, no se muestra
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
