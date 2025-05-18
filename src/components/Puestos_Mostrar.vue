<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';

export default defineComponent({
  setup() {
    const puestosStore = usePuestosStore();
    const salaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();


    onMounted(() => {

      puestosStore.obtenerPuestosDisponibles();
    });

    watch(
      () => [
      salaStore.id,
        filtrosStore.fechaInicio,
        filtrosStore.fechaFin,
        filtrosStore.horaInicio,
        filtrosStore.horaFin,
      ],
      () => {
        puestosStore.obtenerPuestosDisponibles();
      }
    );

    return { ...puestosStore };
  },
});


</script>
