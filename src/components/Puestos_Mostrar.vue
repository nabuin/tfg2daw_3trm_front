<template>
  <div>
    <!-- 1. cargando… -->
    <p v-if="loading" class="loading-message">
      cargando puestos disponibles…
    </p>

    <!-- 2. cuando ya cargó, pintamos las mesas en filas de 3 -->
    <div v-else>
      <div class="tables-grid">
        <div v-for="(group, gi) in seatGroups" :key="gi" class="table-layout">
          <!-- 2.1 puestos -->
          <button v-for="(puesto, idx) in group" :key="puesto.idPuestoTrabajo" class="square" :class="[
            positionClass(idx),
            {
              unavailable: puesto.disponibilidadesEnRango?.some(s => !s.estado),
              selected: selectedPuestos.some(sp => sp.idPuestoTrabajo === puesto.idPuestoTrabajo)
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

          <!-- 2.2 mesa -->
          <div class="table">
            <svg class="mesa-icon" width="120" height="130" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="80" height="100" rx="6" ry="6" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 3. botón comprar -->
      <button class="buy-button" :disabled="isReserving || selectedPuestos.length === 0" @click="submitCompra">
        {{ isReserving ? 'procesando...' : 'comprar' }}
      </button>

      <!-- 4. botón continuar -->
      <button class="continue-button" @click="showPopup = true">
        continuar
      </button>

      <!-- Popup centrado -->
      <div v-if="showPopup" class="popup-overlay">
        <div class="popup-vertical">
          <div class="login">
            <form class="login__form" @submit="login">
              <input type="text" v-model="usuario" class="login__input" placeholder="Correo" required>
              <input type="password" v-model="password" class="login__input" placeholder="Contraseña" required>

              <div v-if="mensajeError" class="login__error">La contraseña y/o el correo son erroneos</div>
              <!-- v-if quiere decir que si la constante mensajeError tiene datos (es decir algo ha fallado), se mostrará, sino no, es decir que todo habrá funcionado-->

              <button type="submit" class="login__button">→</button>
              <router-link to="/register" class="login__register">¿No tienes cuenta? Registrarte</router-link>
            </form>
          </div>
          <button @click="showPopup = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, computed, ref } from 'vue';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';
import { useReservasStore } from '../store/reservasStore';
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
    const puestosStore = usePuestosStore();
    const salaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();
    const reservasStore = useReservasStore();

    const { puestosDisponibles, loading } = storeToRefs(puestosStore);
    const { selectedPuestos, isReserving } = storeToRefs(reservasStore);

    const showPopup = ref(false);

    onMounted(() => {
      if (salaStore.id !== null) {
        puestosStore.obtenerPuestosDisponibles();
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
          reservasStore.setPuestoDisponibilidades(puestosDisponibles.value);
          reservasStore.resetSelection();
        }
      },
      { immediate: true }
    );

    function handlePuestoClick(puesto: any) {
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

    const seatGroups = computed(() => chunkArray(puestosDisponibles.value, 4));

    return {
      loading,
      seatGroups,
      selectedPuestos,
      isReserving,
      handlePuestoClick,
      submitCompra,
      positionClass,
      showPopup
    };
  },
});




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

<style scoped lang="scss">
.loading-message {
  text-align: center;
  padding: 1em;
  font-weight: 600;
  font-size: 1.1em;
  color: #555;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 48px 32px;
  justify-content: center;
  padding: 32px;
  border-radius: 8px;
}

.tables-grid>.table-layout:last-child:nth-child(3n+1) {
  grid-column: 2;
}

@media (max-width: 900px) {
  .tables-grid {
    grid-template-columns: repeat(2, max-content);
  }
}

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

.square.unavailable .silla-icon .chair-seat,
.square.unavailable .silla-icon .chair-back {
  fill: #ff0000;
}

.square.selected .silla-icon .chair-seat,
.square.selected .silla-icon .chair-back {
  fill: #ffff00;
}

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

.continue-button {
  display: block;
  margin: 16px auto 0;
  padding: 12px 28px;
  font-size: 1em;
  font-weight: 600;
  color: #000;
  background: #f0f0f0;
  border: 1px solid #000;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.continue-button:hover {
  transform: translateY(-2px);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-vertical {
  background: #fff;
  border: 2px solid #000;
  padding: 32px 24px;
  border-radius: 12px;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}








.login {
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
