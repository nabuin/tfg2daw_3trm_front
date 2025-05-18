import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFiltrosStore = defineStore('filtros', () => {
  const fechaInicio = ref<string>('');
  const fechaFin    = ref<string>('');
  const horaInicio  = ref<string>('');
  const horaFin     = ref<string>('');

  function setFiltros(payload: {
    fechaInicio: string;
    fechaFin:    string;
    horaInicio:  string;
    horaFin:     string;
  }) {
    fechaInicio.value = payload.fechaInicio;
    fechaFin.value    = payload.fechaFin;
    horaInicio.value  = payload.horaInicio;
    horaFin.value     = payload.horaFin;
  }

  return {
    fechaInicio,
    fechaFin,
    horaInicio,
    horaFin,
    setFiltros,
  };
});
