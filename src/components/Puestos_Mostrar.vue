<template>
  <div>
    <!-- 1. cargando… -->
    <p v-if="loading" class="loading-message">
      cargando puestos disponibles…
    </p>

    <!-- 2. cuando ya cargó, pintamos las mesas en filas de 3 -->
    <div v-else>
      <div class="tables-grid">
        <!-- para cada grupo de 4 puestos hacemos un bloque -->
        <div v-for="(group, gi) in seatGroups" :key="gi" class="table-layout">
          <!-- 2.1 cada puesto: botón con SVG inline de silla -->
          <button v-for="(puesto, idx) in group" :key="puesto.idPuestoTrabajo" class="square" :class="[
            positionClass(idx),
            {
              unavailable: puesto.disponibilidadesEnRango?.some(s => !s.estado),
              selected: selectedPuestos.some(sp => sp.idPuestoTrabajo === puesto.idPuestoTrabajo),
              selectedPrivate: puesto.idTipoPuestoTrabajo === 2
            }
          ]" :disabled="puesto.disponibilidadesEnRango?.some(s => !s.estado)" @click="handlePuestoClick(puesto)">
            <svg class="silla-icon" width="50" height="50" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <g class="chair-wheels">
                <circle cx="60" cy="95" r="5" />
                <circle cx="35" cy="75" r="5" />
                <circle cx="85" cy="75" r="5" />
                <circle cx="25" cy="45" r="5" />
                <circle cx="95" cy="45" r="5" />
              </g>
              <rect class="chair-seat" x="30" y="30" width="60" height="50" rx="8" ry="8" />
              <rect class="chair-back" x="35" y="15" width="50" height="15" rx="7" ry="7" />
            </svg>
          </button>

          <!-- 2.2 la mesa en medio: SVG inline de mesa -->
          <div class="table">
            <svg class="mesa-icon" width="120" height="130" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <!-- Ajusta el alto de la mesa modificando el atributo height -->
              <rect x="20" y="20" width="80" height="100" rx="6" ry="6" />
            </svg>
          </div>
        </div>
      </div>


      <div v-if="errorSeleccionPuestos" class="error-message">
        {{ errorSeleccionPuestos }}
      </div>

      <!-- 4. botón continuar -->
      <button class="continue-button" @click="continuarCompra">
        continuar
      </button>
    </div>

    <!-- 5. popup -->
    <div v-if="showPopup" class="popup-overlay" @click.self="showPopup = false">
      <div class="popup-rect">
        <div class="login">
          <form class="login__form" @submit.prevent="login">
            <input type="text" v-model="usuario" class="login__input" placeholder="Correo" required>
            <input type="password" v-model="password" class="login__input" placeholder="Contraseña" required>

            <div v-if="mensajeError" class="login__error">{{ mensajeError }}</div>
            <!-- v-if quiere decir que si la constante mensajeError tiene datos (es decir algo ha fallado), se mostrará, sino no, es decir que todo habrá funcionado-->

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
    const router = useRouter();
    const puestosStore = usePuestosStore();
    const salaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();
    const reservasStore = useReservasStore();
    const loginStore = LoginStore();

    const { puestosDisponibles, loading } = storeToRefs(puestosStore);
    const { selectedPuestos, isReserving } = storeToRefs(reservasStore);

    const showPopup = ref(false);
    const errorSeleccionPuestos = ref<string | null>(null);

    const usuario = ref('');
    const password = ref('');
    const mensajeError = ref<string | null>(null);
    const isLoggingIn = ref(false);

    onMounted(() => {
      if (salaStore.id !== null) {
        puestosStore.obtenerPuestosDisponibles().then(() => {
          const puestosPrivados = puestosDisponibles.value.filter(p => p.idTipoPuestoTrabajo === 2);
          reservasStore.setPuestoDisponibilidades(puestosDisponibles.value);
          reservasStore.resetSelection();
          puestosPrivados.forEach(p => reservasStore.togglePuestoSelection(p));
        });
      }
    });

    watch(
      () => [
        salaStore.id,
        filtrosStore.fechaInicio,
        filtrosStore.fechaFin,
        filtrosStore.horaInicio,
        filtrosStore.horaFin,
      ],
      async () => {
        if (salaStore.id !== null) {
          await puestosStore.obtenerPuestosDisponibles();
          const puestosPrivados = puestosDisponibles.value.filter(p => p.idTipoPuestoTrabajo === 2);
          reservasStore.setPuestoDisponibilidades(puestosDisponibles.value);
          reservasStore.resetSelection();
          puestosPrivados.forEach(p => reservasStore.togglePuestoSelection(p));
        }
      },
      { immediate: true }
    );

    function handlePuestoClick(puesto: any) {
      if (puesto.idTipoPuestoTrabajo === 2) return;
      reservasStore.togglePuestoSelection(puesto);
    }

    function submitCompra() {
      reservasStore.createReservation('compra de puestos');
    }

    function positionClass(index: number): string {
      return [
        'seat-left-top',
        'seat-right-top',
        'seat-left-bottom',
        'seat-right-bottom'
      ][index] || '';
    }

    async function login() {
      if (isLoggingIn.value) return;

      isLoggingIn.value = true;
      mensajeError.value = null;

      try {
        const loginData = {
          email: usuario.value,
          contrasenia: password.value
        };

        const exito = await loginStore.loginUsuario(loginData);

        if (exito) {
          showPopup.value = false;
          usuario.value = '';
          password.value = '';
          mensajeError.value = null;
          router.push('/sedes/salas/puestos/pago');
        } else {
          let mensajeErrorAPI = loginStore.errorMessage || 'La contraseña y/o el correo son erróneos';
          if (mensajeErrorAPI.includes('Error generating the token: ')) {
            mensajeErrorAPI = mensajeErrorAPI.split('Error generating the token: ')[1];
          }
          mensajeError.value = mensajeErrorAPI;
        }
      } catch (error) {
        console.error('Error durante el login:', error);
        mensajeError.value = 'Error de conexión. Inténtalo de nuevo.';
      } finally {
        isLoggingIn.value = false;
      }
    }

    function continuarCompra() {
      if (selectedPuestos.value.length === 0) {
        errorSeleccionPuestos.value = "Por favor, selecciona al menos un puesto para continuar.";
        setTimeout(() => {
          errorSeleccionPuestos.value = null;
        }, 6000);
        return;
      }

      errorSeleccionPuestos.value = null;

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        showPopup.value = true;
      } else {
        router.push('/sedes/salas/puestos/pago');
      }
    }

    const seatGroups = computed(() => chunkArray(puestosDisponibles.value, 4));

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
.error-message {
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

.loading-message {
  text-align: center;
  padding: 1em;
  font-weight: 600;
  font-size: 1.1em;
  color: #555;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(3, max-content); // 3 columnas por defecto
  gap: 48px 32px;
  justify-content: center;
  padding: 32px;
  border-radius: 8px;
}

/* Centro si es único en la última fila */
.tables-grid>.table-layout:last-child:nth-child(3n+1) {
  grid-column: 2;
}

/* Responsive: 2 columnas hasta 900px */
@media (max-width: 900px) {
  .tables-grid {
    grid-template-columns: repeat(2, max-content);
  }
}

/* Responsive: 1 columna hasta 600px */
@media (max-width: 600px) {
  .tables-grid {
    grid-template-columns: 1fr;
  }
}

.table-layout {
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

.square {
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.silla-icon {
  width: 100%;
  height: 100%;
}

/* estilos del SVG internos */
.silla-icon .chair-wheels circle {
  fill: #000;
  stroke: #000;
  stroke-width: 4;
}

.silla-icon .chair-seat,
.silla-icon .chair-back {
  fill: #fff;
  stroke: #000;
  stroke-width: 4;
}

/* ocupados: rojo */
.square.unavailable .silla-icon .chair-seat,
.square.unavailable .silla-icon .chair-back {
  fill: #ff0000;
}

/* seleccionados: amarillo */
.square.selected .silla-icon .chair-seat,
.square.selected .silla-icon .chair-back {
  fill: #ffff00;
}

/* mesa SVG */
.table .mesa-icon rect {
  fill: #ddd;
  stroke: #333;
  stroke-width: 2;
}

.seat-left-top {
  grid-column: 1;
  grid-row: 1;
}

.seat-right-top {
  grid-column: 3;
  grid-row: 1;
}

.seat-left-bottom {
  grid-column: 1;
  grid-row: 2;
}

.seat-right-bottom {
  grid-column: 3;
  grid-row: 2;
}

.table {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.buy-button {
  display: block;
  margin: 36px auto 0;
  padding: 14px 36px;
  font-size: 1.1em;
  font-weight: 600;
  color: #21618c;
  background: #e1f5fe;
  border: 1px solid #81d4fa;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.buy-button:hover:not(:disabled) {
  background: #b3e5fc;
  transform: translateY(-2px);
}

.buy-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* botón continuar */
.continue-button {
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

.continue-button:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

/* popup */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup-rect {
  width: 240px;
  height: 380px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, .25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


.login {

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;

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

    &:hover:not(:disabled) {
      transform: scale(1.1);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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

.square.selectedPrivate .silla-icon .chair-seat,
.square.selectedPrivate .silla-icon .chair-back {
  fill: #ffff00;
}

.square.selectedPrivate {
  cursor: not-allowed;
}



</style>
