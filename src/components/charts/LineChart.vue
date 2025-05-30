<!-- GENERICO DE VUE CHARTS JS-->
<template>
  <div class="chart-container">
    <h3>{{ title }}</h3>
    <Line :data="chartData" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

import { Line } from 'vue-chartjs'

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

defineProps({
  chartData: Object,
  title: String
})
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
