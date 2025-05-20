<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "../store/UserStore";

const userStore = useUserStore();
const errorMessage = ref(""); // si falla
const successMessage = ref(""); // si funciona
const currentPassword = ref(""); // Contraseña actual
const newPassword = ref(""); // Nueva contraseña

const darFormatoFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES');
};

const fetchUserData = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    errorMessage.value = "No has iniciado sesión, ";
    return;
  }

  try {
    await userStore.fetchUserData(token); // obtener info del usuario
  } catch (error) {
    errorMessage.value = "Error al obtener datos del usuario.";
    console.error(error);
  }
};

// Llamar la función al montar el componente
onMounted(fetchUserData);

// cambiar contraseña (usando el endpoint con JWT)
const changePassword = async () => {
  // Limpiar mensajes anteriores
  errorMessage.value = "";
  successMessage.value = "";

  const token = localStorage.getItem("authToken");

  if (!token) {
    errorMessage.value = "No has iniciado sesión.";
    return;
  }

  if (!currentPassword.value || !newPassword.value) {
    errorMessage.value = "Por favor, completa todos los campos.";
    return;
  }

  const idUsuario = userStore.user?.idUsuario;

  if (!idUsuario) {
    errorMessage.value = "No se pudo obtener el ID del usuario.";
    return;
  }

  try {
    const response = await fetch("https://laoficinaapi.retocsv.es/Auth/ChangePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        idUsuario: idUsuario,
        oldPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cambiar la contraseña");
    }

    successMessage.value = "Contraseña cambiada con éxito";
    currentPassword.value = ""; // limpiar info
    newPassword.value = "";
  } catch (error) {
    errorMessage.value = "Error al cambiar la contraseña. Inténtalo de nuevo.";
    console.error(error);
  }
};
</script>

<template>
  <div class="profile-container">
    <h1>Perfil del Usuario</h1>

    <div v-if="errorMessage" class="error">
      <p>{{ errorMessage }}
        <router-link to="/login" class="link">pulsa aquí para iniciar sesión o registrarte</router-link>
      </p>
    </div>

    <div v-if="successMessage" class="success">
      <p>{{ successMessage }}</p>
    </div>

    <div v-else class="user-info">
      <p><strong>Nombre:</strong> {{ userStore.user?.nombre }}</p>
      <p><strong>Apellidos:</strong> {{ userStore.user?.apellidos }}</p>
      <p><strong>Email:</strong> {{ userStore.user?.email }}</p>
      <p><strong>Fecha Registro:</strong> {{ darFormatoFecha(userStore.user?.fechaRegistro ?? '') }}</p>

      <div class="change-password">
        <h3>Cambiar Contraseña</h3>
        <div class="password-fields">
          <div class="password-field">
            <label for="newPassword">Nueva Contraseña</label>
            <input type="password" id="newPassword" v-model="newPassword" />
          </div>
          <div class="password-field">
            <label for="currentPassword">Contraseña Actual</label>
            <input type="password" id="currentPassword" v-model="currentPassword" />
          </div>
        </div>
        <button @click="changePassword">Cambiar Contraseña</button>

        <div v-if="errorMessage || successMessage" class="response-message">
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-container {
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 24px;
}

h3 {
  color: #444;
  margin: 20px 0 15px 0;
  font-size: 18px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.error {
  background-color: #ffe6e6;
  border-left: 4px solid #ff3333;
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: center;

  p {
    color: #cc0000;
    margin: 0;
  }

  .link {
    color: #0066cc;
    text-decoration: underline;
  }
}

.success {
  background-color: #e6ffe6;
  border-left: 4px solid #33cc33;
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 4px;

  p {
    color: #008800;
    margin: 0;
  }
}

.user-info {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  p {
    margin: 8px 0;
    padding: 8px 0;
    border-bottom: 1px solid #eee;

    strong {
      color: #555;
      display: inline-block;
      width: 40%;
    }
  }
}

.change-password {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-top: 25px;
  border: 1px solid #ddd;
  width: 100%;
}

.password-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.password-field {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
    color: #555;
    font-size: 14px;
  }

  input, select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
}

.response-message {
  margin-top: 15px;

  .error-message {
    color: #cc0000;
  }

  .success-message {
    color: #008800;
  }
}

@media (min-width: 768px) {
  .profile-container {
    padding: 30px;
  }

  h1 {
    font-size: 28px;
  }

  .user-info {
    padding: 30px;
  }

  .password-fields {
    flex-direction: row;
    gap: 20px;

    .password-field {
      width: 48%;
    }
  }

  button {
    width: auto;
    padding: 10px 25px;
  }
}
</style>