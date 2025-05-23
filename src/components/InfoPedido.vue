<template>
  <div v-if="reservaActual" class="container">
    <h1>Detalles de la Reserva</h1>

    <div>
      <p><strong>Precio Total:</strong> {{ reservaActual.precioTotal }} €</p>
      <p><strong>Rango Horario:</strong> {{ reservaActual.rangoHorarioReserva }}</p>
      <p><strong>Total Horas Reservadas:</strong> {{ reservaActual.cantidadHorasReservadas }} horas</p>
    </div>

    <div>
      <h2>Ubicación</h2>
      <p><strong>Nombre de la sala:</strong> {{ reservaActual.nombreSalaPrincipal }}</p>
      <p><strong>Ciudad:</strong> {{ reservaActual.ciudadSedePrincipal }}</p>
      <p><strong>Dirección:</strong> {{ reservaActual.direccionSedePrincipal }}</p>
      <img v-if="reservaActual.imagenSalaPrincipal" :src="reservaActual.imagenSalaPrincipal" alt="Imagen de la Sala Principal" class="main-room-image"/>
    </div>

    <div v-if="reservaActual.asientosReservados">
      <h2>Asientos Reservados</h2>
      <p>{{ reservaActual.asientosReservados }}</p>
    </div>
  </div>

  <div v-else-if="loading">
    <p>Cargando detalles de la reserva...</p>
  </div>

  <div v-else-if="error">
    <p class="error-message">Error: {{ error }}</p>
    <p>No se pudieron cargar los detalles de la reserva. Por favor, inténtalo de nuevo.</p>
  </div>

  <div v-else>
    <p>No hay detalles de reserva disponibles.</p>
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

<style lang="scss" scoped>
.container {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 365px);
  padding: 20px;
  text-align: center;
}

h1 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 15px;
}

h2 {
  color: #34495e;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
}

p {
  font-size: 18px;
  color: #2c3e50;
  margin-top: 5px;
  margin-bottom: 5px;
}

strong {
  font-weight: bold;
}

.main-room-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
}

/* Responsive adjustments */
@media (min-width: 600px) {
  h1 {
    font-size: 32px;
  }

  h2 {
    font-size: 24px;
  }

  p {
    font-size: 19px;
  }
}

@media (min-width: 900px) {
  h1 {
    font-size: 40px;
  }

  h2 {
    font-size: 28px;
  }

  p {
    font-size: 20px;
  }
}
</style>
