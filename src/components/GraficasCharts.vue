<template>
  <div class="dashboard-charts">
    <div v-if="dashboard.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando datos del dashboard...</p>
    </div>
    
    <div v-else-if="dashboard.error" class="error-state">
      <p class="error-message">{{ dashboard.error }}</p>
      <div class="button-group">
        <button @click="dashboard.fetchData" class="retry-button">
          Reintentar HTTPS
        </button>
      </div>
    </div>
    
    <template v-else-if="dashboard.data">
      <!-- Estadísticas generales -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Usuarios</h3>
          <p class="stat-number">{{ dashboard.data.totalUsuarios }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Reservas</h3>
          <p class="stat-number">{{ dashboard.data.totalReservas }}</p>
        </div>
        <div class="stat-card">
          <h3>Ingresos Totales</h3>
          <p class="stat-number">€{{ dashboard.data.ingresosTotales.toFixed(2) }}</p>
        </div>
        <div class="stat-card">
          <h3>Reservas Este Mes</h3>
          <p class="stat-number">{{ dashboard.data.reservasMesActual }}</p>
        </div>
      </div>
      
      <!-- Gráficos -->
      <div class="charts-grid">
        <div class="chart-container">
          <BarChart :chart-data="barData" title="Reservas por Ciudad" />
        </div>
        <div class="chart-container">
          <PieChart :chart-data="pieData" title="Tipos de Sala Más Reservados" />
        </div>
        <div class="chart-container">
          <LineChart :chart-data="lineData" title="Ingresos por Mes" />
        </div>
      </div>
    </template>
    
    <div v-else class="no-data-state">
      <p>No hay datos disponibles</p>
      <button @click="dashboard.fetchData" class="retry-button">
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
.dashboard-charts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  background-color: #f9fafb;
  min-height: 400px;
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: 300px;
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    min-height: 300px;
    
    .error-message {
      color: #ef4444;
      font-size: 1.1rem;
      max-width: 600px;
      line-height: 1.5;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .retry-button {
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
  }
  
  .no-data-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: 300px;
    
    p {
      color: #6b7280;
      font-size: 1.1rem;
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      text-align: center;
      
      h3 {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0 0 0.5rem 0;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
      }
    }
  }
  
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .chart-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    min-height: 300px;
  }
}

</style>