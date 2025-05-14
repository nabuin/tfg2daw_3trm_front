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

//Importamos todo lo necesario para  que puedas funcionas
import { defineComponent, onMounted } from 'vue';
import { useMapaStore } from '../store/mapaStore';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerUrl from '../imgs/icons/marker.png';

export default defineComponent({
  name: 'Sedes_Mapa',
  setup() {
    // Obtenemos acceso al store que maneja las coordenadas y la sede seleccionada
    const store = useMapaStore();

    // Función que inicializa el mapa Leaflet
    const inicializarMapa = () => {
      // Creamos el mapa en el div con id 'mapa', centrado en Madrid y con zoom 6
      // Además desactivamos el control de zoom para evitar que aparezca
      const mapa = L.map('mapa', {
        center: [40.4168, -3.7038],
        zoom: 6,
        zoomControl: false
      });

      // Añadimos la capa de mapa base usando OpenStreetMap y su atribución (al parece obligatoria)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapa);

      // Recorremos todas las sedes que tenemos en el store
      store.coordenadas.value.forEach((sede) => {
        // Convertimos latitud y longitud (strings) a numeros para Leaflet
        const lat = parseFloat(sede.latitud);
        const lng = parseFloat(sede.longitud);

        // Comprobamos que las coordenadas son válidas (no NaN)
        if (!isNaN(lat) && !isNaN(lng)) {
          // Creamos un icono personalizado para el marcador usando la imagen importada
          const icono = L.icon({
            iconUrl: markerUrl,       // URL del icono importado
            iconSize: [32, 32],       // Tamaño del icono (ancho x alto)
            iconAnchor: [16, 32],     // Punto del icono que se sitúa en la coordenada (centrado abajo)
            popupAnchor: [0, -30]     // Punto desde el icono donde se abrirá el popup
          });

          // Añadimos el marcador con el icono en las coordenadas dadas
          L.marker([lat, lng], { icon: icono })
            .addTo(mapa)  // Lo añadimos al mapa
            // Creamos el popup con HTML personalizado para mostrar información y un botón
            .bindPopup(`
              <div class="popup-content" style="width: 250px;">
                <div class="popup-title">${sede.direccion}, ${sede.ciudad}</div>
                <div class="popup-text">${sede.pais}, ${sede.codigoPostal}</div>
                <div class="popup-subtext">Planta: ${sede.planta}</div>
                <button class="popup-button" data-id="${sede.idSede}">
                  Seleccionar sede
                </button>
              </div>
            `);
        }
      });

      // Añadimos un listener global para detectar clicks en botones de los popups
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        // Si el elemento clickeado es un botón con clase sigue
        if (target && target.classList.contains('popup-button')) {
          // Obtenemos el id almacenado en el atributo data-id
          const id = target.getAttribute('data-id');
          if (id) {
            // Guardamos la sede seleccionada en el store, convirtiendo a número
            store.sedeSeleccionadaId.value = Number(id);
            // Para debug, mostramos en consola la sede seleccionada
            console.log('Sede seleccionada ID:', store.sedeSeleccionadaId.value);
          }
        }
      });
    };

    // Cuando el componente se monta, obtenemos las coordenadas y luego inicializamos el mapa
    onMounted(async () => {
      await store.obtenerCoordenadas();
      inicializarMapa();
    });

    // Retornamos la variable reactiva para poder usarla en el template
    return {
      sedeSeleccionadaId: store.sedeSeleccionadaId
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


button.popup-button {
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

  &:hover {
    background-color: white;
    color: #1976d2;
    border-color: #1976d2;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.6);
  }
}



.leaflet-control-zoom.leaflet-bar.leaflet-control {
  display: none !important;
}
</style>
