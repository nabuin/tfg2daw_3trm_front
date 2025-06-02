import { defineStore } from 'pinia';

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  idRol: number;
  fechaRegistro: string;
  contrasenia?: string;
}

interface Rol {
  idRol: number;
  nombre: string;
  descripcion: string;
}

interface Zona {
  idZonaTrabajo: number;
  descripcion: string;
  idSala: number;
}

interface Sala {
  idSala: number;
  nombre: string;
  url_Imagen: string;
  capacidad: number;
  idTipoSala: number;
  idSede: number;
  bloqueado: boolean;
}

interface Puesto {
  idPuestoTrabajo: number;
  numeroAsiento: number;
  codigoMesa: number;
  url_Imagen: string;
  disponible: boolean;
  idZonaTrabajo: number;
  idSala: number;
  bloqueado: boolean;
}

interface Reserva {
  idReserva: number;
  idUsuario: number;
  fecha: string;
  descripcion: string;
  precioTotal: number;
}

interface LineaReserva {
  idLinea: number;
  idReserva: number;
  idPuestoTrabajo: number;
  precio: number;
}

interface Disponibilidad {
  idDisponibilidad: number;
  fecha: string;
  estado: boolean;
  idTramoHorario: number;
  idPuestoTrabajo: number;
}

interface TipoPuestoTrabajo {
  idTipoPuestoTrabajo: number;
  nombre: string;
  imagen_URL: string;
  descripcion: string;
  precio: number;
}

interface TipoSala {
  idTipoSala: number;
  nombre: string;
  numeroMesas: number;
  capacidadAsientos: number;
  esPrivada: boolean;
  descripcion: string;
  idTipoPuestoTrabajo: number;
}

interface Sede {
  idSede: number;
  pais: string;
  ciudad: string;
  direccion: string;
  codigoPostal: string;
  planta: string;
  url_Imagen: string;
  latitud: string;
  longitud: string;
  observaciones: string;
}

interface TramoHorario {
  idTramoHorario: number;
  horaInicio: string;
  horaFin: string;
}

interface CaracteristicaSala {
  idCaracteristica: number;
  nombre: string;
  descripcion: string;
  precioAniadido: number;
}

interface SalaConCaracteristicas {
  idSalaConCaracteristica: number;
  idSala: number;
  idCaracteristica: number;
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    usuarios: [] as Usuario[],
    roles: [] as Rol[],
    zonas: [] as Zona[],
    salas: [] as Sala[],
    puestos: [] as Puesto[],
    reservas: [] as Reserva[],
    lineasReserva: [] as LineaReserva[],
    disponibilidad: [] as Disponibilidad[],
    tiposPuestosTrabajo: [] as TipoPuestoTrabajo[],
    tiposSalas: [] as TipoSala[],
    sedes: [] as Sede[],
    tramosHorarios: [] as TramoHorario[],
    caracteristicasSala: [] as CaracteristicaSala[],
    salasConCaracteristicas: [] as SalaConCaracteristicas[],
    cargando: false,
    error: null as string | null,
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    obtenerUsuarioPorId: (state) => (id: number) => state.usuarios.find(usuario => usuario.idUsuario === id),
    obtenerSalaPorId: (state) => (id: number) => state.salas.find(sala => sala.idSala === id),
    obtenerPuestoPorId: (state) => (id: number) => state.puestos.find(puesto => puesto.idPuestoTrabajo === id),
    obtenerRolPorId: (state) => (id: number) => state.roles.find(rol => rol.idRol === id),
  },

  actions: {
    /**
     * metodo para hacer peticiones fetch a la api
     * maneja los estados de carga y error, y la autorizacion con el token
     * @param metodo - metodo http (get, post, put, delete)
     * @param endpoint - url de la api relativa a la url base (ej: 'usuarios', 'auth/register')
     * @param datos - cuerpo de la peticion (para post, put).
     * @param cabeceras - cabeceras adicionales.
     * @returns la respuesta json de la api.
     */
    async _llamadaApiFetch(metodo: string, endpoint: string, datos: any = null, cabeceras: HeadersInit = {}) {
      this.cargando = true;
      this.error = null;
      
      // url base del dominio
      const DOMAIN_BASE_URL = 'https://coworkingapi.jblas.me/'; 
      // prefijo de api , en algunos casos como auth no se usa
      const API_PREFIX = 'api/';

      let finalUrl: string;

      // decide la url final segun el endpoint
      if (endpoint.startsWith('Auth/')) {
        // si es un endpoint de auth, va directamente en la raiz del dominio
        finalUrl = `${DOMAIN_BASE_URL}${endpoint}`;
      } else {
        // si no, es un endpoint de api estandar con el prefijo /api/
        finalUrl = `${DOMAIN_BASE_URL}${API_PREFIX}${endpoint}`;
      }

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

        // lee el cuerpo de la respuesta como texto una sola vez
        const responseText = await respuesta.text();

        if (!respuesta.ok) {
          let errorMessage = `error http! estado: ${respuesta.status}`;
          try {
            // intenta leer el texto como json para mas detalles del error
            const errorData = JSON.parse(responseText);
            // usa 'message' o 'detail' si existen, si no, todo el objeto
            errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
          } catch (e) {
            // si no es json, usa el texto crudo como mensaje de error
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        // si la respuesta fue ok y hay contenido, intenta leerlo como json
        if (responseText) {
          try {
            return JSON.parse(responseText);
          } catch (e) {
            // si falla la lectura como json pero la respuesta fue ok, no es contenido json.
            // esto pasa con respuestas 200 ok sin cuerpo o con texto plano.
            console.warn(`la respuesta de ${endpoint} fue ok pero no json. devolviendo texto crudo o objeto vacio.`, responseText);
            return responseText; // o return {} si siempre esperas un objeto
          }
        }
        return {}; // devuelve un objeto vacio para respuestas sin contenido (ej. 204 no content)

      } catch (error: any) {
        console.error(`error en la peticion api a ${endpoint}:`, error);
        // asegura que el mensaje de error original se mantenga (ej. error de red)
        this.error = error.message || `error al ejecutar la accion en ${endpoint}`;
        throw error;
      } finally {
        this.cargando = false;
      }
    },

    // --- metodos para usuarios ---

    /**
     * obtiene todos los usuarios de la api y actualiza el estado 'usuarios' del store.
     */
    async obtenerTodosLosUsuarios() {
      try {
        // esto apuntara correctamente a https://coworkingapi.jblas.me/api/usuarios
        const datos = await this._llamadaApiFetch('GET', 'usuarios');
        this.usuarios = datos.map((usuario: any) => ({
          idUsuario: usuario.idUsuario,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          email: usuario.email,
          idRol: usuario.idRol,
          fechaRegistro: usuario.fechaRegistro
        }));
      } catch (error) {
        console.error('error al obtener todos los usuarios:', error);
      }
    },

    /**
     * añade un nuevo usuario a la api registrandolo mediante el endpoint auth/register.
     * despues de un registro exitoso, recarga el estado 'usuarios' del store.
     * @param nuevoUsuario - los datos del usuario a registrar (nombre, apellidos, email, contrasenia).
     * @returns la respuesta de la api de registro.
     */
    async agregarUsuario(nuevoUsuario: Partial<Usuario>) {
      try {
        // crea el payload para el endpoint de registro
        const payload = {
          nombre: nuevoUsuario.nombre,
          apellidos: nuevoUsuario.apellidos,
          email: nuevoUsuario.email,
          contrasenia: nuevoUsuario.contrasenia,
          // si el endpoint espera idrol o fecharegistro, anadelos aqui:
          // idrol: nuevousuario.idrol,
          // fecharegistro: nuevousuario.fecharegistro
        };

        // hace la peticion post al endpoint de registro.
        // _llamadaapifetch sabra que es un endpoint de 'auth'
        // y creara la url como https://coworkingapi.jblas.me/auth/register
        const respuestaRegistro = await this._llamadaApiFetch('POST', 'Auth/Register', payload);
        
        // despues de un registro, recarga la lista completa de usuarios
        // para que el nuevo usuario aparezca con sus datos.
        await this.obtenerTodosLosUsuarios(); 
        
        return respuestaRegistro; // devuelve la respuesta del registro
      } catch (error) {
        console.error('error al registrar usuario:', error);
        throw error; // relanza el error para que el componente lo maneje
      }
    },

    /**
     * actualiza un usuario existente en la api y en el store.
     * @param idUsuario - el id del usuario a actualizar.
     * @param datosUsuario - los datos del usuario a actualizar.
     * @returns el objeto de usuario actualizado de la api.
     */
    async actualizarUsuario(idUsuario: number, datosUsuario: Partial<Usuario>) {
      try {
        // esto apuntara correctamente a https://coworkingapi.jblas.me/api/usuarios/{idUsuario}
        const usuarioActualizado = await this._llamadaApiFetch('PUT', `usuarios/${idUsuario}`, datosUsuario);
        const indice = this.usuarios.findIndex(u => u.idUsuario === idUsuario);
        if (indice !== -1) {
          this.usuarios[indice] = { ...this.usuarios[indice], ...usuarioActualizado }; // mezcla de datos existentes y actualizados , si nose pone nada, usa el que habia
        }
        return usuarioActualizado;
      } catch (error) {
        console.error('error al actualizar usuario:', error);
        throw error;
      }
    },

    /**
     * elimina un usuario de la api y del store.
     * @param idUsuario - el id del usuario a eliminar.
     */
    async eliminarUsuario(idUsuario: number) {
      try {
        // esto apuntara correctamente a https://coworkingapi.jblas.me/api/usuarios/{idUsuario}
        await this._llamadaApiFetch('DELETE', `usuarios/${idUsuario}`);
        this.usuarios = this.usuarios.filter(u => u.idUsuario !== idUsuario);
      } catch (error) {
        console.error('error al eliminar usuario:', error);
        throw error;
      }
    },

    // --- metodos para roles (necesarios para el formulario de usuario) ---
    async obtenerTodosLosRoles() {
      try {
        //  https://coworkingapi.jblas.me/api/roles
        const datos = await this._llamadaApiFetch('GET', 'roles');
        this.roles = datos.map((rol: any) => ({
          idRol: rol.idRol,
          nombre: rol.nombre,
          descripcion: rol.descripcion
        }));
      } catch (error) {
        console.error('error al obtener todos los roles:', error);
      }
    },
 

    /**
     * Añade un nuevo rol a la API y actualiza el estado 'roles' del store.
     * @param nuevoRol - Los datos del nuevo rol a añadir (nombre, descripcion).
     * @returns El objeto del rol recién añadido de la API.
     */
    async agregarRol(nuevoRol: Partial<Rol>) {
      try {
        const rolAniadido = await this._llamadaApiFetch('POST', 'roles', nuevoRol);
        this.roles.push(rolAniadido);
        return rolAniadido;
      } catch (error) {
        console.error('Error al añadir rol:', error);
        throw error;
      }
    },

    /**
     * Actualiza un rol existente en la API y en el store.
     * @param idRol - El ID del rol a actualizar.
     * @param datosRol - Los datos del rol a actualizar.
     * @returns El objeto de rol actualizado de la API.
     */
    async actualizarRol(idRol: number, datosRol: Partial<Rol>) {
      try {
        const rolActualizado = await this._llamadaApiFetch('PUT', `roles/${idRol}`, datosRol);
        const indice = this.roles.findIndex(r => r.idRol === idRol);
        if (indice !== -1) {
          this.roles[indice] = { ...this.roles[indice], ...rolActualizado };
        }
        return rolActualizado;
      } catch (error) {
        console.error('Error al actualizar rol:', error);
        throw error;
      }
    },

    /**
     * Elimina un rol de la API y del store.
     * @param idRol - El ID del rol a eliminar.
     */
    async eliminarRol(idRol: number) {
      try {
        await this._llamadaApiFetch('DELETE', `roles/${idRol}`);
        this.roles = this.roles.filter(r => r.idRol !== idRol);
      } catch (error) {
        console.error('Error al eliminar rol:', error);
        throw error;
      }
    },
 
  }
});