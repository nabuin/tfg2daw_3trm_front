<template>
  <div class="tarjetas">
    <div class="tarjetas__item tarjetas__item--izquierda">
      <img src="../imgs/others/sillaplus.png" alt="Imagen 1" class="tarjetas__imagen" @click="irASedes">
      <h3 class="tarjetas__titulo">Caracteristicas Especiales</h3>
      <p class="tarjetas__texto">En La Oficina ofrecemos asientos especiales con mayor comodidad, ergonomía mejorada,
        luz personalizada y ubicación preferente.

        Solo el 10 % de nuestros puestos cuentan con estas ventajas.
        Una opción limitada para quienes quieren más.
      </p>
    </div>

    <div class="tarjetas__item tarjetas__item--centro" @click="irASedes">
      <img src="../imgs/others/silla-de-escritorio.png" alt="Imagen 2" class="tarjetas__imagen" />
      <h3 class="tarjetas__titulo">Salas Privadas</h3>
      <p class="tarjetas__texto">En La Oficina te ofrecemos salas privadas ideales para reuniones, sesiones de equipo o
        simplemente para trabajar sin interrupciones. El alquiler es de 0,50 € por hora por asiento. Cada sala incluye
        16 puestos individuales, totalmente equipados,
        con wifi de alta velocidad, enchufes, iluminación óptima y ambiente silencioso.
      </p>
    </div>

    <div class="tarjetas__item tarjetas__item--derecha" @click="irASedes">
      <img src="../imgs/others/silla-de-oficina.png" alt="Imagen 3" class="tarjetas__imagen" />
      <h3 class="tarjetas__titulo">Sala de Trabajo</h3>
      <p class="tarjetas__texto">
        En La Oficina hemos creado el espacio perfecto para que trabajes cómodo.
        Nuestras salas de coworking están pensadas para jóvenes profesionales como tú: ambiente moderno, wifi rápido,
        etc.. Elige tu sitio por solo 2 euros la hora,
        sin cuotas ni permanencias.
      </p>
    </div>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const irASedes = () => {
  router.push('/sedes')
}
</script>



<style lang="scss" scoped>
.tarjetas {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  cursor: pointer;
  padding: 2rem;

  &__item {
    width: 300px;
    border: 2px solid #000;
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 1rem;

        &:hover {
      transform: scale(1.02);
    }
  }

  &__item--izquierda {
    height: auto;
  }

  &__item--centro {
    height: auto;
  }

  &__item--derecha {
    height: auto;
  }

  &__imagen {
    width: 100%;
    height: 150px;
    object-fit: contain;
    padding: 10px;
  }

  &__titulo {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 1rem;
  }

  &__texto {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    color: #333;
    overflow-y: auto;
    max-height: 100%;
  }
}

@media screen and (min-width: 768px) {
  .tarjetas {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
