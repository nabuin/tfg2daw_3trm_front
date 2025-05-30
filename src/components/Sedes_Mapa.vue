<template>
  <div class="map-container">
    <!-- Columna del mapa -->
    <div class="mapa-col">
      <div id="mapa"></div>
    </div>

    <!-- Columna de tarjetas de sedes -->
    <div class="tarjetas-col">
      <div
        v-for="sede in coordenadas"
        :key="sede.idSede"
        class="sede-card"
        @click="centrarYSaltar(sede.idSede)"
      >
        <h3>{{ sede.direccion }}, {{ sede.ciudad }}</h3>
        <p>{{ sede.pais }} ({{ sede.codigoPostal }})</p>
        <p>Planta: {{ sede.planta }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
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

    // Mapas para guardar referencias de popups y marcadores
    const popupMap = new Map<number, L.Popup>();
    const markerMap = new Map<number, L.Marker>();
    let mapa: L.Map;

    // Inicializa el mapa y agrega marcadores por cada sede
    const inicializarMapa = () => {
      mapa = L.map('mapa', {
        center: [40.4168, -3.7038],
        zoom: 6,
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

          // Contenido del popup con info y botón
          const popup = L.popup().setContent(`
            <div class="popup-content" style="width: 250px;">
              <div class="popup-title">${sede.direccion}, ${sede.ciudad}</div>
              <div class="popup-text">${sede.pais}, ${sede.codigoPostal}</div>
              <div class="popup-subtext">Planta: ${sede.planta}</div>
              <a href="#" class="popup-button" data-id="${sede.idSede}">
                Seleccionar sede
              </a>
            </div>
          `);

          marker.bindPopup(popup).addTo(mapa);

          // Guardar referencias
          markerMap.set(sede.idSede, marker);
          popupMap.set(sede.idSede, popup);
        }
      });

      // Detectar clic en botón de popup y redirigir
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target && target.classList.contains('popup-button')) {
          event.preventDefault();
          const id = target.getAttribute('data-id');
          if (id) {
            console.log('Sede seleccionada desde mapa:', id);
            sedeSeleccionadaStore.setId(Number(id));
            router.push('/sedes/salas');
          }
        }
      });
    };

    // Centra el mapa y abre el popup de la sede seleccionada
    const centrarYSaltar = (idSede: number) => {
      const marker = markerMap.get(idSede);
      if (marker) {
        mapa.setView(marker.getLatLng(), 15, { animate: true });
        marker.openPopup();
      }
    };

    // Obtener coordenadas al montar el componente
    onMounted(() => {
      store.obtenerCoordenadas();
    });

    // Esperar a que lleguen las coordenadas y luego inicializar el mapa
    watch(
      () => store.coordenadas.value,
      (nuevas) => {
        if (nuevas.length > 0) {
          inicializarMapa();
        }
      }
    );

    return {
      coordenadas: store.coordenadas, // expone coordenadas para usarlas 
      centrarYSaltar,
    };
  },
});
</script>

<style lang="scss">
.map-container {
  display: flex;
  height: 75vh;
  width: 90%;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background-color: white;
  border: 1px solid #e0e0e0;

  .mapa-col {
    flex: 1;

    #mapa {
      height: 100%;
      width: 100%;
      filter: grayscale(10%) brightness(97%) contrast(110%);
    }
  }

  .tarjetas-col {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sede-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 4px;
    }

    p {
      font-size: 0.95rem;
      margin: 2px 0;
      color: #555;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    }
  }
}

.leaflet-popup-content {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 15px;
  color: #333;
  line-height: 1.4;
}

.popup-content {
  width: 250px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .popup-title {
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #222;
  }

  .popup-text {
    font-size: 0.95rem;
    margin-bottom: 6px;
    color: #555;
  }

  .popup-subtext {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 14px;
  }
}

button.popup-button,
a.popup-button {
  display: inline-block;
  width: 100%;
  padding: 10px 0;
  background-color: #1976d2;
  color: white;
  border: 2px solid #1976d2;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  text-align: center;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);
  text-decoration: none;
  user-select: none;
}

button.popup-button:hover,
a.popup-button:hover {
  background-color: white;
  color: #1976d2;
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.6);
}

.leaflet-control-zoom.leaflet-bar.leaflet-control {
  display: none !important;
}
</style>
