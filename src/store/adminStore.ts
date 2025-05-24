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
  nombreRol: string;
}

interface Zona {
  idZona: number;
  nombreZona: string;
  descripcion?: string;
}

interface Sala {
  idSala: number;
  nombreSala: string;
  capacidad: number;
  ubicacion: string;
  idZona: number;
  nombreZona?: string;
}

interface Puesto {
  idPuesto: number;
  nombrePuesto: string;
  idSala: number;
  descripcion?: string;
  nombreSala?: string;
}

interface Reserva {
  idReserva: number;
  idUsuario: number;
  idSala?: number | null;
  idPuesto?: number | null;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  descripcionReserva?: string;
  estadoReserva: string;
  nombreUsuario?: string;
  emailUsuario?: string;
  nombreElemento?: string;
  tipoElemento?: 'Sala' | 'Puesto';
}

interface Disponibilidad {
  idDisponibilidad: number;
  idTipoElemento: 'Sala' | 'Puesto';
  idElemento: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: number;
  nombreElemento?: string;
}


export const useAdminStore = defineStore('admin', {
  state: () => ({
    usuarios: [] as Usuario[],
    roles: [] as Rol[],
    zonas: [] as Zona[],
    salas: [] as Sala[],
    puestos: [] as Puesto[],
    reservas: [] as Reserva[],
    disponibilidad: [] as Disponibilidad[],
    cargando: false,
    error: null as string | null,
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    obtenerUsuarioPorId: (state) => (id: number) => state.usuarios.find(usuario => usuario.idUsuario === id),
    obtenerSalaPorId: (state) => (id: number) => state.salas.find(sala => sala.idSala === id),
    obtenerPuestoPorId: (state) => (id: number) => state.puestos.find(puesto => puesto.idPuesto === id),
  },

  actions: {
    async _llamadaApiFetch(metodo: string, url: string, datos: any = null, cabeceras: HeadersInit = {}) {
      this.cargando = true;
      this.error = null;
      try {
        const respuesta = await fetch(url, {
          method: metodo,
          headers: {
            'Content-Type': 'application/json',
            ...cabeceras,
            Authorization: `Bearer ${this.token}`
          },
          body: datos ? JSON.stringify(datos) : undefined
        });

        if (!respuesta.ok) {
          let mensajeError = `Error HTTP! estado: ${respuesta.status}`;
          try {
            const datosError = await respuesta.json();
            mensajeError = datosError.message || JSON.stringify(datosError);
          } catch (e) {
            mensajeError = await respuesta.text();
          }
          throw new Error(mensajeError);
        }

        const tipoContenido = respuesta.headers.get('content-type');
        if (tipoContenido && tipoContenido.includes('application/json')) {
          return await respuesta.json();
        }
        return {};
      } catch (error: any) {
        console.error(`Error al ${metodo} ${url}:`, error);
        this.error = error.message || `Error al ejecutar la acción en ${url}`;
        throw error;
      } finally {
        this.cargando = false;
      }
    },


    // usuarios metodos

    async obtenerTodosLosUsuarios() {
      const datos = await this._llamadaApiFetch('GET', 'https://localhost:7179/api/usuarios');
      this.usuarios = datos.map((usuario: any) => ({
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        idRol: usuario.idRol,
        fechaRegistro: usuario.fechaRegistro
      }));
    },
     // store inicial, se hará por correo  todo

 

    async agregarUsuario(datosUsuario: { nombre: string; apellidos: string; email: string; contrasenia: string; idRol: number }) {
      const nuevoUsuario = await this._llamadaApiFetch('POST', 'localhost:7179/api/usuarios', datosUsuario);
      await this.obtenerTodosLosUsuarios();
      return nuevoUsuario;
    },

    async actualizarUsuario(idUsuario: number, datosUsuario: Partial<Usuario>) {
      const usuarioActualizado = await this._llamadaApiFetch('PUT', `localhost:7179/api/usuarios/${idUsuario}`, datosUsuario);
      const indice = this.usuarios.findIndex(u => u.idUsuario === idUsuario);
      if (indice !== -1) {
        this.usuarios[indice] = { ...this.usuarios[indice], ...usuarioActualizado };
      }
      await this.obtenerTodosLosUsuarios();
      return usuarioActualizado;
    },

    async eliminarUsuario(idUsuario: number) {
      await this._llamadaApiFetch('DELETE', `localhost:7179/api/usuarios/${idUsuario}`);
      this.usuarios = this.usuarios.filter(u => u.idUsuario !== idUsuario);
    },

    
  }
});