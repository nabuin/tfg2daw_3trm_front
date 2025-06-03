<template>
  <v-container fluid class="slider">
    <v-carousel
      hide-delimiter-background
      height="100%"
      show-arrows="hover"
      cycle
      interval="5000"
    >
      <v-carousel-item>
        <div class="slider__image slider__image--1"></div>
      </v-carousel-item>
      <v-carousel-item>
        <div class="slider__image slider__image--2"></div>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>




<style lang="scss" scoped>
.slider {
  width: 100%;

  &__image {
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 700px;

    &--1 {
      background-image: url('../imgs/slider/slider-img-1.avif');
    }

    &--2 {
      background-image: url('../imgs/slider/slider-img-2.webp');
    }
  }

  @media (max-width: 1199px) {
    &__image {
      height: 500px;
    }
  }

  @media (max-width: 599px) {
    &__image {
      height: 300px;
    }
  }
}
</style>
