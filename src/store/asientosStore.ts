
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

  // Computed endpoint URL with all query params
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

  async function obtenerPuestosDisponibles() {
    if (!endpoint.value) {
      error.value = 'No se ha seleccionado ninguna sala.';
      puestosDisponibles.value = [];
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(endpoint.value);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      console.log(" Puestos disponibles recibidos:", data); // <--- LOG AQUÍ

      puestosDisponibles.value = data;
    } catch (err: any) {
      error.value = err.message;
      puestosDisponibles.value = [];
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
