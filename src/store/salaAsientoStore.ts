import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useSalaAsientoStore = defineStore('salaAsiento', () => {
  const salaNombreCache = ref<Record<number, string>>({});

  /**
   * obtiene el nombre de la sala para un puesto dado.
   * si ya está en cache, lo devuelve directamente.
   * @param idPuesto - identificador del puesto de trabajo
   * @returns promise<string> con el nombre de la sala
   */
  async function obtenerSalaNombre(idPuesto: number): Promise<string> {
    // si ya tenemos el nombre en cache, retornarlo
    if (salaNombreCache.value[idPuesto]) {
      return salaNombreCache.value[idPuesto];
    }

    const url = `https://coworkingapi.jblas.me/api/Salas/puesto/${idPuesto}/sala-nombre`;
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
