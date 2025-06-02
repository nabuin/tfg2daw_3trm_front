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
     const endpointRegisterPOST = "https://coworkingapi.jblas.me/Auth/Register"; // cambiar esta URL cuando se lance en AWS con IP fija y mas adelante con un dominio

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
       
       // Intentar parsear como JSON para errores de validación
       try {
         const errorObj = JSON.parse(errorRegisterJWT);
         
         // Si tiene la estructura de errores de validación
         if (errorObj.errors && errorObj.errors.Contrasenia) {
           this.errorMessage = errorObj.errors.Contrasenia[0]; // Tomar el primer mensaje de error
         } else {
           // Si es otro tipo de error JSON, usar el title o message
           this.errorMessage = errorObj.title || errorObj.message || errorRegisterJWT;
         }
       } catch {
         // Si no es JSON válido, limpiar el prefijo "Error generating the token:"
         const cleanError = errorRegisterJWT.replace(/^Error generating the token:\s*/, '');
         this.errorMessage = cleanError || `${res.statusText}`;
       }
       
       this.successMessage = null;
       return false;
     }
   },
 },
});