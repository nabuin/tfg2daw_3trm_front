<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../store/UserStore";

const userStore = useUserStore();
const errorMessage = ref("");
const successMessage = ref("");
const currentPassword = ref("");
const newPassword = ref("");
const validationErrorMessage = ref(""); // errores

// limite de chars de cada campo acorde a lo que admite la bbdd
const CHAR_LIMITS = {
    nombre: 100,
    apellidos: 255,
    email: 255,
};

// State for editable fields
const EditarUserInfo = ref(false);
const InfoUsuarioEditable = ref({
    nombre: "",
    apellidos: "",
    email: "",
});

const darFormatoFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString("es-ES");
};

const userRole = computed(() => {
    if (userStore.user?.idRol === 1) {
        return "Administrador";
    } else if (userStore.user?.idRol === 2) {
        return "Cliente";
    } else {
        return "Desconocido"; // no hay otros IDs, solo por si acaso
    }
});

const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        errorMessage.value = "You are not logged in, ";
        return;
    }

    try {
        await userStore.fetchUserData(token);
        if (userStore.user) {
            InfoUsuarioEditable.value.nombre = userStore.user.nombre;
            InfoUsuarioEditable.value.apellidos = userStore.user.apellidos;
            InfoUsuarioEditable.value.email = userStore.user.email;
        }
    } catch (error) {
        errorMessage.value = "Error fetching user data.";
        console.error(error);
    }
};

onMounted(fetchUserData);

const changePassword = async () => {
    errorMessage.value = "";
    successMessage.value = "";
    validationErrorMessage.value = ""; // borrar mensajes de error previos

    const token = localStorage.getItem("authToken");

    if (!token) {
        errorMessage.value = "No has iniciado sesión.";
        return;
    }

    if (!currentPassword.value || !newPassword.value) {
        errorMessage.value = "Please complete all fields.";
        return;
    }

    const idUsuario = userStore.user?.idUsuario;

    if (!idUsuario) {
        errorMessage.value = "No se pudo obtener el ID del usuario.";
        return;
    }

    try {
        const response = await fetch("https://localhost:7179/Auth/ChangePassword", {
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
            const errorText = await response.text();
            let detailedError = "Error al cambiar la contraseña";
            try {
                const errorJson = JSON.parse(errorText);
                detailedError = errorJson.message || errorJson.detail || detailedError;
            } catch {
                detailedError = errorText || detailedError;
            }
            throw new Error(detailedError);
        }

        successMessage.value = "Contraseña cambiada con éxito";
        currentPassword.value = "";
        newPassword.value = "";
    } catch (error: any) {
        errorMessage.value = error.message || "Error al cambiar la contraseña. Inténtalo de nuevo.";
        console.error(error);
    }
};

const ComenzarCambioInfo = () => {
    EditarUserInfo.value = true;
    validationErrorMessage.value = "";
};

const GuadarUserInfo = async () => {
    validationErrorMessage.value = "";
    errorMessage.value = ""; // borrar mensajes de error previos
    successMessage.value = ""; // borrar mensajes de exito previos

    if (InfoUsuarioEditable.value.nombre.length > CHAR_LIMITS.nombre) {
        validationErrorMessage.value = `Name cannot exceed ${CHAR_LIMITS.nombre} characters.`;
        return;
    }
    if (InfoUsuarioEditable.value.apellidos.length > CHAR_LIMITS.apellidos) {
        validationErrorMessage.value = `Last name cannot exceed ${CHAR_LIMITS.apellidos} characters.`;
        return;
    }
    if (InfoUsuarioEditable.value.email.length > CHAR_LIMITS.email) {
        validationErrorMessage.value = `Email cannot exceed ${CHAR_LIMITS.email} characters.`;
        return;
    }

    const token = localStorage.getItem("authToken");
    const idUsuario = userStore.user?.idUsuario;

    if (!token || !idUsuario) {
        errorMessage.value = "No has iniciado sesión.";
        return;
    }

    try {
        await userStore.updateUserProfile(
            idUsuario,
            InfoUsuarioEditable.value.nombre,
            InfoUsuarioEditable.value.apellidos,
            InfoUsuarioEditable.value.email,
            token
        );
        successMessage.value = "Informacion actualizada";
        EditarUserInfo.value = false;
    } catch (error: any) {
        errorMessage.value =
            error.message || "Error actualizando la info del perfil";
        console.error("Error actualizando el perfil:", error);
    }
};

const cancelarEditar = () => {
    if (userStore.user) {
        InfoUsuarioEditable.value.nombre = userStore.user.nombre;
        InfoUsuarioEditable.value.apellidos = userStore.user.apellidos;
        InfoUsuarioEditable.value.email = userStore.user.email;
    }
    EditarUserInfo.value = false;
    validationErrorMessage.value = "";
    errorMessage.value = ""; // limpiar mensajes de error al cancelar
    successMessage.value = ""; // limpiar mensajes de exito al cancelar
};
</script>

<template>
    <div class="profile-page-wrapper">
        <h1>Perfil del Usuario</h1>

        <div v-if="errorMessage && !EditarUserInfo" class="error-message-full">
            <p>{{ errorMessage }}
                <router-link to="/login" class="link">pulsa aquí para iniciar sesión o registrarte</router-link>
            </p>
        </div>

        <div v-if="successMessage && !EditarUserInfo" class="success-message-full">
            <p>{{ successMessage }}</p>
        </div>

        <div class="content-sections">
            <div class="user-info-section">
                <div v-if="userStore.user" class="user-info">
                    <div v-if="!EditarUserInfo">
                        <p><strong>Nombre:</strong> {{ userStore.user?.nombre }}</p>
                        <p><strong>Apellidos:</strong> {{ userStore.user?.apellidos }}</p>
                        <p><strong>Email:</strong> {{ userStore.user?.email }}</p>
                        <p><strong>Rol:</strong> {{ userRole }}</p>
                        <p><strong>Fecha Registro:</strong> {{ darFormatoFecha(userStore.user?.fechaRegistro ?? '') }}
                        </p>
                        <div class="button-container">
                            <button @click="ComenzarCambioInfo" class="main-action-button">Editar Perfil</button>
                        </div>
                    </div>

                    <div v-else class="edit-profile-form">
                        <div v-if="validationErrorMessage" class="error-message-inline">
                            <p>{{ validationErrorMessage }}</p>
                        </div>

                        <div class="form-group">
                            <label for="editNombre">Nombre:</label>
                            <input type="text" id="editNombre" v-model="InfoUsuarioEditable.nombre" />
                        </div>
                        <div class="form-group">
                            <label for="editApellidos">Apellidos:</label>
                            <input type="text" id="editApellidos" v-model="InfoUsuarioEditable.apellidos" />
                        </div>
                        <div class="form-group">
                            <label for="editEmail">Email:</label>
                            <input type="email" id="editEmail" v-model="InfoUsuarioEditable.email" />
                        </div>
                        <p><strong>Rol:</strong> {{ userRole }}</p>
                        <p><strong>Fecha Registro:</strong> {{ darFormatoFecha(userStore.user?.fechaRegistro ?? '') }}
                        </p>
                        <div class="edit-buttons">
                            <button @click="GuadarUserInfo" class="save-button">Guardar Cambios</button>
                            <button @click="cancelarEditar" class="cancel-button">Cancelar</button>
                        
                        </div>
                              <div v-if="errorMessage || successMessage" class="response-message">
                            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
                        </div>
                    </div>

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
                        <div class="button-container">
                            <button @click="changePassword" class="main-action-button">Cambiar Contraseña</button>
                        </div>
                    </div>
                </div>
                <div v-else-if="!errorMessage" class="loading-message">
                    <p>Cargando información del usuario...</p>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped lang="scss">
.profile-page-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f8f9fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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

.error-message-full,
.success-message-full {
    background-color: #ffe6e6;
    border-left: 4px solid #ff3333;
    padding: 10px 15px;
    margin-bottom: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        margin: 0;
    }
}

.error-message-full {
    p {
        color: #cc0000;
    }

    .link {
        color: #0066cc;
    }
}

.success-message-full {
    background-color: #e6ffe6;
    border-left: 4px solid #33cc33;

    p {
        color: #008800;
    }
}

.content-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-grow: 1;
}

.user-info-section {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    box-sizing: border-box;
    flex: 1;
    margin: 0 auto;
}


.user-info {
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
    width: 100%;
}

.password-field,
.form-group {
    display: flex;
    flex-direction: column;

    label {
        margin-bottom: 5px;
        color: #555;
        font-size: 14px;
    }

    input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        width: 100%;
    }
}

button {
    border: none;
    border-radius: 4px;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;
    color: white;
}

.button-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 15px;
}

.main-action-button {
    background-color: #007bff;
    color: white;
    max-width: 300px;
    width: 100%;

    &:hover {
        background-color: #0056b3;
    }
}

.edit-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
}

.save-button {
    background-color: #28a745;
    flex: 1;

    &:hover {
        background-color: #218838;
    }
}

.cancel-button {
    background-color: #dc3545;
    flex: 1;

    &:hover {
        background-color: #c82333;
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

.error-message-inline {
    background-color: #ffe6e6;
    border-left: 4px solid #ff3333;
    padding: 8px 12px;
    margin-bottom: 15px;
    border-radius: 4px;

    p {
        color: #cc0000;
        margin: 0;
        font-size: 14px;
    }
}

.loading-message {
    text-align: center;
    padding: 20px;
    color: #555;
}

@media (min-width: 768px) {
    .profile-page-wrapper {
        padding: 30px;
    }

    h1 {
        font-size: 28px;
    }

    .content-sections {
        flex-direction: column;
        align-items: center;
    }

    .password-fields {
        flex-direction: row;
        gap: 20px;

        .password-field {
            width: 48%;
        }
    }

    .edit-profile-form .form-group {
        flex-direction: row;
        align-items: center;

        label {
            width: 100px;
            text-align: right;
            margin-bottom: 0;
            padding-right: 10px;
        }

        input {
            flex: 1;
        }
    }

    .edit-buttons {
        button {
            flex: 1;
        }
    }
}
</style>