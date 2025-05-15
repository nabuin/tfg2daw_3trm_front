import { ref } from 'vue';
import { useSedeSeleccionadaStore } from './sedeSeleccionadaStore';

export function useSalasStore() {
  const salasDisponibles = ref<any[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const sedeSeleccionadaStore = useSedeSeleccionadaStore();

  const obtenerSalasDisponibles = async () => {
    if (!sedeSeleccionadaStore.id) {
      error.value = 'No se ha seleccionado ninguna sede';
      salasDisponibles.value = [];
      return;
    }

    loading.value = true;
    error.value = null;

    const idSede = sedeSeleccionadaStore.id;

    const params = new URLSearchParams({
      idSede: idSede.toString(),
      fechaInicio: '2024-05-20',
      fechaFin: '2025-05-22',
      horaInicio: '08:00',
      horaFin: '18:00',
    });

    const url = `https://localhost:7179/api/salas/getsalasdisponibles?${params.toString()}`;

    console.log('Llamando al endpoint:', url);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en la solicitud');

      const data = await response.json();

      console.log('Respuesta API salas:', data);

      salasDisponibles.value = data;
    } catch (err) {
      error.value = (err as Error).message;
      salasDisponibles.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    salasDisponibles,
    error,
    loading,
    obtenerSalasDisponibles,
  };
}
