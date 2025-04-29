<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  }
};
</script>

<template>
  <div class="layout">
    <Header />
    <RouterLink />
    <Footer />
  </div>
</template>


<style scoped lang="scss">

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout > *:nth-last-child(2) {
  flex: 1;
}

</style>
