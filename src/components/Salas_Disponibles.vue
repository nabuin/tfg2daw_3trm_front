<template>
  <div class="salas-container">
    <div v-if="loading" class="mensaje">Cargando...</div>
    <div v-else-if="error" class="mensaje error">{{ error }}</div>
    <div v-else-if="salasDisponibles.length === 0" class="mensaje">
      Cargando...
    </div>
    <div v-else class="salas-lista">
      <!-- DESPLEGABLE DE ORDENACIÓN -->
      <div class="sort-container">
        <label for="orden-select">Ordenar de:</label>
        <select id="orden-select" v-model="ordenarDesc">
          <option :value="true">Mayor a Menor</option>
          <option :value="false">Menor a Mayor</option>
        </select>
      </div>

      <!-- ITERAMOS SOBRE sortedSalas -->
      <router-link v-for="sala in sortedSalas" :key="sala.idSala" class="sala-button" to="/sedes/salas/puestos"
        @click="seleccionarSala(sala)">
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSalasStore } from '../store/salasStore';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';

export default defineComponent({
  setup() {
    const router = useRouter();

    const salasStore = useSalasStore();
    const { salasDisponibles, loading, error } = storeToRefs(salasStore);
    const { obtenerSalasDisponibles } = salasStore;

    const sedeSeleccionadaStore = useSedeSeleccionadaStore();
    const salaSeleccionadaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();

    // Dirección de orden: true = Mayor a Menor, false = Menor a Mayor
    const ordenarDesc = ref(true);

    // Computed que devuelve las salas ordenadas sin mutar el store
    const sortedSalas = computed(() => {
      // crea una copia del array para no trabajar sobre los datos en
      return [...salasDisponibles.value].sort((a, b) => {
        //hace el calculo para saber cual de los datos es mayor
        const diff = b.puestosDisponibles - a.puestosDisponibles;
        //sirve para indicar el orden diff es de mayor  a menos y -diff alreves
        return ordenarDesc.value ? diff : -diff;
      });
    });

    // Cargar salas
    const buscarSalas = async () => {
      await obtenerSalasDisponibles(filtrosStore.filtros);
    };

    const seleccionarSala = (sala: { idSala: number }) => {
      salaSeleccionadaStore.setId(sala.idSala);
    };

    // Redireccionar si no hay sede seleccionada válida
    onMounted(() => {
      if (sedeSeleccionadaStore.id === null || sedeSeleccionadaStore.id < 1) {
        router.push('/home');
      } else {
        buscarSalas();
      }
    });

    // Volver a cargar salas si cambian los filtros
    watch(
      () => filtrosStore.filtros,
      buscarSalas,
      { deep: true }
    );

    // Volver a cargar salas si cambia la sede seleccionada
    watch(
      () => sedeSeleccionadaStore.id,
      (newId, oldId) => {
        if (newId !== oldId) buscarSalas();
      }
    );

    return {
      salasDisponibles,
      loading,
      error,
      seleccionarSala,
      sortedSalas,
      ordenarDesc
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
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  gap: 1rem;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-end;
}

.sort-container label {
  font-size: 0.95rem;
}

.sort-container select {
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0 2px 6px rgba(0, 0, 0, 0.1);
  min-height: 180px;
}

.sala-button:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  padding-right: 1rem;
}

.tarjetas-puestos {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.tarjeta {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
}
</style>
