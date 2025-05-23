import { ref } from 'vue';
import { useSedeSeleccionadaStore } from './sedeSeleccionadaStore';

export function useSalasStore() {
  const salasDisponibles = ref<any[]>([]); // almacenar las salas que da la api
  const error = ref<string | null>(null);
  const loading = ref(false);

  const sedeSeleccionadaStore = useSedeSeleccionadaStore(); // para acceder al id de la sala elegida
  
  const obtenerSalasDisponibles = async (filtros?: {
    fechaInicio?: string;
    fechaFin?: string;
    horaInicio?: string;
    horaFin?: string; // parametros q se usaran para el filtro, las fechas pueden ser tratadas como string si se formatean bien
  }) => {
    if (!sedeSeleccionadaStore.id) {
      error.value = 'No se ha seleccionado ninguna sede';
      salasDisponibles.value = []; // se pone null si hay algun error para no dejar datos incorrectos
      return;
    }
    
    loading.value = true; // se activa el loading
    error.value = null; // se pone null los errores previos
    
    const idSede = sedeSeleccionadaStore.id; // obtenemos el id elegido del store de sedes
    
    const params = new URLSearchParams({
      idSede: idSede.toString(),
      fechaInicio: filtros?.fechaInicio || '2024-05-20', // para evitar mandar un undefined q resulte en un 400, se establecen valores default despues del ||, asi siempre habrá status 200
      fechaFin: filtros?.fechaFin || '2025-05-22',
      horaInicio: filtros?.horaInicio || '08:00',
      horaFin: filtros?.horaFin || '18:00',
    });
    
    const url = `https://localhost:7179/api/salas/getsalasdisponibles?${params.toString()}`;
    
    console.log('Llamando al endpoint:', url); // depurar y ver q los query params esten bien
    
    try {
      const response = await fetch(url); // peticion a la API
      if (!response.ok) throw new Error('Error en la solicitud'); // control de error
      
      const data = await response.json(); // parse del json de respuesta
      
      console.log('Respuesta API salas:', data); // depurar y ver lo que devuelve, luego se eliminará esto
      
      salasDisponibles.value = data; //asigna los datos de respuesta de la api al array de objetos definido antes, que hasta ahora estaba vacio
    } catch (err) {
      error.value = (err as Error).message;
      salasDisponibles.value = []; // el array se vacia para evitar datos con errores
    } finally {
      loading.value = false; // se quita el loading
    }
  };
  
  return {
    salasDisponibles, // array con la info importante
    error, // posibles errores
    loading, // carga si hay
    obtenerSalasDisponibles, // funcion principal del store
  };
}