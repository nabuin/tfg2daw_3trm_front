<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { usePuestosStore } from '../store/asientosStore';

export default defineComponent({
  setup() {
    const puestosStore = usePuestosStore();

    onMounted(() => {
      puestosStore.obtenerPuestosDisponibles();
    });

    watch(
      () => [
        puestosStore.loading,
        // también puedes observar filtros y sala si prefieres
      ],
      () => {
        puestosStore.obtenerPuestosDisponibles();
      }
    );

    return { ...puestosStore };
  },
});


</script>
