<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
    RouterView
  }
};
</script>

<template>
  <div class="layout">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>


<style scoped lang="scss">

.layout {
  display: flex;
  flex-direction: column;
}

.layout > *:nth-last-child(2) {
  flex: 1;
}

</style>
