<template>
  <div class="servicios">
    <h1 class="servicios__title">Servicios</h1>

    <section class="instalaciones">
      <h2 class="instalaciones__title">Nuestras Instalaciones</h2>
      <div class="instalaciones__content">
        <div class="instalaciones__image-container">
          <img 
            src="https://placeholder.co/300x200/cccccc/969696?text=Instalacion+Principal" 
            alt="Imagen Principal de Instalaciones" 
            class="instalaciones__image"
          >
        </div>
        <div class="instalaciones__features">
          <div 
            v-for="feature in instalacionFeatures" 
            :key="feature.id" 
            class="feature"
          >
            <img 
              :src="feature.icon" 
              alt="Icono característica" 
              class="feature__icon"
            >
            <div class="feature__content">
              <h3 class="feature__title">{{ feature.title }}</h3>
              <p class="feature__text">{{ feature.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="servicios-grid-section">
      <h2 class="servicios-grid-section__title">Nuestros Servicios</h2>
      <div class="servicios-grid">
        <div 
          v-for="service in nuestrosServicios" 
          :key="service.id" 
          class="servicio-card"
        >
          <img 
            :src="service.icon" 
            alt="Icono servicio" 
            class="servicio-card__icon"
          >
          <div class="servicio-card__content">
            <h3 class="servicio-card__title">{{ service.title }}</h3>
            <p class="servicio-card__text">{{ service.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const instalacionFeatures = ref([
  { 
    id: 1, 
    icon: 'https://placeholder.co/40x40', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the'
  },
  { 
    id: 2, 
    icon: 'https://placeholder.co/40x40', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the'
  },
  { 
    id: 3, 
    icon: 'https://placeholder.co/40x40', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the'
  },
  { 
    id: 4, 
    icon: 'https://placeholder.co/40x40', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the'
  },
]);

const nuestrosServicios = ref([
  { 
    id: 's1', 
    icon: 'https://placeholder.co/60x60', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page.'
  },
  { 
    id: 's2', 
    icon: 'https://placeholder.co/60x60', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the readable content.'
  },
  { 
    id: 's3', 
    icon: 'https://placeholder.co/60x60', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking.'
  },
  { 
    id: 's4', 
    icon: 'https://placeholder.co/60x60', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the.'
  },
  { 
    id: 's5', 
    icon: 'https://placeholder.co/60x60', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page.'
  },
  { 
    id: 's6', 
    icon: 'https://placeholder.co/60x60', 
    title: 'Lorem Ipsum',
    text: 'It is a long established fact that a reader will be distracted by the readable content.'
  },
]);
</script>

<style lang="scss" scoped>

.servicios {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;

  @media (min-width: 768px) {
    padding: 0;
  }
}

.servicios__title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: normal;
  margin: -1rem -1rem 2rem -1rem;
  padding: 1rem;
  color: #333;
  background-color: #ccc;

  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin: -2rem -2rem 2rem -2rem;
    padding: 1.5rem;
  }
}

.instalaciones {
  margin-bottom: 3rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
}

.instalaciones__title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.6rem;
  }
}

.instalaciones__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2.5rem;
  }
}

.instalaciones__image-container {
  flex: 0 0 auto;

  @media (min-width: 768px) {
    flex: 0 0 300px;
  }
}

.instalaciones__image {
  width: 100%;
  height: auto;
  background-color: #ccc;
  border-radius: 4px;
  max-width: 300px;
}

.instalaciones__features {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;
}

.feature__icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  object-fit: contain;
}

.feature__content {
  flex: 1;
}

.feature__title {
  font-size: 1rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
  color: #333;
}

.feature__text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  color: #666;
}

.servicios-grid-section {
  margin-bottom: 2rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
}

.servicios-grid-section__title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.6rem;
  }
}

.servicios-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.servicio-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
}

.servicio-card__icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  flex-shrink: 0;
}

.servicio-card__content {
  flex: 1;
}

.servicio-card__title {
  font-size: 1rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.servicio-card__text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  color: #666;
}
</style>