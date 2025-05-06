<template>
  <v-container class="services-section">
    <v-row class="services-section__header">
      <v-col cols="12">
        <h2 class="services-section__title">Nuestros Servicios</h2>
      </v-col>
    </v-row>
  
    <v-row class="services-section__row"> <!-- FILA 1-->
      <v-col cols="12"  md="6" class="services-section__item"> <div class="services-section__item-content">
        <!-- con cols 12 ocupa todo el plano horizontal disponible, para el mobile first en el que estarán todas una debajo de otras por defecto siempre-->
        <!-- md hace que en pantallas medias o grandes sea la mitad, osea q vaya de 2 en 2, afecta a partir de 960px de ancho-->
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
      <v-col cols="12"  md="6" class="services-section__item"> <div class="services-section__item-content">
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
      <v-col cols="12"  md="6" class="services-section__item"> <div class="services-section__item-content">
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
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 10%;
  padding-right: 10%;


  &__header {
    text-align: center;
    margin-bottom: 32px;
  }

  &__title {
    font-size: 32px;
  font-weight: bold;
    text-align: center;

  }

  &__row {
    margin-bottom: 20px;
 
  }


  &__item {
    margin-bottom: 20px;

    padding: 0;

    
  }

  &__item-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
     border-radius: 8px;
    background-color: #ffffff;
    height: 100%;
    box-sizing: border-box; // incluye el padding en el tamaño total
  }

  &__icon {
    background-color: #ffffff;
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

  &__text {
     flex-grow: 1;
  }

  &__item-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  &__item-description {
    font-size: 17px;
    color: grey;
  }

  @media (min-width: 768px) {
    &__item {
      margin-bottom: 0;


    }

    &__item-content {
       justify-content: flex-start;
    }
  }

  // para pantallas de ordenador
  @media (min-width: 1300px) {
    .services-section__item-title {
      font-size: 24px;
    }
    .services-section__item-description{ 
    font-size: 20px; 
    }
  }
  
}
</style>