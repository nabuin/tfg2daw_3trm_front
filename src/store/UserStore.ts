import { defineStore } from "pinia";

interface User {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  email: string;
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



    async updateUserProfile( // metodo para actualizar el perfil del usuario correo nombre y apellidos
      idUsuario: number,
      nombre: string,
      apellidos: string,
      token: string,
      idRol: number
    ){
      const endpoint = `https://localhost:7179/api/Usuarios/${idUsuario}`;

      try {
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ idUsuario, nombre, apellidos, idRol }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to update user profile."
          );
        }

        // acutalizar la info de la store de usuario con la nueva info para no tener que hacer un get completo
        if (this.user) {
          this.user.nombre = nombre;
          this.user.apellidos = apellidos;
        }
        console.log("Info del usuario actualizada:", this.user); // debug
      } catch (error) {
        console.error("Error actualizando info del usuario:", error); // debug
        throw error;
      }
    }
,
    // funcion para cerrar sesion
  logout() {
      localStorage.removeItem("authToken"); // borrar el token
      this.user = null; // poner el array del usuario a null
    },



    deleteUserData() {
      this.user = null; // toda info q haya se vuelve null
    },
  },
});