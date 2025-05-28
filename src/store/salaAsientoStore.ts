import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store para obtener el nombre de la sala de un puesto de trabajo.
 * Llama al endpoint:
 *   GET https://localhost:7179/api/Salas/puesto/{idPuesto}/sala-nombre
 * y devuelve la respuesta como un string.
 */
export const useSalaAsientoStore = defineStore('salaAsiento', () => {
  // Mapa local para cachear nombres de sala por id de puesto
  const salaNombreCache = ref<Record<number, string>>({});

  /**
   * Obtiene el nombre de la sala para un puesto dado.
   * Si ya está en cache, lo devuelve directamente.
   * @param idPuesto - Identificador del puesto de trabajo
   * @returns Promise<string> con el nombre de la sala
   */
  async function obtenerSalaNombre(idPuesto: number): Promise<string> {
    // Si ya tenemos el nombre en cache, retornarlo
    if (salaNombreCache.value[idPuesto]) {
      return salaNombreCache.value[idPuesto];
    }

    const url = `https://localhost:7179/api/Salas/puesto/${idPuesto}/sala-nombre`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      // Suponemos que el endpoint devuelve directamente un string
      const nombre = await response.text();
      // Guardar en cache
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
