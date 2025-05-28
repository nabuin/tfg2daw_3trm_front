
import { defineStore } from 'pinia';

export const useSedeSeleccionadaStore = defineStore('sedeSeleccionada', {
  state: () => ({
    id: null as number | null,
  }),
  actions: {
    setId(id: number) {
      console.log('[Pinia] Guardando sede seleccionada:', id);
      this.id = id;
    },
    reset() {
      console.log('[Pinia] Reseteando sede seleccionada');
      this.id = null;
    }
  }
});
