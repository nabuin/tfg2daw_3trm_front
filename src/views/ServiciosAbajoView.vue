<template>
  <v-container class="services-section">
    <v-row class="services-section__header">
      <v-col cols="12">
        <h2 class="services-section__title">Nuestros Servicios</h2>
      </v-col>
    </v-row>
  
    <v-row class="services-section__row"> <!-- FILA 1-->
      <v-col class="services-section__item"> <div class="services-section__item-content">
          <v-avatar  class="services-section__icon">
            <img src="../imgs/icons/clock.svg" alt="Icono de Servicio" class="services-section__img-icon">
          </v-avatar> <!-- icono de ejemplo, luego se pondrán los que toquen, quizas estaticos o de la bbdd -->
          <div class="services-section__text">
            <h3 class="services-section__item-title">Lorem Ipsum</h3>
            <p class="services-section__item-description">It is a long established fact that a reader will be distracted by the</p>
          </div>
        </div>
      </v-col>
      <v-col class="services-section__item"> <div class="services-section__item-content">
          <v-avatar  class="services-section__icon">
             <img src="../imgs/icons/clock.svg" alt="Icono de Servicio" class="services-section__img-icon">
          </v-avatar>
          <div class="services-section__text">
            <h3 class="services-section__item-title">Lorem Ipsum</h3>
            <p class="services-section__item-description">It is a long established fact that a reader will be distracted by the</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="services-section__row"> <!-- FILA 2, repitiendo la fila 1-->
      <v-col class="services-section__item"> <div class="services-section__item-content">
          <v-avatar  class="services-section__icon">
             <img src="../imgs/icons/clock.svg" alt="Icono de Servicio" class="services-section__img-icon">
          </v-avatar>
          <div class="services-section__text">
            <h3 class="services-section__item-title">Lorem Ipsum</h3>
            <p class="services-section__item-description">It is a long established fact that a reader will be distracted by the</p>
          </div>
        </div>
      </v-col>
      <v-col class="services-section__item"> <div class="services-section__item-content">
          <v-avatar  class="services-section__icon">
             <img src="../imgs/icons/clock.svg" alt="Icono de Servicio" class="services-section__img-icon">
          </v-avatar>
          <div class="services-section__text">
            <h3 class="services-section__item-title">Lorem Ipsum</h3>
            <p class="services-section__item-description">It is a long established fact that a reader will be distracted by the</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="services-section__row"> <!-- FILA 3, repitiendo la fila 1 -->
      <v-col class="services-section__item"> <div class="services-section__item-content">
          <v-avatar  class="services-section__icon">
             <img src="../imgs/icons/clock.svg" alt="Icono de Servicio" class="services-section__img-icon">
          </v-avatar>
          <div class="services-section__text">
            <h3 class="services-section__item-title">Lorem Ipsum</h3>
            <p class="services-section__item-description">It is a long established fact that a reader will be distracted by the</p>
          </div>
        </div>
      </v-col>
      <v-col class="services-section__item"> <div class="services-section__item-content">
          <v-avatar  class="services-section__icon">
             <img src="../imgs/icons/clock.svg" alt="Icono de Servicio" class="services-section__img-icon">
          </v-avatar>
          <div class="services-section__text">
            <h3 class="services-section__item-title">Lorem Ipsum</h3>
            <p class="services-section__item-description">It is a long established fact that a reader will be distracted by the</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.services-section {
  padding-top: 32px;
  padding-bottom: 32px;

  &__header {
    text-align: center;
    margin-bottom: 32px;
  }

  &__title {
    font-size: 32px;
    font-weight: bold;
  }




  &__item-content {
    display: flex;
    align-items: center;
     justify-content: center;
  }

  &__icon {
    background-color: #E0E0E0;
  display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px; // para q no se choque el logo con el texto

  }

  &__img-icon {
    max-width: 60%;
  max-height: 60%;
    width: auto;
  }

 

  &__item-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  &__item-description {
    font-size: 14px;
    color: black;
  }
}
</style>