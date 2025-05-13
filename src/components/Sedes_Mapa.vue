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


//Definimos el componente
export default defineComponent({
  name: 'Sedes_Mapa',
  setup() {
    const store = useMapaStore(); //Objenemos acceso a la funcion useMapaStore

    const inicializarMapa = () => { //Creamos la constante en un funcion flecha
      const mapa = L.map('mapa', {
        center: [40.4168, -3.7038],
        zoom: 6,
        zoomControl: false    //Desactiva el zoom control
      });
      // Crea e inicializa el mapa en un div con id mapa. (Las coordenadas son dende se centra el mapa por primera vez, en este caso es madrid (el 6 es el "zoom inicial"))


      //NO ENTIENDO
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapa);

      store.coordenadas.value.forEach((sede) => { //Hace un foreach hasta haber pasado todas las sedes
        const lat = parseFloat(sede.latitud); //Como en la interface de Sede la latitud es sting, la pasa a numero
        const lng = parseFloat(sede.longitud); //Como en la interface de Sede la longitud es sting, la pasa a numero

        if (!isNaN(lat) && !isNaN(lng)) { //En caso de que al parsear de error, se genera algo llamado NaN, y eso lo que hace es comprobar que no se ha combertido en eso, en caso de que este bien, sigue
          const icono = L.icon({
            iconUrl: markerUrl, //Url del icono
            iconSize: [32, 32],//altura del icono
            iconAnchor: [16, 32],//Anchor del icono
            popupAnchor: [0, -30] //En base a la localizacion del icono, donde se creara el popup
          });

          L.marker([lat, lng], { icon: icono }) //Marca la localizacion que le hemos dicho y le asignamos el icono creado
            .addTo(mapa) //Añade el icono en la coordenadas marcadas al mapa

            //Aqui en donde ponemos que aparece en el popup
            .bindPopup(`
              <div class="popup-content">
                <b>${sede.direccion}, ${sede.ciudad}</b><br/>
                ${sede.pais}, ${sede.codigoPostal}<br/>
                Planta: ${sede.planta}<br/>
                <button class="popup-button" onclick="alert('Has seleccionado la sede de ${sede.ciudad}')">Seleccionar sede</button>
              </div>
            `);
        }
      });
    };

    onMounted(async () => {
      await store.obtenerCoordenadas();
      inicializarMapa();
    });

    return {};
  },
});

</script>

<style scoped>

h1{
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
}

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
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  font-family: 'Inter', 'Segoe UI', sans-serif;
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

.leaflet-popup-content {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 15px;
  color: #333;
  line-height: 1.4;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-content b {
  color: #111;
  font-size: 16px;
  margin-bottom: 4px;
}

.popup-button {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.popup-button:hover {
  background-color: #0056b3;
}

.leaflet-control-zoom.leaflet-bar.leaflet-control {
  display: none !important;
}
</style>
