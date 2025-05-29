<script setup lang="ts">
import DashboardCharts from '@/components/GraficasCharts.vue';
</script>

<template>
  <div class="grafico-view">
    <h1 class="page-title">Dashboard de Estadísticas</h1>
    <DashboardCharts />
  </div>
</template>

<style scoped lang="scss">
.grafico-view {
  padding: 2rem;
  min-height: calc(100vh - 200px);
  background-color: #f9fafb;

  .page-title {
    font-size: 2rem;
    color: #1f2937;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 600;
  }
}
</style>

