import { defineStore } from 'pinia'

interface CiudadReservas { }
interface TipoSala { }
interface ReservasMes { }
interface OcupacionDia { }
interface UsuarioActivo { }

interface DashboardData {
  totalUsuarios: number
  totalReservas: number
  reservasMesActual: number
  ingresosTotales: number
  ingresosMesActual: number
  reservasPorSede: CiudadReservas[]
  reservasPorMes: ReservasMes[]
  tiposSalaMasReservados: TipoSala[]
  ocupacionPorDia: OcupacionDia[]
  usuariosMasActivos: UsuarioActivo[]
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): {
    data: DashboardData | null
    loading: boolean
    error: string | null
  } => ({
    data: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchData() {
      this.loading = true
      this.error = null

      try {
        // peticion al backend
        const res = await fetch('https://localhost:7179/api/Estadisticas/general', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          let errorMessage = `Error HTTP ${res.status}: ${res.statusText}`
          throw new Error(errorMessage)
        }

        const data = await res.json()
        if (!data || typeof data !== 'object') {
          throw new Error('Los datos recibidos no tienen el formato esperado')
        }

        this.data = data

      } catch (err: any) {
        // mensaje de error
        this.error = err.message || 'Error desconocido al cargar datos'
      } finally {
        // desactivar loading
        this.loading = false
      }
    },
  },
})
