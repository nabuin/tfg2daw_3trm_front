<!-- GENERICO DE VUE CHARTS JS-->

<template>
  <div class="chart-container">
    <h3>{{ title }}</h3>
    <Pie :data="chartData" />
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement ,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

defineProps<{
  chartData: any
  title: string
}>()
</script>

<style scoped lang="scss">
.chart-container {
  margin-bottom: 2rem;
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }
}
</style>
