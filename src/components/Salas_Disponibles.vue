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
            <h3 class="salas__nombre">
              {{ sala.nombre }} – España
              <span
                v-if="sala.idTipoSala === 4"
                class="salas__icono-privado"
                title="Para poder usar esta sala, debe reservarse en su totalidad"
                >🔒</span
              >
            </h3>

            <p class="salas__detalle">{{ sala.sedeCiudad }}</p>
            <p class="salas__detalle">
              {{ sala.sedeDireccion }} – {{ sala.sedePlanta }}
            </p>
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

        <div
          v-if="sala.caracteristicas && sala.caracteristicas.length"
          class="salas__caracteristicas"
        >
<span
  v-for="car in sala.caracteristicas"
  :key="car.idCaracteristica"
  class="salas__icono-contenedor"
  :title="car.nombre"
>
  <img
    class="salas__icono-imagen"
    :src="iconMap[car.idCaracteristica]"
    :alt="car.nombre"
  />
</span>

        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">

    import icon1 from '../imgs/caracteriticasSalas/pc.png';
    import icon2 from '../imgs/caracteriticasSalas/cocina.png';
    import icon3 from '../imgs/caracteriticasSalas/sala.png';
    import icon4 from '../imgs/caracteriticasSalas/tarjeta-llave.png';
    import icon5 from '../imgs/caracteriticasSalas/taquillas.png';

import { defineComponent, ref, computed, onMounted } from 'vue';
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

    const sedeSeleccionadaStore = useSedeSeleccionadaStore();
    const salaSeleccionadaStore = useSalaSeleccionadaStore();
    const filtrosStore = useFiltrosStore();

    const ordenarDesc = ref(true);

    const sortedSalas = computed(() => {
      return [...salasDisponibles.value].sort((a, b) => {
        const diff = b.puestosDisponibles - a.puestosDisponibles;
        return ordenarDesc.value ? diff : -diff;
      });
    });

    const seleccionarSala = (sala: { idSala: number }) => {
      salaSeleccionadaStore.setId(sala.idSala);
    };

    onMounted(() => {
      if (sedeSeleccionadaStore.id === null || sedeSeleccionadaStore.id < 1) {
        router.push('/home');
      }
    });



    const iconMap: Record<number, string> = {
      1: icon1,
      2: icon2,
      3: icon3,
      4: icon5,
      5: icon4,
    };

    return {
      salasDisponibles,
      loading,
      error,
      seleccionarSala,
      sortedSalas,
      ordenarDesc,
      iconMap,
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
    position: relative;
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
    min-height: 200px;
    overflow: hidden;

    &:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 1rem 4rem;
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

  .salas__icono-privado {
    margin-left: 8px;
    font-size: 1.1rem;
    vertical-align: middle;
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

  &__caracteristicas {
    position: absolute;
    bottom: 12px;
    left: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-start;
  }

  &__icono-contenedor {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icono-imagen {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  @media (max-width: 700px) {
    &__item {
    max-height: 285px;
    }

    &__info {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
      padding-bottom: 6rem;
    }
  }
}

</style>
