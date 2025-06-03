
import { defineStore } from 'pinia';

export const useSedeSeleccionadaStore = defineStore('sedeSeleccionada', {
  state: () => ({
    id: null as number | null,
  }),
  actions: {
    setId(id: number) {
      this.id = id;
    },
    reset() {
      this.id = null;
    }
  }
});
