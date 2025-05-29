<template>
  <div class="salas-container">
    <div v-if="loading" class="mensaje">Cargando...</div>
    <div v-else-if="error" class="mensaje error">{{ error }}</div>
    <div v-else-if="salasDisponibles.length === 0" class="mensaje">
      No hay salas disponibles para esa búsqueda.
    </div>
    <div v-else class="salas-lista">
      <button class="sort-button" @click="toggleOrden">
        Invertir orden ({{ ordenarDesc ? 'Mayor a menor' : 'Menor a mayor' }})
      </button>

      <router-link
        v-for="sala in sortedSalas"
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSalasStore } from '../store/salasStore';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore';
import { useFiltrosStore } from '../store/filtrosStore';

export default defineComponent({
  setup() {
    const salasStore = useSalasStore();
    const { salasDisponibles, loading, error } = storeToRefs(salasStore);
    const { obtenerSalasDisponibles } = salasStore;

    const sedeSeleccionadaStore = useSedeSeleccionadaStore();
    const salaSeleccionadaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();

    // --- NUEVO: control de orden, por defecto Mayor a menor ---
    const ordenarDesc = ref(true);

    // Computed que devuelve las salas ordenadas
    const sortedSalas = computed(() => {
      // crea una copia del array para no trabajar sobre los datos en caliente y el .short los compara
      return [...salasDisponibles.value].sort((a, b) => {
        //hace el calculo para saber cual de los datos es mayor
        const diff = b.puestosDisponibles - a.puestosDisponibles;
        //sirve para indicar el orden diff es de mayor  a menos y -diff alreves
        return ordenarDesc.value ? diff : -diff;
      });
    });

    // Alterna entre orden descendente/ascendente
    const toggleOrden = () => {
      ordenarDesc.value = !ordenarDesc.value;
      console.log('ordenarDesc ahora es', ordenarDesc.value);
    };

    // funcion para cargar salas
    const buscarSalas = async () => {
      await obtenerSalasDisponibles(filtrosStore.filtros);
    };

    const seleccionarSala = (sala: { idSala: number }) => {
      salaSeleccionadaStore.setId(sala.idSala);
    };

    onMounted(buscarSalas);

    watch(
      () => filtrosStore.filtros,
      buscarSalas,
      { deep: true }
    );

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
      // --- NUEVO ---
      sortedSalas,
      ordenarDesc,
      toggleOrden
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

/* ESTILOS DEL BOTÓN DE ORDENACIÓN */
.sort-button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
.sort-button:hover {
  background: #0056b3;
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
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
}
</style>
