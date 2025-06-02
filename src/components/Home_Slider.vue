<template>
  <v-container fluid class="slider-custom pa-0">
    <v-carousel
      hide-delimiter-background
      height="100%"
      show-arrows="hover"
      cycle
      interval="5000"
    >
      <v-carousel-item>
        <div class="slider-custom__img"></div>
      </v-carousel-item>
      <v-carousel-item>
        <div class="slider-custom__img-2"></div>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>



<style lang="scss" scoped>
.slider-custom {
  width: 100%;

  &__img {
    background-image: url('../imgs/slider/slider-img-1.avif');
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 700px;
  }

  &__img-2 {
    background-image: url('../imgs/slider/slider-img-2.webp');
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 700px;
  }

  @media (max-width: 1199px) {
    &__img {
      height: 500px;
    }
    &__img-2 {
      height: 500px;
    }
  }

  @media (max-width: 599px) {
    &__img {
      height: 300px;
    }
    &__img-2 {
      height: 300px;
    }
  }
}
</style>
