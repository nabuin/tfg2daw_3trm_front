<template>
  <div class="salas">
    <div v-if="loading" class="salas__mensaje">Cargando...</div>
    <div v-else-if="error" class="salas__mensaje salas__mensaje--error">{{ error }}</div>
    <div v-else-if="salasDisponibles.length === 0" class="salas__mensaje">
      Cargando...
    </div>
    <div v-else class="salas__lista">
      <div class="salas__orden">
        <label for="orden-select" class="salas__orden-label">Ordenar de:</label>
        <select id="orden-select" v-model="ordenarDesc" class="salas__orden-select">
          <option :value="true">Mayor a Menor</option>
          <option :value="false">Menor a Mayor</option>
        </select>
      </div>

      <router-link
        v-for="sala in sortedSalas"
        :key="sala.idSala"
        class="salas__item"
        to="/sedes/salas/puestos"
        @click="seleccionarSala(sala)"
      >
        <div class="salas__info">
          <div class="salas__info-izq">
            <h3 class="salas__nombre">{{ sala.nombre }} – España</h3>
            <p class="salas__detalle">{{ sala.sedeCiudad }}</p>
            <p class="salas__detalle">{{ sala.sedeDireccion }} – {{ sala.sedePlanta }}</p>
            <p class="salas__detalle">Capacidad: {{ sala.capacidad }}</p>
          </div>
          <div class="salas__info-der">
            <div class="salas__tarjetas">
              <div class="salas__tarjeta salas__tarjeta--libre">
                <p>Libres</p>
                <p class="salas__numero">{{ sala.puestosDisponibles }}</p>
              </div>
              <div class="salas__tarjeta salas__tarjeta--ocupado">
                <p>Ocupados</p>
                <p class="salas__numero">{{ sala.puestosOcupados }}</p>
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
      return [...salasDisponibles.value].sort((a, b) => {
        const diff = b.puestosDisponibles - a.puestosDisponibles;
        return ordenarDesc.value ? diff : -diff;
      });
    });

    // Cargar salas con los filtros correctos
    const buscarSalas = async () => {
      // Si los filtros aún no están cargados, no realizamos la búsqueda
      if (!filtrosStore.fechaInicio.value || !filtrosStore.fechaFin.value) {
        filtrosStore.cargarFiltros();  // Aseguramos que los filtros se cargan correctamente
      }

      await obtenerSalasDisponibles({
        fechaInicio: filtrosStore.fechaInicio.value,
        fechaFin: filtrosStore.fechaFin.value,
        horaInicio: filtrosStore.horaInicio.value,
        horaFin: filtrosStore.horaFin.value,
      });
    };

    const seleccionarSala = (sala: { idSala: number }) => {
      salaSeleccionadaStore.setId(sala.idSala);
    };

    // Redireccionar si no hay sede seleccionada válida
    onMounted(() => {
      if (sedeSeleccionadaStore.id === null || sedeSeleccionadaStore.id < 1) {
        router.push('/home');
      } else {
        // Solo realizamos el fetch si no se hizo antes por los filtros
        if (!salasDisponibles.value.length) {
          buscarSalas();  // Llamamos a buscar las salas al montar el componente solo si no hay salas disponibles
        }
      }
    });

    // Volver a cargar salas si cambian los filtros
    watch(
      () => filtrosStore.filtros,
      (newFiltros, oldFiltros) => {
        // Solo realiza el fetch si los filtros realmente cambian
        if (JSON.stringify(newFiltros) !== JSON.stringify(oldFiltros)) {
          buscarSalas();
        }
      },
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
.salas {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: white;

  &__mensaje {
    margin: 1rem 0;
    font-size: 1.1rem;

    &--error {
      color: #d00;
    }
  }

  &__lista {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 800px;
    gap: 1rem;
  }

  &__orden {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    align-self: flex-end;

    &-label {
      font-size: 0.95rem;
    }

    &-select {
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  }

  &__item {
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

    &:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    height: 100%;

    &-izq {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &-der {
      display: flex;
      align-items: center;
      padding-right: 1rem;
    }
  }

  &__nombre {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  &__detalle {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.3;
  }

  &__tarjetas {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }

  &__tarjeta {
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;

    p {
      margin: 0.25rem 0;
    }

    &--libre {
      width: 105px;
      background: #e0f7e9;
      border: 1px solid #a3d9a5;
    }

    &--ocupado {
      background: #fde0e0;
      border: 1px solid #f5a3a3;
    }
  }

  &__numero {
    font-size: 1.2rem;
    font-weight: 600;
  }

  @media (max-width: 700px) {
    &__info {
      flex-direction: column;
      align-items: stretch;
      gap: 20px;
    }
  }
}

</style>
