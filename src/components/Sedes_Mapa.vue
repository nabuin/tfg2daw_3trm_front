<template>
  <div class="mapa-sedes">
    <div class="mapa-sedes__columna mapa-sedes__columna--mapa">
      <div id="mapa"></div>
    </div>

    <div class="mapa-sedes__columna mapa-sedes__columna--tarjetas">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar sede..."
        class="mapa-sedes__buscador"
      />

      <div
        v-for="sede in sedesFiltradas"
        :key="sede.idSede"
        class="mapa-sedes__tarjeta"
        @click="centrarYSaltar(sede.idSede)"
      >
        <h3 class="mapa-sedes__titulo">{{ sede.direccion }}, {{ sede.ciudad }}</h3>
        <p class="mapa-sedes__texto">{{ sede.pais }} ({{ sede.codigoPostal }})</p>
        <p class="mapa-sedes__texto">Planta: {{ sede.planta }}</p>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, watch, ref, computed } from 'vue';
import { useMapaStore } from '../store/mapaStore';
import { useRouter } from 'vue-router';
import { useSedeSeleccionadaStore } from '../store/sedeSeleccionadaStore';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerUrl from '../imgs/icons/marker.png';

export default defineComponent({
  name: 'Sedes_Mapa',
  setup() {
    const store = useMapaStore();
    const router = useRouter();
    const sedeSeleccionadaStore = useSedeSeleccionadaStore();

    const popupMap = new Map<number, L.Popup>();
    const markerMap = new Map<number, L.Marker>();
    let mapa: L.Map;

    //Variable reactiva para la búsqueda de sedes
    const busqueda = ref('');

    //Computed para filtrar sedes según lo que escriba el usuario
    const sedesFiltradas = computed(() =>
      store.coordenadas.value.filter((sede) => {
        const termino = busqueda.value.toLowerCase();
        return (
          sede.direccion.toLowerCase().includes(termino) ||
          sede.ciudad.toLowerCase().includes(termino) ||
          sede.pais.toLowerCase().includes(termino) ||
          sede.codigoPostal.toLowerCase().includes(termino) ||
          sede.planta.toLowerCase().includes(termino)
        );
      })
    );

    const inicializarMapa = (centro: [number, number], zoom: number) => {
      mapa = L.map('mapa', {
        center: centro,
        zoom: zoom,
        zoomControl: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(mapa);

      store.coordenadas.value.forEach((sede) => {
        const lat = parseFloat(sede.latitud);
        const lng = parseFloat(sede.longitud);

        if (!isNaN(lat) && !isNaN(lng)) {
          const icono = L.icon({
            iconUrl: markerUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -30],
          });

          const marker = L.marker([lat, lng], { icon: icono });

          const popup = L.popup().setContent(`
            <div class="popup-mapa">
              <div class="popup-mapa__titulo">${sede.direccion}, ${sede.ciudad}</div>
              <div class="popup-mapa__texto">${sede.pais}, ${sede.codigoPostal}</div>
              <div class="popup-mapa__subtexto">Planta: ${sede.planta}</div>
              <a href="#" class="popup-mapa__boton" data-id="${sede.idSede}">
                Seleccionar sede
              </a>
            </div>
          `);


          marker.bindPopup(popup).addTo(mapa);
          markerMap.set(sede.idSede, marker);
          popupMap.set(sede.idSede, popup);
        }
      });

      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target && target.classList.contains('popup-mapa__boton')) {
          event.preventDefault();
          const id = target.getAttribute('data-id');
          if (id) {
            sedeSeleccionadaStore.setId(Number(id));
            router.push('/sedes/salas');
          }
        }
      });
    };

    const centrarYSaltar = (idSede: number) => {
      const marker = markerMap.get(idSede);
      if (marker) {
        mapa.setView(marker.getLatLng(), 15, { animate: true });
        marker.openPopup();
      }
    };

    onMounted(() => {
      store.obtenerCoordenadas();
    });

    watch(
      () => store.coordenadas.value,
      (nuevas) => {
        if (nuevas.length > 0) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                inicializarMapa([lat, lon], 13);

                const userIcon = L.icon({
                  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
                  iconSize: [28, 28],
                  iconAnchor: [14, 28],
                  popupAnchor: [0, -25],
                });

                L.marker([lat, lon], { icon: userIcon })
                  .addTo(mapa)
                  .openPopup();
              },
              () => {
                inicializarMapa([40.4168, -3.7038], 6);
              }
            );
          } else {
            inicializarMapa([40.4168, -3.7038], 6);
          }
        }
      }
    );

    return {
      coordenadas: store.coordenadas,
      centrarYSaltar,
      busqueda, // 🆕 Devuelve la variable de búsqueda
      sedesFiltradas, // 🆕 Devuelve el array filtrado de sedes
    };
  },
});
</script>

<style lang="scss">

.mapa-sedes {
  display: flex;
  height: 75vh;
  width: 90%;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background-color: white;
  border: 1px solid #e0e0e0;

  @media(max-width: 950px) {
    flex-direction: column;
  }

  &__columna {
    flex: 1;

    &--mapa {
      #mapa {
        height: 100%;
        width: 100%;
        filter: grayscale(10%) brightness(97%) contrast(110%);
      }
    }

    &--tarjetas {
      padding: 20px;
      overflow-y: auto;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  &__buscador {
    padding: 10px 14px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  &__tarjeta {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    }
  }

  &__titulo {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__texto {
    font-size: 0.95rem;
    margin: 2px 0;
    color: #555;
  }
}

.popup-mapa {
  width: 250px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 12px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &__titulo {
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #222;
  }

  &__texto {
    font-size: 0.95rem;
    margin-bottom: 6px;
    color: #555;
  }

  &__subtexto {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 14px;
  }

  &__boton {
    display: inline-block;
    width: 100%;
    padding: 10px 0;
    background-color: #1976d2;
    color: white !important;
    border: 2px solid #1976d2;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);
    text-decoration: none;
    user-select: none;

    &:hover {
      background-color: white;
      color: #1976d2 !important;
      border-color: #1976d2;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.6);
    }
  }
}


</style>
