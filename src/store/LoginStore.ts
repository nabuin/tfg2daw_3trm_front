import { defineStore } from "pinia";
import { useUserStore } from "./userStore"; 

interface LoginData {
  email: string;
  contrasenia: string;
}

export const LoginStore = defineStore("login", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    errorMessage: null as string | null,
  }),

  actions: {
    async loginUsuario(loginData: LoginData) {
      const endpointLoginPOST = "https://localhost:7179/Auth/Login";

      const res = await fetch(endpointLoginPOST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (res.ok) {
        const textoToken = await res.text(); // Se obtiene el token como texto plano

        this.token = textoToken;
        localStorage.setItem("authToken", textoToken);

        const userStore = useUserStore();
        await userStore.fetchUserData(textoToken);

        this.errorMessage = null;

        console.log("Datos del usuario tras login:", userStore.user);
        return true;
      } else {
        const errorLoginJWT = await res.text();
        this.errorMessage = errorLoginJWT || ` ${res.statusText}`;
        return false;
      }
    },

    logout() {
      // Elimina el token del localStorage
      localStorage.removeItem("authToken");

      // Limpia el token en la store
      this.token = null;

      // Limpia los datos del usuario
      const userStore = useUserStore();
      userStore.deleteUserData();
    },
  },
});