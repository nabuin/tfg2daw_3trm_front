<template>
  <div class="dashboard">
    <div v-if="dashboard.loading" class="dashboard__loading">
      <div class="dashboard__spinner"></div>
      <p class="dashboard__loading-text">Cargando datos del dashboard...</p>
    </div>

    <div v-else-if="dashboard.error" class="dashboard__error">
      <p class="dashboard__error-message">{{ dashboard.error }}</p>
      <div class="dashboard__button-group">
        <button @click="dashboard.fetchData" class="dashboard__retry-button">
          Reintentar HTTPS
        </button>
      </div>
    </div>

    <template v-else-if="dashboard.data">
      <div class="dashboard__stats">
        <div class="dashboard__stat">
          <h3 class="dashboard__stat-title">Total Usuarios</h3>
          <p class="dashboard__stat-number">{{ dashboard.data.totalUsuarios }}</p>
        </div>
        <div class="dashboard__stat">
          <h3 class="dashboard__stat-title">Total Reservas</h3>
          <p class="dashboard__stat-number">{{ dashboard.data.totalReservas }}</p>
        </div>
        <div class="dashboard__stat">
          <h3 class="dashboard__stat-title">Ingresos Totales</h3>
          <p class="dashboard__stat-number">€{{ dashboard.data.ingresosTotales.toFixed(2) }}</p>
        </div>
        <div class="dashboard__stat">
          <h3 class="dashboard__stat-title">Reservas Este Mes</h3>
          <p class="dashboard__stat-number">{{ dashboard.data.reservasMesActual }}</p>
        </div>
      </div>

      <div class="dashboard__charts">
        <div class="dashboard__chart">
          <BarChart :chart-data="barData" title="Reservas por Ciudad" />
        </div>
        <div class="dashboard__chart">
          <PieChart :chart-data="pieData" title="Tipos de Sala Más Reservados" />
        </div>
        <div class="dashboard__chart">
          <LineChart :chart-data="lineData" title="Ingresos por Mes" />
        </div>
      </div>
    </template>

    <div v-else class="dashboard__no-data">
      <p class="dashboard__no-data-text">No hay datos disponibles</p>
      <button @click="dashboard.fetchData" class="dashboard__retry-button">
        Cargar Datos
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/store/DashboardStore'
import BarChart from './charts/BarChart.vue'
import PieChart from './charts/PieChart.vue'
import LineChart from './charts/LineChart.vue'

const dashboard = useDashboardStore()

onMounted(() => {
  dashboard.fetchData()
})

const barData = computed(() => {
  if (!dashboard.data?.reservasPorSede) return { labels: [], datasets: [] }
  
  return {
    labels: dashboard.data.reservasPorSede.map(s => s.ciudad),
    datasets: [{
      label: 'Reservas',
      backgroundColor: '#3b82f6',
      data: dashboard.data.reservasPorSede.map(s => s.cantidadReservas)
    }]
  }
})

const pieData = computed(() => {
  if (!dashboard.data?.tiposSalaMasReservados) return { labels: [], datasets: [] }
  
  return {
    labels: dashboard.data.tiposSalaMasReservados.map(s => s.tipoSala),
    datasets: [{
      label: 'Cantidad de Reservas',
      backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'],
      data: dashboard.data.tiposSalaMasReservados.map(s => s.cantidadReservas)
    }]
  }
})

const lineData = computed(() => {
  if (!dashboard.data?.reservasPorMes) return { labels: [], datasets: [] }
  
  return {
    labels: dashboard.data.reservasPorMes.map(m => m.fechaFormateada),
    datasets: [{
      label: 'Ingresos (€)',
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      data: dashboard.data.reservasPorMes.map(m => m.ingresos),
      fill: true,
      tension: 0.4
    }]
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  background-color: #f9fafb;
  min-height: 400px;

  &__loading,
  &__error,
  &__no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: 300px;
    text-align: center;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__loading-text {
    font-size: 1.1rem;
    color: #6b7280;
  }

  &__error-message {
    color: #ef4444;
    font-size: 1.1rem;
    max-width: 600px;
    line-height: 1.5;
  }

  &__button-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__retry-button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
    }

    &.secondary {
      background-color: #6b7280;

      &:hover {
        background-color: #4b5563;
      }
    }
  }

  &__no-data-text {
    color: #6b7280;
    font-size: 1.1rem;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__stat {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-align: center;
  }

  &__stat-title {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  &__charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__chart {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    min-height: 300px;
  }
}
</style>