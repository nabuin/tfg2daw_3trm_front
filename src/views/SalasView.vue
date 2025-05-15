<script lang="ts">
import Salas_Filter from '../components/Salas_Filter.vue';
import Salas_Result from '../components/Salas_Result.vue';
import Salas_Disponibles from '../components/Salas_Disponibles.vue';

export default {
  components: {
    Salas_Filter,
    Salas_Result,
    Salas_Disponibles,
  },
};
</script>


<template>
    <Salas_Filter />
    <Salas_Result />
    <Salas_Disponibles />
</template>


<style scoped lang="scss">


</style>

