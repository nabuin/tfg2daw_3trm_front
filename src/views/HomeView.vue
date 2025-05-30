<script lang="ts">
import Home_Slider from '../components/Home_Slider.vue';
import Home_Sercios from '../components/Home_Servicios.vue';
import Home_Info from '../components/Home_Info.vue';
import Home_Form from '../components/Home_Form.vue';

export default {
  components: {
    Home_Slider,
    Home_Sercios,
    Home_Info,
    Home_Form,
  },
};
</script>


<template>
    <Home_Slider />
    <Home_Sercios />

    <Home_Form />
    <Home_Info />
</template>


<style scoped lang="scss">


</style>

