import { defineStore } from 'pinia'
import { useSedesStore } from '@/store/AdminStores/adminSedesStore'

// interfaz para sala
interface Sala {
  idSala: number
  nombre: string
  url_Imagen: string
  capacidad: number
  idTipoSala: number
  idSede: number
  bloqueado: boolean
  zonasTrabajo?: any[]
}

// interfaz para tipo de sala
interface TipoSala {
  idTipoSala: number
  nombre: string
  numeroMesas: number
  capacidadAsientos: number
  esPrivada: boolean
  descripcion: string
  idTipoPuestoTrabajo: number
  TipoPuestoTrabajo?: TipoPuestoTrabajo
}

// interfaz para tipo de puesto de trabajo
interface TipoPuestoTrabajo {
  idTipoPuestoTrabajo: number
  nombre: string
  descripcion?: string
  imagen_URL?: string
}

// interfaz para caracteristica de sala
interface CaracteristicaSala {
  idCaracteristica: number
  nombre: string
  descripcion: string
  precioAniadido: number
}

// SalasConCaracteristicasDTO
interface SalasConCaracteristicasDTO {
  idSala: number;
  nombre: string;
  url_Imagen: string;
  capacidad: number;
  idTipoSala: number;
  idSede: number;
  bloqueado: boolean;
  caracteristicas: CaracteristicaSala[]; // Lista de características asociadas a la sala
}


export const useSalasStore = defineStore('salas', {
  state: () => ({
    salas: [] as Sala[],
    salasConCaracteristicas: [] as SalasConCaracteristicasDTO[], // estado para salas con características
    tiposSalas: [] as TipoSala[],
    tiposPuestoTrabajo: [] as TipoPuestoTrabajo[],
    caracteristicasSalas: [] as CaracteristicaSala[],
    cargando: false,
    error: null as string | null,
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    // obtener sala por id
    obtenerSalaPorId: state => (id: number) =>
      state.salas.find(sala => sala.idSala === id),
    // obtener tipo de sala por id
    obtenerTipoSalaPorId: state => (id: number) =>
      state.tiposSalas.find(tipo => tipo.idTipoSala === id),
    // obtener tipo de puesto por id
    obtenerTipoPuestoTrabajoPorId: state => (id: number) =>
      state.tiposPuestoTrabajo.find(tipo => tipo.idTipoPuestoTrabajo === id),
    // obtener caracteristica por id
    obtenerCaracteristicaPorId: state => (id: number) =>
      state.caracteristicasSalas.find(caracteristica => caracteristica.idCaracteristica === id),
    // obtener sala con caracteristicas por id
    obtenerSalaConCaracteristicasPorId: state => (id: number) =>
      state.salasConCaracteristicas.find(sala => sala.idSala === id)
  },

  actions: {
    // llamada generica a api
    async _llamadaApiFetch(metodo: string, endpoint: string, datos: any = null, cabeceras: HeadersInit = {}) {
      this.cargando = true
      this.error = null
      const DOMAIN_BASE_URL = 'https://coworking.jblas.me/'
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


    // obtener todas las salas
    async obtenerTodasLasSalas() {
      try {
        const datos = await this._llamadaApiFetch('GET', 'salas')
        this.salas = Array.isArray(datos) ? datos : []
      } catch (error) {
        console.error('error al obtener todas las salas', error)
      }
    },

    // obtener todas las salas con sus características
    async obtenerTodasLasSalasConCaracteristicas() {
      try {
        const datos = await this._llamadaApiFetch('GET', 'salas/con-caracteristicas');
        this.salasConCaracteristicas = Array.isArray(datos) ? datos : [];
      } catch (error) {
        console.error('Error al obtener salas con características:', error);
      }
    },

    // zñadir una característica a una sala
    async añadirCaracteristicaASala(idSala: number, idCaracteristica: number) {
      try {
        await this._llamadaApiFetch('POST', `salas/${idSala}/caracteristicas/${idCaracteristica}`);
        // actualizar el estado de salasConCaracteristicas para la sala específica
        await this.obtenerCaracteristicasPorSala(idSala);
        console.log(`Característica ${idCaracteristica} añadida a la sala ${idSala}`);
      } catch (error) {
        console.error(`Error al añadir característica ${idCaracteristica} a la sala ${idSala}:`, error);
        throw error;
      }
    },

    // eliminar una característica de una sala
    async eliminarCaracteristicaDeSala(idSala: number, idCaracteristica: number) {
      try {
        await this._llamadaApiFetch('DELETE', `salas/${idSala}/caracteristicas/${idCaracteristica}`);
        await this.obtenerCaracteristicasPorSala(idSala);
        console.log(`Característica ${idCaracteristica} eliminada de la sala ${idSala}`);
      } catch (error) {
        console.error(`Error al eliminar característica ${idCaracteristica} de la sala ${idSala}:`, error);
        throw error;
      }
    },

    async obtenerCaracteristicasPorSala(idSala: number) {
      try {
        const datos = await this._llamadaApiFetch('GET', `salas/${idSala}/caracteristicas`);
        // actualizar el objeto SalaConCaracteristicasDTO correspondiente en el estado
        const salaIndex = this.salasConCaracteristicas.findIndex(s => s.idSala === idSala);
        if (salaIndex !== -1) {
          this.salasConCaracteristicas[salaIndex].caracteristicas = Array.isArray(datos) ? datos : [];
        } else {
          // Si la sala no está en el estado de salasConCaracteristicas, podrías añadirla o simplemente retornar los datos
          // Para este caso, solo retornamos los datos ya que la sala principal ya debería estar en 'salas'
        }
        return Array.isArray(datos) ? datos : [];
      } catch (error) {
        console.error(`Error al obtener características de la sala ${idSala}:`, error);
        throw error;
      }
    },

    // agregar sala nueva
    async agregarSala(nuevaSala: Partial<Sala>) {
      try {
        const salaParaEnviar = this._prepararDatosParaBackend(nuevaSala, false)
        const salaCreada = await this._llamadaApiFetch('POST', 'salas', salaParaEnviar)
        if (salaCreada && salaCreada.idSala) {
          this.salas.push(salaCreada)
        }
        return salaCreada
      } catch (error) {
        console.error('error al agregar sala', error)
        throw error
      }
    },

    // actualizar sala existente
    async actualizarSala(idSala: number, datosSala: Partial<Sala>) {
      try {
        const salaParaEnviar = this._prepararDatosParaBackend(datosSala, true)
        salaParaEnviar.idSala = idSala
        const salaActualizada = await this._llamadaApiFetch('PUT', `salas/${idSala}`, salaParaEnviar)
        const indice = this.salas.findIndex(s => s.idSala === idSala)
        if (indice !== -1) {
          this.salas[indice] = { ...this.salas[indice], ...salaActualizada }
        }
        return salaActualizada
      } catch (error) {
        console.error('error al actualizar sala', error)
        throw error
      }
    },

    // eliminar sala por id
    async eliminarSala(idSala: number) {
      try {
        await this._llamadaApiFetch('DELETE', `salas/${idSala}`)
        this.salas = this.salas.filter(s => s.idSala !== idSala)
        // También eliminarla de salasConCaracteristicas si existe
        this.salasConCaracteristicas = this.salasConCaracteristicas.filter(s => s.idSala !== idSala);
      } catch (error) {
        console.error('error al eliminar sala', error)
        throw error
      }
    },

    // obtener todos los tipos de salas
    async obtenerTodosLosTiposSalas() {
      try {
        const datos = await this._llamadaApiFetch('GET', 'tiposSalas')
        this.tiposSalas = Array.isArray(datos) ? datos : []
      } catch (error) {
        console.error('error al obtener tipos de salas', error)
      }
    },

    // obtener todos los tipos de puesto de trabajo
    async obtenerTodosTiposPuestoTrabajo() {
      try {
        const datos = await this._llamadaApiFetch('GET', 'tiposPuestosTrabajo')
        this.tiposPuestoTrabajo = Array.isArray(datos) ? datos : []
      } catch (error) {
        console.error('error al obtener tipos de puesto trabajo', error)
      }
    },

    // obtener todas las caracteristicas de salas
    async obtenerTodasLasCaracteristicasSalas() {
      try {
        const datos = await this._llamadaApiFetch('GET', 'CaracteristicasSala')
        this.caracteristicasSalas = Array.isArray(datos) ? datos : []
      } catch (error) {
        console.error('error al obtener caracteristicas de salas', error)
      }
    },

    // agregar caracteristica nueva
    async agregarCaracteristica(nuevaCaracteristica: Partial<CaracteristicaSala>) {
      try {
        const caracteristicaCreada = await this._llamadaApiFetch('POST', 'CaracteristicasSala', nuevaCaracteristica)
        if (caracteristicaCreada && caracteristicaCreada.idCaracteristica) {
          this.caracteristicasSalas.push(caracteristicaCreada)
        }
        return caracteristicaCreada
      } catch (error) {
        console.error('error al agregar caracteristica', error)
        throw error
      }
    },

    // actualizar caracteristica existente
    async actualizarCaracteristica(idCaracteristica: number, datosCaracteristica: Partial<CaracteristicaSala>) {
      try {
        const caracteristicaActualizada = await this._llamadaApiFetch('PUT', `CaracteristicasSala/${idCaracteristica}`, datosCaracteristica)
        const indice = this.caracteristicasSalas.findIndex(c => c.idCaracteristica === idCaracteristica)
        if (indice !== -1) {
          this.caracteristicasSalas[indice] = { ...this.caracteristicasSalas[indice], ...caracteristicaActualizada }
        }
        return caracteristicaActualizada
      } catch (error) {
        console.error('error al actualizar caracteristica', error)
        throw error
      }
    },

    // eliminar caracteristica por id
    async eliminarCaracteristica(idCaracteristica: number) {
      try {
        await this._llamadaApiFetch('DELETE', `CaracteristicasSala/${idCaracteristica}`)
        this.caracteristicasSalas = this.caracteristicasSalas.filter(c => c.idCaracteristica !== idCaracteristica)
      } catch (error) {
        console.error('error al eliminar caracteristica', error)
        throw error
      }
    },

    async generarAsientosDeSalas() {
      try {
        await this._llamadaApiFetch('POST', 'PuestosTrabajo/generarAsientosDeSalas');
        console.log('Asientos de salas generados/actualizados correctamente.');
      } catch (error) {
        console.error('Error al generar asientos de salas:', error);
        throw error;
      }
    },

    async generarDisponibilidadesPorAnio(anio: number) {
      try {
        // Usar _llamadaApiFetch para mayor consistencia
        const response = await this._llamadaApiFetch('POST', `Disponibilidades/add/${anio}`);
        console.log(`Disponibilidades generadas correctamente para el año ${anio}.`, response);
        return `Disponibilidades generadas correctamente para el año ${anio}.`;
      } catch (error: any) {
        console.error(`Error al generar disponibilidades para el año ${anio}:`, error);
        // Re-lanzamos el error para que el componente que llama pueda manejarlo
        throw error;
      }
    },

    // preparar datos para enviar al backend
    _prepararDatosParaBackend(datos: any, esActualizacion: boolean = false) {
      const idTipoSala = datos.idTipoSala ? parseInt(datos.idTipoSala) : 0;
      if (!idTipoSala) {
        throw new Error(`no se pudo determinar tipo sala. idTipoSala es ${idTipoSala}`);
      }

      // obtener datos de sede completa
      const sedesStore = useSedesStore()
      const sedeCompleta = datos.idSede ? sedesStore.obtenerSedePorId(datos.idSede) : null

      // obtener tipo sala completa
      let tipoSalaCompleta = this.obtenerTipoSalaPorId(idTipoSala)
      if (!tipoSalaCompleta && esActualizacion && datos.idSala) {
        const salaExistente = this.obtenerSalaPorId(datos.idSala)
        if (salaExistente) {
          tipoSalaCompleta = this.obtenerTipoSalaPorId(salaExistente.idTipoSala)
        }
      }

      // preparar tipo sala con puesto de trabajo
      let tipoSalaConPuesto = null
      if (tipoSalaCompleta) {
        let tipoPuestoTrabajo = this.obtenerTipoPuestoTrabajoPorId(tipoSalaCompleta.idTipoPuestoTrabajo)
        if (!tipoPuestoTrabajo) {
          tipoPuestoTrabajo = {
            idTipoPuestoTrabajo: tipoSalaCompleta.idTipoPuestoTrabajo,
            nombre: tipoSalaCompleta.idTipoPuestoTrabajo === 1 ? 'puesto colaborativo' : 'puesto privado',
            descripcion: tipoSalaCompleta.idTipoPuestoTrabajo === 1 ? 'puesto colaborativo' : 'puesto privado',
            imagen_URL: tipoSalaCompleta.idTipoPuestoTrabajo === 1 ? 'https://example.com/colaborativo.jpg' : 'https://example.com/privado.jpg'
          }
        } else {
          tipoPuestoTrabajo = {
            ...tipoPuestoTrabajo,
            imagen_URL: tipoPuestoTrabajo.imagen_URL || (tipoSalaCompleta.idTipoPuestoTrabajo === 1 ? 'https://example.com/colaborativo.jpg' : 'https://example.com/privado.jpg')
          }
        }
        tipoSalaConPuesto = { ...tipoSalaCompleta, TipoPuestoTrabajo: tipoPuestoTrabajo }
      }

      // formar objeto para enviar
      const salaParaEnviar: any = {
        nombre: datos.nombre || '',
        urL_Imagen: datos.url_Imagen || '',
        // Capacidad se toma directamente de datos, ya que no se valida por el mapa
        capacidad: datos.capacidad ? parseInt(datos.capacidad) : 0, 
        idTipoSala: idTipoSala,
        idSede: datos.idSede ? parseInt(datos.idSede) : 0,
        bloqueado: typeof datos.bloqueado === 'boolean' ? datos.bloqueado : false,
        TipoSala: tipoSalaConPuesto,
        Sede: sedeCompleta || null,
        ZonasTrabajo: datos.zonasTrabajo || []
      }

      if (esActualizacion && datos.idSala) {
        salaParaEnviar.idSala = parseInt(datos.idSala)
      } else if (!esActualizacion) {
        salaParaEnviar.idSala = 0
      }

      return salaParaEnviar
    }
  }
})

// exportar tipos para usar en otros componentes
export type { Sala, TipoSala, TipoPuestoTrabajo, CaracteristicaSala, SalasConCaracteristicasDTO }