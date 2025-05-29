<template>
  <div class="header">
    <div class="header-child-1">
      <div class="header-child-1_left">
        <div class="header-child-1_left_info">
          <h6>Espacio de Cooworking en Zaragoza</h6>
        </div>
      </div>
      <div class="header-child-1_right">
        <div class="header-child-1_right_phone">
          <h6>691236425</h6>
        </div>
        <div class="header-child-1_right_email">
          <h6>Cooworking Las Fuentes</h6>
        </div>
        <div class="header-child-1_right_ubi">
          <h6>C/ Rodrigo Rebolledo 67</h6>
        </div>
      </div>
    </div>

    <div class="header-child-2">
      <div class="header-child-2_left">
        <router-link to="/home">
          <img src="../imgs/logo.svg" alt="logo" />
        </router-link>
      </div>

      <div class="header-child-2_mid">
        <div class="header-child-2_mid_heigt">
          <router-link to="/home" class="header-child-2_mid_bienvenido">Bienvenido</router-link>
          <router-link to="/sedes" class="header-child-2_mid_espacios">Sedes</router-link>
          <router-link to="/precios" class="header-child-2_mid_precios">Precios</router-link>
          <router-link to="/servicios" class="header-child-2_mid_servicios">Sérvicios</router-link>
          <a href="/home#form" class="header-child-2_mid_masInfo">Más Info</a>
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
          <router-link to="/servicios" @click="toggleMenu">Servicios</router-link>
          <a href="/home#form" @click="toggleMenu">Más Info</a>
          <router-link :to="userLink" @click="toggleMenu">Login</router-link>
        </div>
      </div>

      <!-- ICONO LOGIN SOLO EN >1250px -->
      <div class="header-child-2_right">
        <router-link :to="userLink">
          <img src="../imgs/icons/User_Logo.svg" alt="User logo" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../store/userStore'

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
<style lang="scss" scoped>
h6 {
  color: white;
  margin-bottom: 0;
}

.header {
  height: 150px;

  .header-child-1 {
    background-color: black;
    height: 50px;
    display: flex;
    flex-direction: row;

    .header-child-1_left {
      width: 50%;
      height: 100%;

      .header-child-1_left_info {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    }

    .header-child-1_right {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: row;

      @media (max-width: 1560px) {
        width: 65%;
      }

      .header-child-1_right_phone,
      .header-child-1_right_email,
      .header-child-1_right_ubi {
        width: 33%;
        display: flex;
        height: 100%;
        align-items: center;
        gap: 8px;

        h6 {
          margin: 0;
        }

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

      .header-child-1_right_phone::before {
        background-image: url('../imgs/icons/phone.svg');
      }

      .header-child-1_right_email::before {
        background-image: url('../imgs/icons/email.svg');
      }

      .header-child-1_right_ubi::before {
        background-image: url('../imgs/icons/ubi.svg');
      }
    }
  }

  .header-child-2 {
    height: 100px;
    display: flex;
    flex-direction: row;
    background: #e5e5e5;
    position: relative;

    .header-child-2_left {
      height: 100%;
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .header-child-2_mid {
      height: 100%;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      @media (max-width: 1500px) {
        width: 60%;
      }

      .header-child-2_mid_heigt {
        display: flex;
        flex-direction: row;
        height: 65px;

        .header-child-2_mid_bienvenido,
        .header-child-2_mid_espacios,
        .header-child-2_mid_precios,
        .header-child-2_mid_servicios {
          display: flex;
          align-items: center;
          margin: 5px 0px 0 25px;
          padding-right: 25px;
          font-size: 25px;
          font-weight: 500;
          flex-direction: row;
          border-right: 2px solid black;
        }

        .header-child-2_mid_masInfo {
          display: flex;
          align-items: center;
          margin: 5px 0px 0 25px;
          padding: 25px;
          font-size: 25px;
          font-weight: 500;
          border: 2px solid black;

          @media (max-width: 1657px) {
            padding: 8px 15px;
            min-width: 150px;
          }

          @media (max-width: 1617px) {
            padding: 8px 10px;
            min-width: 175px;
          }

          &::after {
            content: "";
            display: inline-block;
            width: 17px;
            height: 17px;
            margin-left: 15px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url('../imgs/icons/arrow.svg');
          }
        }
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    }

    .header-child-2_right {
      height: 100%;
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;

      @media (max-width: 1500px) {
        width: 15%;
      }

      @media (max-width: 1250px) {
        display: none;
      }

      img {
        height: 56px;
        margin-top: 5px;
      }
    }
  }
}


@media (max-width: 1250px) {
  .header-child-2 {
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  .header-child-2_left {
    width: auto !important;
    justify-content: flex-start !important;
    padding-left: 0 !important;

    img {
      height: 60px;
      width: auto;
      max-width: 100%;
    }
  }

  .header-child-2_mid {
    width: auto !important;
    flex: unset !important;
    justify-content: flex-end !important;
  }

  .header-child-2_mid_heigt {
    display: none !important;
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

  .header-child-1_left {
    width: 40% !important;
  }

  .header-child-1_right {
    gap: 20px;
    width: 65%;

    .header-child-1_right_phone {
      width: auto !important;
    }

    .header-child-1_right_email {
      width: auto !important;
    }

    .header-child-1_right_ubi {
      width: auto !important;
    }
  }
}

@media(max-width: 950px) {
  .header-child-1 {
    height: auto !important;
    flex-direction: column !important;

    .header-child-1_left {
      width: 100% !important;
      padding: 5px 0;
    }

    .header-child-1_right {
      width: 100% !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 0 5px;

      .header-child-1_right_phone {
        padding: 5px 0;
      }

      .header-child-1_right_email {
        padding: 5px 0;
      }

      .header-child-1_right_ubi {
        padding: 5px 0;
      }
    }
  }
}

@media(min-width:1250px){
  .hamburger-menu{
    display: none !important;
  }
}
</style>
