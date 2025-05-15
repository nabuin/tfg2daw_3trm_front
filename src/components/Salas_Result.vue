<!-- src/components/Salas_Result.vue -->
<template>
  <div>
    <h2>ID de sede seleccionada:</h2>
    <p v-if="id !== null">{{ id }}</p>
    <p v-else>No hay sede seleccionada</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';

export default defineComponent({
  setup() {
    const sedeSeleccionadaStore = useSedeSeleccionadaStore();
    const id = computed(() => sedeSeleccionadaStore.id);

    return { id };
  }
});
</script>
