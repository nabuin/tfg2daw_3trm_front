import { defineStore } from "pinia";

interface User {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  contrasenia: string;
  fechaRegistro: string;
  idRol: number;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null, // Almacena los datos del usuario
  }),

  actions: {
    async fetchUserData(token: string) {
      const endpoint = "https://localhost:7179/api/Usuarios/byIdConJWT";

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Se usa el token guardado
        },
      });

      if (res.ok) {
        const userData: User = await res.json();
        this.user = userData;

        console.log("Datos del usuario obtenidos:", this.user);
      } else {
        console.error("Error al obtener los datos del usuario");
        this.user = null;
      }
    },

    async cargarUsuarioFetch() {
      const token = localStorage.getItem("authToken");
      if (token) // si hay token, guarda la info del endpoint, que dará la info del usuario al que pertenezca el JWT q tengamos en el localstorage habiendo iniciado sesión
         {
        await this.fetchUserData(token);
      }
    },

    deleteUserData() {
      this.user = null; // toda info q haya se vuelve null
    },
  },
});