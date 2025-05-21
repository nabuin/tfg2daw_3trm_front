<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RegisterStore } from "../store/RegisterStore.ts";

const registerStore = RegisterStore();
const router = useRouter();

// Variables datos del formulario y mensajes aclarativos
const nombre = ref("");
const apellidos = ref("");
const email = ref("");
const contrasenia = ref("");
const mensajeError = ref("");
const mensajeExito = ref("");

// Funcion flecha registro user
const registrarUsuario = async (event: Event) => {
  event.preventDefault();

  mensajeError.value = ""; // vuelve null cualquier mensaje de error que haya previamente
  mensajeExito.value = ""; // vuelve null cualquier mensaje de exito que haya previamente

  if (nombre.value && apellidos.value && email.value && contrasenia.value) /*comprobar q no falte ningun dato*/{
    const datosRegistro = {
      nombre: nombre.value,
      apellidos: apellidos.value,
      email: email.value,
      contrasenia: contrasenia.value,
    };

    const registroExitoso = await registerStore.registerUsuario(datosRegistro); // Llamar al store para registrar

    if (registroExitoso) {
      mensajeExito.value = registerStore.successMessage || "Registro añadido correctamente";
      setTimeout(() => {
        router.push("/userinfo"); // contador de 3,5 segundos para dar tiempo a leer el mensaje sin problemas, luego deberia redirigir a la zona privada
      }, 3500);
    } else {
      mensajeError.value = registerStore.errorMessage || "Error en el registro. Intentalo de nuevo.";
    }
  } else {
    mensajeError.value = "Todos los campos son obligatorios";
  }
};
</script>

<template>
  <div class="login">
    <form class="login__form" @submit="registrarUsuario">
      <input type="text" v-model="nombre" class="login__input login__input--full" placeholder="Nombre" required>
      <div class="login__row">
        <input type="text" v-model="apellidos" class="login__input" placeholder="Apellidos" required>
        <input type="email" v-model="email" class="login__input" placeholder="Correo" required>
      </div>
      <input type="password" v-model="contrasenia" class="login__input login__input--full" placeholder="Contraseña" required>

      <div v-if="mensajeExito" class="login__success">{{ mensajeExito }}</div>
      <div v-if="mensajeError" class="login__error">{{ mensajeError }}</div>
      <!-- elementos condicionales de si el registro se efectua o no para mostrar informacion aclarativa-->

      <button type="submit" class="login__button">→</button>
    </form>
  </div>
</template>

  
  <style lang="scss" scoped>
 /* Estilos Mobile First (por defecto para dispositivos pequeños) */
.login {
  width: 100vw;
  height: calc(100vh - 80px - 98px); /* Resta la altura del header */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EDE0D4;

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  &__row {
    display: flex;
    flex-direction: column; /* En móviles los inputs estarán en una columna */
    gap: 20px; /* Espacio entre los inputs */
  }

  &__input {
    width: 100%; /* Los inputs ocupan todo el ancho disponible */
    max-width: 300px; /* Max-width para los inputs en móviles */
    border: none;
    border-bottom: 1px solid #4A3F35;
    background: transparent;
    font-size: 16px;
    padding: 5px;
    outline: none;
    color: #4A3F35;

    &--full {
      width: 100%; /* La contraseña ocupa todo el ancho */
      max-width: 500px;
    }

    &::placeholder {
      color: #4A3F35;
      font-weight: bold;
      font-size: 14px;
      opacity: 0.7;
    }
  }

  &__button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #4A3F35;

    &:hover {
      transform: scale(1.1);
    }
  }

  &__error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
  }

  &__success {
    color: green;
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
  }
}

/* Media Query para pantallas de 768px o mayores */
@media (min-width: 768px) {
  .login {
    height: calc(100vh - 75px - 98px); /* Resta la altura del header */
    &__row {
      flex-direction: row; /* En pantallas medianas, los inputs se alinean horizontalmente */
    }
  }
}

/* Media Query para pantallas de 1024px o mayores */
@media (min-width: 1024px) {
  .login {
    height: calc(100vh - 80px - 98px); /* Resta la altura del header */
    &__row {
      flex-direction: row; /* En pantallas medianas, los inputs se alinean horizontalmente */
    }
  }

}

  </style>