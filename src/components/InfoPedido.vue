<template>
  <div v-if="reservaActual" class="reserva-detalle">
    <h1 class="reserva-detalle__titulo">Detalles de la Reserva</h1>

    <div class="reserva-detalle__bloque">
      <p class="reserva-detalle__texto"><strong>Precio Total:</strong> {{ reservaActual.precioTotal }} €</p>
      <p class="reserva-detalle__texto"><strong>Rango Horario:</strong> {{ reservaActual.rangoHorarioReserva }}</p>
      <p class="reserva-detalle__texto"><strong>Total Horas Reservadas:</strong> {{ reservaActual.cantidadHorasReservadas }} horas</p>
    </div>

    <div class="reserva-detalle__bloque">
      <h2 class="reserva-detalle__subtitulo">Ubicación</h2>
      <p class="reserva-detalle__texto"><strong>Nombre de la sala:</strong> {{ reservaActual.nombreSalaPrincipal }}</p>
      <p class="reserva-detalle__texto"><strong>Ciudad:</strong> {{ reservaActual.ciudadSedePrincipal }}</p>
      <p class="reserva-detalle__texto"><strong>Dirección:</strong> {{ reservaActual.direccionSedePrincipal }}</p>
    </div>

    <div v-if="reservaActual.asientosReservados" class="reserva-detalle__bloque">
      <h2 class="reserva-detalle__subtitulo">Asientos Reservados</h2>
      <p class="reserva-detalle__texto">{{ reservaActual.asientosReservados }}</p>
    </div>
  </div>

  <div v-else-if="loading">
    <p class="reserva-detalle__texto">Cargando detalles de la reserva...</p>
  </div>

  <div v-else-if="error">
    <p class="reserva-detalle__error">Error: {{ error }}</p>
    <p class="reserva-detalle__texto">No se pudieron cargar los detalles de la reserva. Por favor, inténtalo de nuevo.</p>
  </div>

  <div v-else>
    <p class="reserva-detalle__texto">No hay detalles de reserva disponibles.</p>
  </div>
</template>


<script>
import { useInfoPedidosStore } from '../store/InfoPedidosStore';
import { computed, onMounted } from 'vue';


export default {
  setup() {
    const infoPedidosStore = useInfoPedidosStore(); // acceder a la store para hacer el get de la reserva


    onMounted(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        infoPedidosStore.fetchResumenReserva();
      } else {
        infoPedidosStore.error = "No se ha iniciado sesión";
      }
    });

    return {
      reservaActual: computed(() => infoPedidosStore.reservaActual),
      loading: computed(() => infoPedidosStore.loading),
      error: computed(() => infoPedidosStore.error),
    };
  },
};
</script>

<style scoped lang="scss">
.reserva-detalle {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 365px);
  padding: 20px;
  text-align: center;

  &__titulo {
    color: #2c3e50;
    font-size: 24px;
    margin-bottom: 15px;
  }

  &__subtitulo {
    color: #34495e;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  &__texto {
    font-size: 18px;
    color: #2c3e50;
    margin: 5px 0;
  }

  &__error {
    color: #e74c3c;
    font-weight: bold;
  }

  &__bloque {
    margin-bottom: 20px;
  }
}

@media (min-width: 600px) {
  .reserva-detalle {
    &__titulo {
      font-size: 32px;
    }

    &__subtitulo {
      font-size: 24px;
    }

    &__texto {
      font-size: 19px;
    }
  }
}

@media (min-width: 900px) {
  .reserva-detalle {
    &__titulo {
      font-size: 40px;
    }

    &__subtitulo {
      font-size: 28px;
    }

    &__texto {
      font-size: 20px;
    }
  }
}
</style>

