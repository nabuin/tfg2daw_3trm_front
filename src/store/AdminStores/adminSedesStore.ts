export interface Sede {
    idSede: number;
    pais: string;
    ciudad: string;
    direccion: string;
    codigoPostal: string;
    planta: string;
}
import { defineStore } from 'pinia';


export const useSedesStore = defineStore('sedes', {
  state: () => ({
    sedes: [] as Sede[],
    cargando: false,
    error: null as string | null,
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    obtenerSedePorId: (state) => (id: number) => state.sedes.find(sede => sede.idSede === id),
  },

  actions: {
    /**
     * Método para hacer peticiones fetch a la API
     * Maneja los estados de carga y error, y la autorización con el token
     */
    async _llamadaApiFetch(metodo: string, endpoint: string, datos: any = null, cabeceras: HeadersInit = {}) {
      this.cargando = true;
      this.error = null;
      
      const DOMAIN_BASE_URL = 'https://localhost:7179/'; 
      const API_PREFIX = 'api/';

      const finalUrl = `${DOMAIN_BASE_URL}${API_PREFIX}${endpoint}`;

      try {
        const respuesta = await fetch(finalUrl, {
          method: metodo,
          headers: {
            'Content-Type': 'application/json',
            ...cabeceras,
            ...(this.token && { Authorization: `Bearer ${this.token}` })
          },
          body: datos ? JSON.stringify(datos) : undefined
        });

        const responseText = await respuesta.text();

        if (!respuesta.ok) {
          let errorMessage = `Error HTTP! Estado: ${respuesta.status}`;
          try {
            const errorData = JSON.parse(responseText);
            // Manejo mejorado de errores de validación
            if (errorData.errors) {
              const errores = [];
              for (const [campo, mensajes] of Object.entries(errorData.errors)) {
                errores.push(`${campo}: ${Array.isArray(mensajes) ? mensajes.join(', ') : mensajes}`);
              }
              errorMessage = `Errores de validación: ${errores.join('; ')}`;
            } else {
              errorMessage = errorData.title || errorData.message || errorData.detail || JSON.stringify(errorData);
            }
          } catch (e) {
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        if (responseText) {
          try {
            return JSON.parse(responseText);
          } catch (e) {
            console.warn(`La respuesta de ${endpoint} fue correcta pero no devolvio un JSON`, responseText);
            return responseText;
          }
        }
        return {};

      } catch (error: any) {
        console.error(`Error en la petición API a ${endpoint}:`, error);
        this.error = error.message || `Error al ejecutar la acción en ${endpoint}`;
        throw error;
      } finally {
        this.cargando = false;
      }
    },

     // findall , luego se podra que sea de 20 en 20 ampliable
    async obtenerTodasLasSedes() {
      try {
        const datos = await this._llamadaApiFetch('GET', 'sedes');
        this.sedes = Array.isArray(datos) ? datos : [];
      } catch (error) {
        console.error('Error al obtener todas las sedes:', error);
      }
    },

     // Añadir una nueva sede
    async agregarSede(nuevaSede: Partial<Sede>) {
      try {
        // Preparar los datos según el formato esperado por el backend
        const sedeParaEnviar = this._prepararDatosParaBackend(nuevaSede, false);
        
        console.log('Datos a enviar al backend:', sedeParaEnviar);
        
        const sedeCreada = await this._llamadaApiFetch('POST', 'sedes', sedeParaEnviar);
        
        // Agregar la nueva sede al estado local
        if (sedeCreada && sedeCreada.idSede) {
          this.sedes.push(sedeCreada);
        }
        
        return sedeCreada;
      } catch (error) {
        console.error('Error al agregar sede:', error);
        throw error;
      }
    },

    
     // Actualiza una sede existente
    async actualizarSede(idSede: number, datosSede: Partial<Sede>) {
      try {
        // Preparar los datos según el formato esperado por el backend
        const sedeParaEnviar = this._prepararDatosParaBackend(datosSede, true);
        sedeParaEnviar.idSede = idSede; // Asegurar que el ID esté presente
        
        console.log('Datos a actualizar en el backend:', sedeParaEnviar);
        
        const sedeActualizada = await this._llamadaApiFetch('PUT', `sedes/${idSede}`, sedeParaEnviar);
        
        // Actualizar en el estado local
        const indice = this.sedes.findIndex(s => s.idSede === idSede);
        if (indice !== -1) {
          this.sedes[indice] = { ...this.sedes[indice], ...sedeActualizada };
        }
        
        return sedeActualizada;
      } catch (error) {
        console.error('Error al actualizar sede:', error);
        throw error;
      }
    },


    
     // Prepara los datos para enviar al backend según el formato esperado
     
    _prepararDatosParaBackend(datos: any, esActualizacion: boolean = false) {
      const sedeParaEnviar: any = {
        pais: datos.pais || '',
        ciudad: datos.ciudad || '',
        direccion: datos.direccion || '',
        codigoPostal: datos.codigoPostal || '',
        planta: datos.planta || '',
        urL_Imagen: datos.url_Imagen || datos.urL_Imagen || '',
        latitud: datos.latitud || '',
        longitud: datos.longitud || '',
        observaciones: datos.observaciones || ''
      };

      // Para actualizaciones, incluir el ID
      if (esActualizacion && datos.idSede) {
        sedeParaEnviar.idSede = parseInt(datos.idSede);
      } else if (!esActualizacion) {
        // Para nuevas sedes, enviar idSede como 0 o no incluirlo
        sedeParaEnviar.idSede = 0;
      }

      return sedeParaEnviar;
    }
  }
});