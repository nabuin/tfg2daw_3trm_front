<template>
  <div>
    <p v-if="loading" class="puesto-selection__loading-message">
      cargando puestos disponibles…
    </p>

    <div v-else>
      <div class="puesto-selection__tables-grid">
        <div v-for="(group, gi) in seatGroups" :key="gi" class="puesto-selection__table-layout">
          <button v-for="(puesto, idx) in group"
                  :key="puesto.idPuestoTrabajo"
                  class="square puesto-selection__seat"
                  :class="[
                    positionClass(idx),
                    {
                      unavailable: puesto.disponibilidadesEnRango?.some(s => !s.estado),
                      selected: selectedPuestos.some(sp => sp.idPuestoTrabajo === puesto.idPuestoTrabajo),
                      selectedPrivate: puesto.idTipoPuestoTrabajo === 2
                    }
                  ]"
                  :disabled="puesto.disponibilidadesEnRango?.some(s => !s.estado)"
                  @click="handlePuestoClick(puesto)">
            <svg class="puesto-selection__silla-icon" width="50" height="50" viewBox="0 0 120 120">
              <g class="puesto-selection__chair-wheels">
                <circle cx="60" cy="95" r="5" />
                <circle cx="35" cy="75" r="5" />
                <circle cx="85" cy="75" r="5" />
                <circle cx="25" cy="45" r="5" />
                <circle cx="95" cy="45" r="5" />
              </g>
              <rect class="puesto-selection__chair-seat" x="30" y="30" width="60" height="50" rx="8" ry="8" />
              <rect class="puesto-selection__chair-back" x="35" y="15" width="50" height="15" rx="7" ry="7" />
            </svg>
          </button>

          <div class="puesto-selection__table">
            <svg class="puesto-selection__mesa-icon" width="120" height="130" viewBox="0 0 120 120">
              <rect x="20" y="20" width="80" height="100" rx="6" ry="6" />
            </svg>
          </div>
        </div>
      </div>

      <div v-if="errorSeleccionPuestos" class="puesto-selection__error-message">
        {{ errorSeleccionPuestos }}
      </div>

      <button class="puesto-selection__continue-button" @click="continuarCompra">
        continuar
      </button>
    </div>

    <div v-if="showPopup" class="popup-overlay" @click.self="showPopup = false">
      <div class="popup-rect">
        <div class="login">
          <form class="login__form" @submit.prevent="login">
            <input type="text" v-model="usuario" class="login__input" placeholder="Correo" required>
            <input type="password" v-model="password" class="login__input" placeholder="Contraseña" required>
            <div v-if="mensajeError" class="login__error">{{ mensajeError }}</div>
            <button type="submit" class="login__button" :disabled="isLoggingIn">
              {{ isLoggingIn ? '...' : '→' }}
            </button>
            <router-link to="/register" class="login__register">¿No tienes cuenta? Registrarte</router-link>
          </form>
        </div>
        <button @click="showPopup = false">cerrar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';
import { useReservasStore } from '../store/reservasStore';
import { LoginStore } from '../store/LoginStore';
import { storeToRefs } from 'pinia';

// función que divide un array en partes más pequeñas
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default defineComponent({
  name: 'PuestoSelectionAroundTable',
  setup() {
    const router = useRouter(); // acceso al router para navegar entre páginas
    const puestosStore = usePuestosStore(); // store de los puestos
    const salaStore = useSalaSeleccionadaStore(); // store de la sala actual
    const filtrosStore = useFiltrosStore(); // store de filtros aplicados
    const reservasStore = useReservasStore(); // store de las reservas
    const loginStore = LoginStore(); // store para el login

    // referencias a datos del store (reactivos)
    const { puestosDisponibles, loading } = storeToRefs(puestosStore);
    const { selectedPuestos, isReserving } = storeToRefs(reservasStore);

    // control de login y errores
    const showPopup = ref(false); // muestra el popup de login
    const errorSeleccionPuestos = ref<string | null>(null); // mensaje de error al no seleccionar puestos

    const usuario = ref(''); // campo email login
    const password = ref(''); // campo contraseña login
    const mensajeError = ref<string | null>(null); // mensaje de error del login
    const isLoggingIn = ref(false); // evita doble login

    // al montar el componente
    onMounted(() => {
      // si no hay sala seleccionada válida, se redirige al home
      if (salaStore.id === null || salaStore.id < 1) {
        console.log('[redirección] no hay sala seleccionada, volviendo al home');
        router.push('/home');
        return;
      }

      // si hay una sala seleccionada, se piden los puestos disponibles
      puestosStore.obtenerPuestosDisponibles().then(() => {
        const puestosPrivados = puestosDisponibles.value.filter(p => p.idTipoPuestoTrabajo === 2);
        reservasStore.setPuestoDisponibilidades(puestosDisponibles.value);
        reservasStore.resetSelection();
        puestosPrivados.forEach(p => reservasStore.togglePuestoSelection(p));
      });
    });

    // cuando cambian filtros o sala, se vuelven a cargar los puestos
    watch(
      () => [
        salaStore.id,
        filtrosStore.fechaInicio,
        filtrosStore.fechaFin,
        filtrosStore.horaInicio,
        filtrosStore.horaFin,
      ],
      async () => {
        if (salaStore.id !== null && salaStore.id > 0) {
          await puestosStore.obtenerPuestosDisponibles();
          const puestosPrivados = puestosDisponibles.value.filter(p => p.idTipoPuestoTrabajo === 2);
          reservasStore.setPuestoDisponibilidades(puestosDisponibles.value);
          reservasStore.resetSelection();
          puestosPrivados.forEach(p => reservasStore.togglePuestoSelection(p));
        }
      },
      { immediate: true } // también se ejecuta al principio
    );

    // cuando se hace clic en un puesto
    function handlePuestoClick(puesto: any) {
      // si el puesto es tipo privado, no hace nada
      if (puesto.idTipoPuestoTrabajo === 2) return;
      // si no, alterna su selección
      reservasStore.togglePuestoSelection(puesto);
    }

    // función para enviar la reserva (compra)
    function submitCompra() {
      reservasStore.createReservation('compra de puestos');
    }

    // asigna una clase css según la posición del asiento (para estilos en la mesa)
    function positionClass(index: number): string {
      return [
        'seat-left-top',
        'seat-right-top',
        'seat-left-bottom',
        'seat-right-bottom'
      ][index] || '';
    }

    // proceso de login del popup
    async function login() {
      if (isLoggingIn.value) return;

      isLoggingIn.value = true;
      mensajeError.value = null;

      try {
        const loginData = {
          email: usuario.value,
          contrasenia: password.value
        };

        // intenta logearse
        const exito = await loginStore.loginUsuario(loginData);

        if (exito) {
          // si fue bien, cierra el popup y limpia los campos
          showPopup.value = false;
          usuario.value = '';
          password.value = '';
          mensajeError.value = null;
          router.push('/sedes/salas/puestos/pago'); // va a la pantalla de pago
        } else {
          // si falla, muestra el mensaje del backend o uno genérico
          let mensajeErrorAPI = loginStore.errorMessage || 'la contraseña y/o el correo son erróneos';
          if (mensajeErrorAPI.includes('Error generating the token: ')) {
            mensajeErrorAPI = mensajeErrorAPI.split('Error generating the token: ')[1];
          }
          mensajeError.value = mensajeErrorAPI;
        }
      } catch (error) {
        console.error('error durante el login:', error);
        mensajeError.value = 'error de conexión. inténtalo de nuevo.';
      } finally {
        isLoggingIn.value = false;
      }
    }

    // función que se ejecuta al hacer clic en “continuar”
    function continuarCompra() {
      // si no hay puestos seleccionados, muestra error
      if (selectedPuestos.value.length === 0) {
        errorSeleccionPuestos.value = "por favor, selecciona al menos un puesto para continuar.";
        setTimeout(() => {
          errorSeleccionPuestos.value = null;
        }, 6000);
        return;
      }

      errorSeleccionPuestos.value = null;

      // revisa si el usuario está logeado
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        // si no, muestra el popup de login
        showPopup.value = true;
      } else {
        // si sí, va directo al pago
        router.push('/sedes/salas/puestos/pago');
      }
    }

    // agrupa los asientos de 4 en 4 para mostrarlos alrededor de una mesa
    const seatGroups = computed(() => chunkArray(puestosDisponibles.value, 4));

    // se devuelven todas las variables y funciones necesarias para la plantilla
    return {
      loading,
      seatGroups,
      selectedPuestos,
      isReserving,
      handlePuestoClick,
      submitCompra,
      positionClass,
      showPopup,
      continuarCompra,
      errorSeleccionPuestos,
      usuario,
      password,
      mensajeError,
      isLoggingIn,
      login,
    };
  },
});
</script>



<style scoped lang="scss">
.puesto-selection__loading-message {
  text-align: center;
  padding: 1em;
  font-weight: 600;
  font-size: 1.1em;
  color: #555;
}

.puesto-selection__tables-grid {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 48px 32px;
  justify-content: center;
  padding: 32px;
  border-radius: 8px;
}

.puesto-selection__table-layout {
  display: grid;
  grid-template-columns: 50px 120px 50px;
  grid-template-rows: 50px 50px;
  gap: 16px;
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  justify-items: center;
  align-items: center;
}

.puesto-selection__seat {
  &.unavailable .puesto-selection__chair-seat,
  &.unavailable .puesto-selection__chair-back {
    fill: #ff0000;
  }

  &.selected .puesto-selection__chair-seat,
  &.selected .puesto-selection__chair-back {
    fill: #ffff00;
  }

  &.selectedPrivate .puesto-selection__chair-seat,
  &.selectedPrivate .puesto-selection__chair-back {
    fill: #ffff00;
  }

  &.selectedPrivate {
    cursor: not-allowed;
  }
}

.puesto-selection__silla-icon {
  width: 100%;
  height: 100%;
}

.puesto-selection__chair-wheels circle {
  fill: #000;
  stroke: #000;
  stroke-width: 4;
}

.puesto-selection__chair-seat,
.puesto-selection__chair-back {
  fill: #fff;
  stroke: #000;
  stroke-width: 4;
}

.puesto-selection__mesa-icon rect {
  fill: #ddd;
  stroke: #333;
  stroke-width: 2;
}

.puesto-selection__table {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.puesto-selection__error-message {
  background-color: #ffcccc;
  color: #cc0000;
  border: 1px solid #cc0000;
  padding: 10px 15px;
  margin: 10px auto;
  border-radius: 8px;
  font-size: 0.95em;
  font-weight: bold;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.puesto-selection__continue-button {
  display: block;
  margin: 16px auto 0;
  padding: 12px 32px;
  font-size: 1em;
  font-weight: 600;
  color: #333;
  background: #fafafa;
  border: 1px solid #999;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color .2s, transform .2s;
}

.puesto-selection__continue-button:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .puesto-selection__tables-grid {
    grid-template-columns: repeat(2, max-content);
  }
}

@media (max-width: 600px) {
  .puesto-selection__tables-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 675px) {
  .puesto-selection__tables-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
