<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useUserStore } from './store/userStore';

export default {
  components: {
    Header,
    Footer,
    RouterView
  },
  created() {
    const userStore = useUserStore();
    userStore.cargarUsuarioFetch(); // cargar siempre la info del usuario, para evitar q este el token de JWT pero no la info en el store
  },
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
