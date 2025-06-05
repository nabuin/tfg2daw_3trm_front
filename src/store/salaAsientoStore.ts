import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useSalaAsientoStore = defineStore('salaAsiento', () => {
  const salaNombreCache = ref<Record<number, string>>({});

  async function obtenerSalaNombre(idPuesto: number): Promise<string> {
    // si ya tenemos el nombre en cache, retornarlo
    if (salaNombreCache.value[idPuesto]) {
      return salaNombreCache.value[idPuesto];
    }

    const url = `https://localhost:7179/api/Salas/puesto/${idPuesto}/sala-nombre`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const nombre = await response.text();
      salaNombreCache.value[idPuesto] = nombre;
      return nombre;
    } catch (err: any) {
      console.error('Error al obtener nombre de sala:', err);
      throw new Error(err.message || 'Error desconocido al obtener nombre de sala.');
    }
  }

  return {
    obtenerSalaNombre,
    // para pruebas o debug
    salaNombreCache,
  };
});
