<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  }
};
</script>

<template>
  <div class="layout">
    <Header />
  </div>
</template>
