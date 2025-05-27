<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LoginStore } from "../store/LoginStore";

const loginStore = LoginStore();
const router = useRouter();

const usuario = ref("");
const password = ref("");
const mensajeError = ref("");

const login = async (event: Event) => {
  event.preventDefault(); // Evita que el formulario haga q se recargue la pagina
  mensajeError.value = "";

  if (usuario.value && password.value) { // prevenir que no falten campos por rellenar 
    const loginData = { email: usuario.value, contrasenia: password.value }; // crea el objeto q se enviará en el POST para luego recibir el token
    
    try {
      await loginStore.loginUsuario(loginData);
      
      if (loginStore.token) { // si recibe el token con exito 
        router.push("/userinfo");  // Cambiar a la ruta de la página privada de usuario con su data
      } else {
        mensajeError.value = loginStore.errorMessage || "Credenciales incorrectas";
      }
    } catch (error) {
     
        mensajeError.value = "Ha ocurrido un error, intenta nuevamente.";
      
    }
   
  } else { // si uno de los 2 campos o ambos no tienen valor
    mensajeError.value = "Usuario y contraseña son requeridos";
  }
};
</script>


<template>
  <div class="login">
    <form class="login__form" @submit="login">
      <input type="text" v-model="usuario" class="login__input" placeholder="Correo" required>
      <input type="password" v-model="password" class="login__input" placeholder="Contraseña" required>
      
      <div v-if="mensajeError" class="login__error">La contraseña y/o el correo son erroneos</div> <!-- v-if quiere decir que si la constante mensajeError tiene datos (es decir algo ha fallado), se mostrará, sino no, es decir que todo habrá funcionado-->
      
      <button type="submit" class="login__button">→</button>
      <router-link to="/register" class="login__register">¿No tienes cuenta? Registrarte</router-link>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: calc(100vh - 123px - 98px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color:white;

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 90%;
    max-width: 360px;
  }

  &__input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #4A3F35;
    background: transparent;
    font-size: 16px;
    padding: 5px;
    outline: none;
    color: #4A3F35;

    &::placeholder {
      color: #4A3F35;
      font-weight: bold;
      font-size: 14px;
      opacity: 0.7;
    }
  }

  &__error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
  }

  &__button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #4A3F35;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &__register {
    font-size: 12px;
    color: #4A3F35;
    text-decoration: none;
    margin-top: 10px;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 768px) {
    height: calc(100vh - 75px - 98px);

    &__form {
      gap: 20px;
      max-width: 400px;
    }

    &__input {
      font-size: 18px;
    }

    &__button {
      font-size: 20px;
    }
  }

  @media (min-width: 1024px) {
    height: calc(100vh - 80px - 98px);
    
    &__form {
      max-width: 450px;
    }

    &__input {
      font-size: 20px;
    }

    &__button {
      font-size: 22px;
    }
  }
}
</style>