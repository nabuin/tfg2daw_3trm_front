import { ref } from 'vue';

interface Sede {
  idSede: number;
  pais: string;
  ciudad: string;
  direccion: string;
  codigoPostal: string;
  planta: string;
  urL_Imagen: string;
  latitud: string;
  longitud: string;
  observaciones: string;
}

export function useMapaStore() {
  const coordenadas = ref<Sede[]>([]);
  const sedeSeleccionadaId = ref<number | null>(null);

  const obtenerCoordenadas = async () => {
    try {
      const response = await fetch('https://localhost:7179/api/Sedes');
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const data = await response.json();
  
      if (Array.isArray(data.$values)) { //comprueba que lo que devuelve es valido o no
        coordenadas.value = data.$values; //Si lo es, le damos su valor a coordenadas.value
      } else { // Si no
        coordenadas.value = []; //Hacemos como que no existe
      }
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      coordenadas.value = [];
    }
  };
  

  return { coordenadas, obtenerCoordenadas, sedeSeleccionadaId };
}
