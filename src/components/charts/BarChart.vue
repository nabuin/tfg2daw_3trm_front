<!-- GENERICO DE VUE CHARTS JS-->
<template>
  <div class="chart-container">
    <h3>{{ title }}</h3>
    <Bar 
      :data="chartData" 
      :options="chartOptions"
      v-if="chartData.labels.length > 0"
    />
    <div v-else class="no-data">
      No hay datos disponibles
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

defineProps<{
  chartData: any
  title: string
}>()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
.chart-container {
  margin-bottom: 2rem;
  height: 300px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #374151;
    font-weight: 600;
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6b7280;
    font-size: 1.1rem;
  }
}
</style>
