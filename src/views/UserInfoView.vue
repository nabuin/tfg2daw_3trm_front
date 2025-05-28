<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useUserStore } from "../store/UserStore";
import { useReservationStore } from "../store/usuarioReservasStore";

const userStore = useUserStore();
const reservationStore = useReservationStore(); // necesaria para tener las reservas del usuario
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

// seccion de reservas del usuario

// formatear la fecha, la api devuelve: 04/06/2025 08:00 - 18/06/2025 19:00
const tramoHorarioFormateado = (range: string): string => {
  try {
    const [startStr, endStr] = range.split(" - ");

    // parsear la info recibida
    const parseDateString = (dateString: string): Date => {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);

      // output
      return new Date(year, month - 1, day, hour, minute);
    };

    const startDate = parseDateString(startStr);
    const endDate = parseDateString(endStr);

    // revisar si la fecha es válida    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Parsed date is Invalid Date:", range);
      return range; //si no es válida, devolver la original
    }
    // output que sacará
    const outputFormato: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // formato 24h, en vez de PM/AM 1/12
    };

    const formattedStart = startDate.toLocaleString("es-ES", outputFormato);
    const formattedEnd = endDate.toLocaleString("es-ES", outputFormato);

    return `${formattedStart} - ${formattedEnd}`;
  } catch (e) {
    console.error("Error formatting date range (outer catch):", e);
    return range; // Return original if any other error occurs
  }
};

// Function to fetch reservations, separated for reusability
const cargarReservasUsuario = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    reservationStore.error = "No hay token de autenticación disponible. Por favor, inicie sesión.";
    return;
  }

  // llamar a la función de la store para cargar las reservas
  await reservationStore.fetchUserReservations(token);
};


const confirmarCancelacion = async (reservationId: number) => {
  // popup de confirmación, si se le da a aceptar, se procede a cancelar la reserva
    if (confirm("¿Esta seguro que desea cancelar esta reserva? Esta acción no se puede deshacer.")) {
        errorMessage.value = "";
        successMessage.value = "";
        try {
            const token = localStorage.getItem("authToken"); // comprobar el token JWT
            if (!token) {
                errorMessage.value = "No has iniciado sesión para cancelar la reserva.";
                return;
            }
            await reservationStore.cancelarReserva(reservationId, token);
            successMessage.value = "Reserva cancelada con éxito."; // si da status 204
        } catch (error: any) {
          // excepcion si algo falla en la cancelación
            errorMessage.value = error.message || "Fallo al cancelar la reserva.";
            console.error("Error al cancelar la reserva:", error);
        }
    }
};


// revisar si el usuario está logueado y cargar reservas
watch(
  () => userStore.user,
  (newUser) => {
    if (newUser) {
      cargarReservasUsuario(); // cargar reservas del usuario
    }
  },
  { immediate: true } // cargar reservas al inicio
);


// User Info & Password Change Methods
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
    errorMessage.value = "No has iniciado sesión, ";
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
    errorMessage.value = "Error al obtener los datos del usuario.";
    console.error(error);
  }
};

onMounted(fetchUserData); // Fetch user data on component mount

const changePassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  validationErrorMessage.value = "";

  const token = localStorage.getItem("authToken");

  if (!token) {
    errorMessage.value = "No has iniciado sesión.";
    return;
  }

  if (!currentPassword.value || !newPassword.value) {
    errorMessage.value = "Por favor, completa ambos campos de contraseña.";
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

// validar el formato del email
const esFormatoEmail = (email: string): boolean => { 
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // revisa que tenga @ intercalado y acabe con un dominio (string).(string)
  return formatoEmail.test(email); // el .test comprueba que se cumple el formato de email, si no es, devolverá false y abajo en el if condicional parará el proceso dde cambio
};

const GuadarUserInfo = async () => {
  validationErrorMessage.value = "";
  errorMessage.value = ""; // reset mensajes de error
  successMessage.value = ""; // reset mensajes de éxito

  if (InfoUsuarioEditable.value.nombre.length > CHAR_LIMITS.nombre) {
    validationErrorMessage.value = `El nombre no puede exceder los ${CHAR_LIMITS.nombre} caracteres.`;
    return;
  }
  if (InfoUsuarioEditable.value.apellidos.length > CHAR_LIMITS.apellidos) {
    validationErrorMessage.value = `Los apellidos no pueden exceder los ${CHAR_LIMITS.apellidos} caracteres.`;
    return;
  }
  if (InfoUsuarioEditable.value.email.length > CHAR_LIMITS.email) {
    validationErrorMessage.value = `El correo electrónico no puede exceder los ${CHAR_LIMITS.email} caracteres.`;
    return;
  }
  // new filter
  if (!esFormatoEmail(InfoUsuarioEditable.value.email)) {
    validationErrorMessage.value = "El formato del email no es válido.";
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
    successMessage.value = "Información actualizada con éxito.";
    EditarUserInfo.value = false;
  } catch (error: any) {
    errorMessage.value =
      error.message || "Error al actualizar la información del perfil.";
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
  errorMessage.value = ""; // reset mensjaes de error
  successMessage.value = ""; // reset mensajes de éxito
};



// Función para verificar si se puede cancelar la reserva
const puedeSerCancelada = (rangoHorarioReserva: string): boolean => {
  try {
    console.log("Verificando reserva:", rangoHorarioReserva);
    
    let fechaFin: Date; // fecha y hora de fin que se usará para comparar
    
    // Verificar si el formato es "DD/MM/YYYY HH:mm - HH:mm" (mismo día)
    if (rangoHorarioReserva.includes(" - ") && !rangoHorarioReserva.split(" - ")[1].includes("/")) {
      // comprobar si es solo un dia y no varios en la reserva, tipo: 24/05/2025 08:00 - 09:00
      const [fechaHoraInicio, horaFin] = rangoHorarioReserva.split(" - "); // se separa el dia y fecha de inicio, y la hora de fin, fechaHoraInicio = 24/05/2025 08:00 y horaFin = 09:00
      const [datePart] = fechaHoraInicio.split(" "); // parte de la fecha (antes del espacio) = 24/05/2025
      const [day, month, year] = datePart.split("/").map(Number);
      const [hour, minute] = horaFin.split(":").map(Number);
      
      fechaFin = new Date(year, month - 1, day, hour, minute);
    } else {
      // Formato original: "04/06/2025 08:00 - 18/06/2025 19:00"
      const [, endStr] = rangoHorarioReserva.split(" - ");
      const [datePart, timePart] = endStr.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);
      
      fechaFin = new Date(year, month - 1, day, hour, minute);
    }
    
    // Crear la fecha/hora actual
    const ahora = new Date();
    
    console.log("Fecha fin de reserva:", fechaFin);
    console.log("Fecha actual:", ahora);
    console.log("¿Se puede cancelar?", fechaFin > ahora);
    
    // Verificar si la fecha de fin es mayor a la fecha actual
    return fechaFin > ahora;
  } catch (error) {
    console.error("Error al verificar si se puede cancelar la reserva:", error);
    return false; // En caso de error, no permitir cancelación por seguridad
  }
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

    <div class="main-content-grid">
      <div class="user-info-column">
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

      <div class="user-reservations-column">
        <div class="user-reservations">
          <h2 class="user-reservations__title">Mis Reservas</h2>

          <div v-if="reservationStore.loading" class="message loading">
            Cargando reservas...
          </div>

          <div v-else-if="reservationStore.error" class="message error">
            Error: {{ reservationStore.error }}
          </div>

          <div
            v-else-if="!reservationStore.reservations || reservationStore.reservations.length === 0"
            class="message no-data"
          >
            No tienes reservas activas.
          </div>

          <div v-else class="user-reservations__list">
            <div
              v-for="reservation in reservationStore.reservations"
              :key="reservation.idReserva"
              class="reservation-card"
            >
              <div class="reservation-card__image-wrapper">
                <img
                  :src="reservation.imagenSalaPrincipal"
                  :alt="`Imagen de la sala ${reservation.nombreSalaPrincipal}`"
                  class="reservation-card__image"
                  loading="lazy"
                />
              </div>
              <div class="reservation-card__details">
                <h3 class="reservation-card__title">
                  {{ reservation.nombreSalaPrincipal }}
                </h3>
                <p><strong>Ubicación:</strong> {{ reservation.direccionSedePrincipal }}, {{ reservation.ciudadSedePrincipal }}</p>
                <p><strong>Periodo:</strong> {{ tramoHorarioFormateado(reservation.rangoHorarioReserva) }}</p>
                <p><strong>Horas Reservadas:</strong> {{ reservation.cantidadHorasReservadas }}</p>
                <p class="reservation-card__price"><strong>Precio Total:</strong> {{ reservation.precioTotal.toFixed(2) }} €</p>
                          <div class="button-container">
                <div
            class="button-container"
            v-if="puedeSerCancelada(reservation.rangoHorarioReserva)"
          >
            <button
              @click="confirmarCancelacion(reservation.idReserva)"
              class="cancel-reservation-button"
            >
              Cancelar
            </button>
          </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">


.cancel-reservation-button {
    background-color: red;
    color: white;
    width: 100%;
    padding: 10px;
    font-size: 14px;
    margin-top: 10px;

    &:hover {
        background-color: #c82333; /* al pasar el raton */
    }
}

.reservation-card__details {
    display: flex;
    flex-direction: column;
}

.reservation-card__price {
    margin-top: auto;
}

.reservation-card__title {
    font-size: 20px;
}

.reservation-card p {
    font-size: 0.15px;
}


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
  font-size: 28px;
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
  font-size: 16px;

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
    text-decoration: underline;
    font-weight: bold;
  }
}

.success-message-full {
  background-color: #e6ffe6;
  border-left: 4px solid #33cc33;

  p {
    color: #008800;
  }
}

.main-content-grid {
  display: grid;
  grid-template-columns: 1fr; /*  solo una columna en movil */
  gap: 20px;
}

@media (min-width: 990px) { 
  .main-content-grid {
    grid-template-columns: 1fr 1fr; /*dos columnas para usuario info y reservas */
    gap: 30px;
  }
}

.user-info-column,
.user-reservations-column {
  display: flex;
  flex-direction: column;
}


.user-info-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

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
      min-width: 100px;
    }
  }
}

.change-password {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 25px;
  border: 1px solid #ddd;
}

.password-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
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
    box-sizing: border-box;
  }
}

button {
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
}

.main-action-button {
  background-color: blue;
  color: white;
  max-width: 300px;
  width: 100%;

  &:hover {
    background-color: blue;
  }
}

.edit-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
}

.save-button {
  background-color: green;
  flex: 1;

  &:hover {
    background-color: green;
  }
}

.cancel-button {
  background-color: red;
  flex: 1;

  &:hover {
    background-color: red;
  }
}

.response-message {
  margin-top: 15px;
  text-align: center;

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

.user-reservations {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  color: #333;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.user-reservations__title {
  text-align: center;
  color: blue;
  margin-bottom: 25px;
  font-size: 2em;
  border-bottom: 2px solid blue;
  padding-bottom: 10px;
  width: auto;
  margin-left: auto;
  margin-right: auto;
}

.user-reservations > .message { /* cualquier elemento con .mensaje */
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-reservations__list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* crea columnas que se ajustan automáticamente, de al menos 250px, y que comparten el espacio restante. */
}

.reservation-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  }
}

.reservation-card__image-wrapper {
  width: 100%;
  height: 160px;
  overflow: hidden; // oculta el contenido que se sale de los límites de un elemento
}

.reservation-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover; // ajusta apropiadamente la imagen al contenedor
  display: block;
}

.reservation-card__details {
  padding: 15px;
  flex-grow: 1;
}

.reservation-card__title {
  font-size: 1.20px; 
  color: black;
  margin-bottom: 8px;
  text-align: center;
}

.reservation-card p {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 5px;
}

.reservation-card strong {
  color: #555;
  margin-right: 5px;
}

.reservation-card__price {
  font-size: 1em;
  color: #27ae60;
  font-weight: bold;
  margin-top: 10px;
  border-top: 1px dashed #eee;
  padding-top: 8px;
  text-align: right;
}

@media (min-width: 768px) {
  .profile-page-wrapper {
    padding: 30px;
  }

  h1 {
    font-size: 32px;
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