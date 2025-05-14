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
      const res = await fetch('https://localhost:7179/api/Sedes');
      if (!res.ok) throw new Error('Error en la solicitud');
      coordenadas.value = await res.json();
    } catch (error) {
      console.error('Error al obtener sedes:', error);
    }
  };

  return { coordenadas, obtenerCoordenadas, sedeSeleccionadaId };
}
