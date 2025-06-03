<template>
  <div class="header">
    <div class="header__top">
      <div class="header__top-left">
        <div class="header__top-left-info">
          <h6>Espacio de Cooworking en Zaragoza</h6>
        </div>
      </div>
      <div class="header__top-right">
        <div class="header__top-right-phone">
          <h6>691236425</h6>
        </div>
        <div class="header__top-right-email">
          <h6>coworkingzgzdaw@gmail.com</h6>
        </div>
        <div class="header__top-right-ubi">
          <h6>C/ Rodrigo Rebolledo 67</h6>
        </div>
      </div>
    </div>

    <div class="header__bottom">
      <div class="header__bottom-left">
        <router-link to="/home">
          <img class="logo" src="../imgs/logo.png" alt="logo" />
        </router-link>
      </div>

      <div class="header__bottom-mid">
        <div class="header__bottom-mid-nav">
          <router-link to="/home" class="header__nav-item">Bienvenido</router-link>
          <router-link to="/sedes" class="header__nav-item">Sedes</router-link>
          <router-link to="/precios" class="header__nav-item">Precios</router-link>
          <a href="/home#form" class="header__nav-item">Contacto</a>
        </div>

        <div class="hamburger" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="hamburger-menu" v-if="menuOpen">
          <router-link to="/home" @click="toggleMenu">Bienvenido</router-link>
          <router-link to="/sedes" @click="toggleMenu">Sedes</router-link>
          <router-link to="/precios" @click="toggleMenu">Precios</router-link>
          <a href="/home#form" @click="toggleMenu">Contacto</a>
          <router-link :to="userLink" @click="toggleMenu">Login</router-link>
        </div>
      </div>

      <div class="header__bottom-right">
        <router-link :to="userLink">
          <img src="../imgs/icons/User_Logo.svg" alt="User logo" />
        </router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../store/UserStore'

const menuOpen = ref(false)
const userStore = useUserStore()

// variable reactiva para saber si el usuario esta autenticado
const isAuthenticated = ref(false)

// funcion para alternar el estado del menu
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// funcion para verificar si el usuario esta autenticado
const checkAuth = () => {
  const authToken = localStorage.getItem('authToken') // obtiene el token del almacenamiento local
  isAuthenticated.value = !!authToken && !!userStore.user // verifica si hay token y usuario en el store
}

// ruta dinamica segun si el usuario esta autenticado o no
const userLink = computed(() => {
  return isAuthenticated.value ? '/userinfo' : '/login'
})

// al montar el componente se verifica la autenticacion
onMounted(() => {
  checkAuth()
})

// observa los cambios en el usuario del store y verifica la autenticacion cada vez que cambia
watch(() => userStore.user, () => {
  checkAuth()
}, { immediate: true })

</script>

<style scoped lang="scss">
h6 {
  color: white;
  margin-bottom: 0;
}

.header {
  height: 150px;

  &__top {
    background-color: #234b59;
    height: 50px;
    display: flex;
    flex-direction: row;

    &-left {
      width: 50%;
      height: 100%;

      &-info {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    }

    &-right {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: row;

      @media (max-width: 1560px) {
        width: 65%;
      }

      &-phone,
      &-email,
      &-ubi {
        width: 33%;
        display: flex;
        height: 100%;
        align-items: center;
        gap: 8px;

        &::before {
          content: "";
          display: inline-block;
          width: 17px;
          height: 17px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      }

      &-phone::before {
        background-image: url('../imgs/icons/phone.svg');
      }

      &-email::before {
        background-image: url('../imgs/icons/email.svg');
      }

      &-ubi::before {
        background-image: url('../imgs/icons/ubi.svg');
      }
    }
  }

  &__bottom {
    height: 100px;
    display: flex;
    flex-direction: row;
    background: white;
    position: relative;

    &-left {
      height: 100%;
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-mid {
      height: 100%;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      @media (max-width: 1500px) {
        width: 60%;
      }

      &-nav {
        display: flex;
        flex-direction: row;
        height: 65px;
        align-items: center;

        .header__nav-item {
          display: flex;
          align-items: center;
          padding: 0 25px;
          font-size: 22px;
          font-weight: 500;
          height: fit-content;
          flex-direction: row;
          border-right: 2px solid #234b59;
          color: #234b59;
          text-decoration: none;
        }

        .header__nav-item:last-child {
          border-right: none;
        }
      }
    }

    &-right {
      height: 100%;
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;

      @media (max-width: 800px) {
        width: 15%;
        display: none;
      }

      img {
        height: 56px;
        margin-top: 5px;
      }
    }
  }
}

@media (max-width: 800px) {
  .header__bottom {
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    &-left {
      width: auto !important;
      justify-content: flex-start !important;
      padding-left: 0 !important;

      img {
        height: 120px;
        width: auto;
        max-width: 100%;
      }
    }

    &-mid {
      width: auto !important;
      flex: unset !important;
      justify-content: flex-end !important;

      &-nav {
        display: none !important;
      }
    }
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 25px;
    cursor: pointer;
    margin-left: auto;

    span {
      height: 4px;
      width: 100%;
      background: black;
      border-radius: 2px;
    }
  }

  .hamburger-menu {
    right: -20px !important;
    width: 100vw;
    position: absolute;
    top: 100%;
    right: 20px;
    background: #e5e5e5;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation: fadeInDown 0.3s ease-out;

    a {
      color: #333;
      text-decoration: none;
      font-size: 20px;
      font-weight: 600;
      padding: 10px 5px;
      transition: all 0.2s ease;

      &:hover {
        color: #FF5500;
        transform: translateX(5px);
      }
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

@media(max-width: 1300px) {
  .header {
    height: auto;
  }

  .header__top-left {
    width: 40% !important;
  }

  .header__top-right {
    gap: 20px;
    width: 65%;

    &-phone,
    &-email,
    &-ubi {
      width: auto !important;
    }

  }
}

@media(max-width: 950px) {
  .header__top {
    height: auto !important;
    flex-direction: column !important;

    &-left {
      width: 100% !important;
      padding: 5px 0;
    }

    &-right {
      width: 100% !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 0 5px;

      &-phone,
      &-email,
      &-ubi {
        padding: 5px 0;
      }
    }
  }
}

@media(min-width: 1250px) {
  .hamburger-menu {
    display: none !important;
  }
}

.logo {
  height: 120px;
}

.header__top-right-ubi{
  padding-left: 15px;
}
</style>

