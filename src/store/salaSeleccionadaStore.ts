import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSalaSeleccionadaStore = defineStore('salaSeleccionada', () => {
  const id = ref<number | null>(null);

  function setId(newId: number) {
    id.value = newId;
  }

  function reset() {
    id.value = null;
  }

  return { id, setId, reset };
});
