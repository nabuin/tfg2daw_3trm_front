// src/store/salasStore.ts
import { ref } from 'vue';
import { useSedeSeleccionadaStore } from './sedeSeleccionadaStore';

export function useSalasStore() {
  const salasDisponibles = ref<any[]>([]); // almacenar las salas que da la API
  const error = ref<string | null>(null);
  const loading = ref(false);

  const sedeSeleccionadaStore = useSedeSeleccionadaStore(); // para acceder al id de la sede elegida

  const obtenerSalasDisponibles = async (filtros?: {
    fechaInicio?: string;
    fechaFin?: string;
    horaInicio?: string;
    horaFin?: string; // parámetros que se usarán para el filtro; las fechas pueden ser tratadas como string si se formatean bien
  }) => {
    if (!sedeSeleccionadaStore.id) {
      error.value = 'No se ha seleccionado ninguna sede';
      salasDisponibles.value = []; // se vacía para no dejar datos incorrectos
      return;
    }

    loading.value = true;               // se activa el loading
    error.value = null;                 // se limpian errores previos

    const idSede = sedeSeleccionadaStore.id; // obtenemos el id elegido del store de sedes

    const params = new URLSearchParams({
      idSede: idSede.toString(),
      fechaInicio: filtros?.fechaInicio || '2024-05-20', // valores por defecto para evitar undefined que dé 400
      fechaFin: filtros?.fechaFin || '2025-05-22',
      horaInicio: filtros?.horaInicio || '08:00',
      horaFin: filtros?.horaFin || '18:00',
    });

    const url = `https://localhost:7179/api/salas/getsalasdisponibles?${params.toString()}`;
    console.log('Llamando al endpoint:', url); // depurar y verificar los query params

    try {
      const response = await fetch(url); // petición a la API
      if (!response.ok) throw new Error('Error en la solicitud'); // control de error

      const data = await response.json(); // parse del JSON de respuesta
      console.log('Respuesta API salas:', data); // depurar respuesta (eliminar luego)

      salasDisponibles.value = data; // asigna los datos de la API al array
    } catch (err) {
      error.value = (err as Error).message;
      salasDisponibles.value = []; // vacía el array para evitar datos erróneos
    } finally {
      loading.value = false; // se desactiva el loading
    }
  };

  return {
    salasDisponibles,      // array con la info importante
    error,                 // posibles errores
    loading,               // estado de carga
    obtenerSalasDisponibles, // función principal del store
  };
}
