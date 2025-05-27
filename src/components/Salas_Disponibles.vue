<template>
  <div class="salas-container">
    <div v-if="loading" class="mensaje">Cargando...</div>
    <div v-if="error" class="mensaje error">{{ error }}</div>
    <div v-if="!loading && salasDisponibles.length === 0 && !error" class="mensaje">
      No hay salas disponibles para esa búsqueda.
    </div>
    <div v-if="salasDisponibles.length > 0" class="salas-lista">
      <router-link
        v-for="sala in salasDisponibles"
        :key="sala.idSala"
        class="sala-button"
        to="/sedes/salas/puestos"
        @click="seleccionarSala(sala)"
      >
        <div class="sala-info">
          <div class="info-left">
            <h3>{{ sala.nombre }} – España</h3>
            <p>{{ sala.sedeCiudad }}</p>
            <p>{{ sala.sedeDireccion }} – {{ sala.sedePlanta }}</p>
            <p>Capacidad: {{ sala.capacidad }}</p>
          </div>
          <div class="info-right">
            <div class="tarjetas-puestos">
              <div class="tarjeta libre">
                <p>Libres</p>
                <p class="numero">{{ sala.puestosDisponibles }}</p>
              </div>
              <div class="tarjeta ocupado">
                <p>Ocupados</p>
                <p class="numero">{{ sala.puestosOcupados }}</p>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useSalasStore } from '../store/salasStore';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';

export default defineComponent({
  setup() {
    const { salasDisponibles, error, loading, obtenerSalasDisponibles } = useSalasStore();
    const sedeSeleccionadaStore = useSedeSeleccionadaStore();
    const salaSeleccionadaStore = useSalaSeleccionadaStore();

    const buscarSalas = async () => {
      await obtenerSalasDisponibles();
    };

    const seleccionarSala = (sala: { idSala: number; nombre: string; capacidad: number }) => {
      salaSeleccionadaStore.setId(sala.idSala);
    };

    const idSede = computed(() => sedeSeleccionadaStore.id);

    onMounted(buscarSalas);

    watch(idSede, (newId, oldId) => {
      if (newId !== oldId) {
        buscarSalas();
      }
    });

    return {
      salasDisponibles,
      error,
      loading,
      seleccionarSala
    };
  },
});
</script>



<style scoped lang="scss">
.salas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: white;
}

.mensaje {
  margin: 1rem 0;
  font-size: 1.1rem;
}

.mensaje.error {
  color: #d00;
}

.salas-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 800px;
}

.sala-button {
  display: block;
  width: 100%;
  max-width: 890px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 180px;
}

.sala-button:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.sala-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 100%;
}

.info-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-left h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.info-left p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.3;
}

.info-right {
  display: flex;
  align-items: center;
  padding-right: 1rem; /* espacio con el borde derecho */
}

.tarjetas-puestos {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.tarjeta {
  flex: 1; /* ambas tarjetas con igual ancho */
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

.tarjeta p {
  margin: 0.25rem 0;
}

.tarjeta .numero {
  font-size: 1.2rem;
  font-weight: 600;
}

.tarjeta.libre {
  width: 105px;
  background: #e0f7e9;
  border: 1px solid #a3d9a5;
}

.tarjeta.ocupado {
  background: #fde0e0;
  border: 1px solid #f5a3a3;
}

@media (max-width: 700px) {
  .sala-info {
    display: flex;
    flex-direction: column;

        align-items: stretch;
        gap: 20px;
  }
}
</style>
