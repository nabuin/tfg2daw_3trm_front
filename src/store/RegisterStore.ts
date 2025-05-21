import { defineStore } from "pinia";

// definicion de los datos usados en el proceso de Login y en relacion al backend
interface RegisterData {
  nombre: string;
  apellidos: string;
  email: string;
  contrasenia: string;
}

export const RegisterStore = defineStore("register", {
  state: () => ({
    token: null as string | null, // inicializa el token en null (esperando recibir el token de la API)
    successMessage: null as string | null, // mensaje 
    errorMessage: null as string | null, // Guarda el mensaje de error cuando ocurra
  }),

  actions: {
    async registerUsuario(registerData: RegisterData) {
      const endpointRegisterPOST = "https://localhost:7179/Auth/Register"; // cambiar esta URL cuando se lance en AWS con IP fija y mas adelante con un dominio

      const res = await fetch(endpointRegisterPOST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (res.ok) {
        // si el registro es exitoso
        this.successMessage = "Registro exitoso.";
        const textoToken = await res.text(); // no se usa res.json() porque el endpoint cuando recibe un post correcto devuelve el token en texto plano, sin formato JSON, si se usa res.json() dará error

        this.token = textoToken; // asigna el valor del string devuelvo por el endpoint a la variable token del state

        // Guardar el token en localStorage, se usará para proximos fetch del entorno cliente para autorizar las peticiones
        localStorage.setItem("authToken", textoToken);
        // luego para los gets de la api se deberá añadir el token en el header de la peticion, de la forma -> const token = localStorage.getItem("authToken");, añadiendolo de la forma  headers: {"Authorization": `Bearer ${token}`,
        this.errorMessage = null;
        return true;
      } else {
        const errorRegisterJWT = await res.text();
        this.errorMessage = errorRegisterJWT || ` ${res.statusText}`; // Captura el mensaje de error devuelto por la API
        this.successMessage = null;
        return false;
      }
    },
  },
});