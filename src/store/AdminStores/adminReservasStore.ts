// src/store/ReservasStore.ts

import { defineStore } from 'pinia'

// esto es una reserva
interface Reserva {
  idReserva: number
  fecha: string // formato 2025-05-28T00:00:00
  reservaDescripcion: string
  precioTotal: number
  usuarioId: number
  usuarioNombre: string
  usuarioEmail: string
}

export const useReservasStore = defineStore('reservas', {
  state: () => ({
    reservas: [] as Reserva[], // lista de reservas
    cargando: false,           // si esta cargando datos
    error: null as string | null, // mensaje de error si hay
    token: localStorage.getItem('token') || '' // token guardado
  }),

  getters: {
    // busca una reserva por su id
    obtenerReservaPorId: state => (id: number) =>
      state.reservas.find(reserva => reserva.idReserva === id)
  },

  actions: {
    // funcion para llamar a la api con fetch
    async _llamadaApiFetch(metodo: string, endpoint: string, datos: any = null, cabeceras: HeadersInit = {}) {
      this.cargando = true
      this.error = null
      const DOMAIN_BASE_URL = 'https://coworkingapi.jblas.me/'
      const API_PREFIX = 'api/'
      const finalUrl = `${DOMAIN_BASE_URL}${API_PREFIX}${endpoint}`

      try {
        const respuesta = await fetch(finalUrl, {
          method: metodo,
          headers: {
            'Content-Type': 'application/json',
            ...cabeceras,
            ...(this.token && { Authorization: `Bearer ${this.token}` })
          },
          body: datos ? JSON.stringify(datos) : undefined
        })

        const responseText = await respuesta.text()

        if (!respuesta.ok) {
          let errorMessage = `error http estado ${respuesta.status}`
          try {
            const errorData = JSON.parse(responseText)
            if (errorData.errors) {
              const errores = []
              for (const [campo, mensajes] of Object.entries(errorData.errors)) {
                errores.push(`${campo} ${Array.isArray(mensajes) ? mensajes.join(', ') : mensajes}`)
              }
              errorMessage = `errores de validacion ${errores.join('; ')}`
            } else {
              errorMessage = errorData.title || errorData.message || errorData.detail || JSON.stringify(errorData)
            }
          } catch {
            errorMessage = responseText || errorMessage
          }
          throw new Error(errorMessage)
        }

        if (responseText) {
          try {
            return JSON.parse(responseText)
          } catch {
            console.warn(`respuesta de ${endpoint} correcta sin json`, responseText)
            return responseText
          }
        }
        return {}
      } catch (error: any) {
        console.error(`error en peticion api a ${endpoint}`, error)
        this.error = error.message || `error en accion en ${endpoint}`
        throw error
      } finally {
        this.cargando = false
      }
    },

    // trae todas las reservas desde la api
    async obtenerTodasLasReservas() {
      try {
        const datos = await this._llamadaApiFetch('GET', 'reservas')
        this.reservas = Array.isArray(datos) ? datos : []
      } catch (error) {
        console.error('error al obtener todas las reservas', error)
      }
    },

    // elimina una reserva por su id
    async eliminarReserva(idReserva: number) {
      try {
        await this._llamadaApiFetch('DELETE', `reservas/${idReserva}`)
        this.reservas = this.reservas.filter(r => r.idReserva !== idReserva)
      } catch (error) {
        console.error(`error al eliminar la reserva con id ${idReserva}`, error)
        throw error
      }
    }
  }
})
