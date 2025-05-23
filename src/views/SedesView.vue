<template>
  <div class="sedes-view">
    <h1>Mapa de Sedes</h1>
    <Sedes_Mapa />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sedes_Mapa from '../components/Sedes_Mapa.vue';

export default defineComponent({
  name: 'SedesView',
  components: {
    Sedes_Mapa
  }
});
</script>

<style scoped>
.sedes-view {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  font-family: Arial, sans-serif;
}
</style>
