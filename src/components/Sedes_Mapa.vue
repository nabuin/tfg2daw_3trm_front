<template>
  <div class="map-container">
    <div id="mapa"></div>
    <div class="map-header">
      Selecciona la sede de coworking donde deseas alquilar tu espacio.
    </div>
    <div class="map-footer">
      Pasa el ratón por encima de una sede para ver más detalles o confirmar tu reserva.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
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

    const inicializarMapa = () => {
      const mapa = L.map('mapa', {
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

          L.marker([lat, lng], { icon: icono })
            .addTo(mapa)
            .bindPopup(`
              <div class="popup-content" style="width: 250px;">
                <div class="popup-title">${sede.direccion}, ${sede.ciudad}</div>
                <div class="popup-text">${sede.pais}, ${sede.codigoPostal}</div>
                <div class="popup-subtext">Planta: ${sede.planta}</div>
                <a href="#" class="popup-button" data-id="${sede.idSede}">
                  Seleccionar sede
                </a>
              </div>
            `);
        }
      });

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

    onMounted(async () => {
      await store.obtenerCoordenadas();
      inicializarMapa();
    });

    return {
      sedeSeleccionadaId: store.sedeSeleccionadaId,
    };
  },
});
</script>


<style lang="scss">
h1 {
  text-align: center;
}

.map-container {
  position: relative;
  height: 75vh;
  width: 90%;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;

  #mapa {
    height: 100%;
    width: 100%;
    filter: grayscale(10%) brightness(97%) contrast(110%);
  }

  .map-header,
  .map-footer {
    position: absolute;
    width: 100%;
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 14px 28px;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-weight: 600;
    color: #333;
    font-size: 1rem;
  }

  .map-header {
    top: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    width: 90%;
  }

  .map-footer {
    bottom: 0;
    padding: 16px 24px;
    font-size: 0.95rem;
    color: #444;
    border-top: 1px solid #ddd;
    backdrop-filter: blur(5px);
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
