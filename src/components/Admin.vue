<template>
  <div class="admin-panel">
    <h2 class="admin-panel__title">Administración</h2>

    <nav class="admin-panel__top-navigation">
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'usuarios' }"
        @click="botonActual = 'usuarios'"
      >
        <div class="admin-panel__top-nav-icon">
          <img src="../imgs/icons/admin-usuario.svg" alt="Icono Usuarios" />
        </div>
        <span class="admin-panel__top-nav-text">Usuarios/Roles</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'salas' }"
        @click="botonActual = 'salas'"
      >
        <div class="admin-panel__top-nav-icon">
          <img src="../imgs/icons/admin-oficina.svg" alt="Icono Salas/Sedes" />
        </div>
        <span class="admin-panel__top-nav-text">Salas/Sedes</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'zonas' }"
        @click="botonActual = 'zonas'"
      >
        <div class="admin-panel__top-nav-icon">
          <img  src="../imgs/icons/admin-zonas.svg" alt="Icono Zonas/Puestos" />
        </div>
        <span class="admin-panel__top-nav-text">Zonas/Puestos</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'reservas' }"
        @click="botonActual = 'reservas'"
      >
        <div class="admin-panel__top-nav-icon">
          <img  src="../imgs/icons/admin-calendario.svg" alt="Icono Reservas/Disponibilidad" />
        </div>
        <span class="admin-panel__top-nav-text">Reservas/Disponibilidad</span>
      </button>
    </nav>

    <div v-if="botonActual === 'usuarios'" class="admin-panel__content-section">
      <h3>Gestión de Usuarios y Roles</h3>
      <div class="admin-panel__section">
        <button class="admin-panel__section-title" @click="toggleSection('buscarUsuarios')">BUSCAR USUARIOS</button>
        <div v-if="seccionActiva === 'buscarUsuarios'" class="admin-panel__section-content">
          <div class="admin-panel__action-item">
            <input type="text" class="admin-panel__input" placeholder="Busca usuarios por su email o nombre">
            <button class="admin-panel__button">Buscar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="botonActual === 'salas'" class="admin-panel__content-section">
      <h3>Gestión de Salas y Sedes</h3>
      <div class="admin-panel__section">
        <button class="admin-panel__section-title" @click="toggleSection('añadirSalas')">AÑADIR SALAS</button>
        <div v-if="seccionActiva === 'añadirSalas'" class="admin-panel__section-content">
          <div class="admin-panel__action-item">
            <input type="text" class="admin-panel__input" placeholder="Nombre de la sala">
            <button class="admin-panel__button">Añadir</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="botonActual === 'zonas'" class="admin-panel__content-section">
      <h3>Gestión de Zonas y Puestos</h3>
      <p>Contenido para la gestión de zonas y puestos.</p>
    </div>

    <div v-if="botonActual === 'reservas'" class="admin-panel__content-section">
      <h3>Gestión de Reservas y Disponibilidad</h3>
      <p>Contenido para la gestión de reservas y disponibilidad.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      botonActual: 'usuarios',
      seccionActiva: null
    };
  },
  methods: {
    toggleSection(sectionName) {
      this.seccionActiva = this.seccionActiva === sectionName ? null : sectionName;
    },
  },
};
</script>

<style lang="scss">
.admin-panel {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: sans-serif;
  margin: 10px auto;
  box-sizing: border-box;

  &__title {
    font-size: 20px;
    margin-bottom: 15px;
    text-align: center;
    color: black;
    background-color: rgb(190, 190, 190);
  }

  &__top-navigation {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
    justify-content: space-around;
  }

  &__top-nav-item {
    flex-basis: calc(50% - 10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #f9f9f9;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  &__top-nav-icon {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &__top-nav-text {
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }

  &__content-section {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-bottom: 15px;
    background-color: white;
  }

  &__section {
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
  }

  &__section-title {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    background-color: #f9f9f9;
    border: none;
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-weight: bold;
    cursor: pointer;
    box-sizing: border-box;
    font-size: 14px;

    &:hover {
      background-color: #eee;
    }
  }

  &__section-content {
    padding: 10px;
    background-color: white;
  }

  &__action-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
    flex-direction: column;
  }

  &__input {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  &__button {
    padding: 6px 10px;
    border: 1px solid #333;
    border-radius: 3px;
    background-color: #f9f9f9;
    cursor: pointer;
    font-size: 12px;
  }


}
@media (min-width: 768px) {
  .admin-panel {
    padding: 30px;

    &__title {
      font-size: 28px;
      margin-bottom: 30px;
      text-align: center;
    }

    &__top-navigation {
      display: flex;
      justify-content: center;
      border-bottom: 2px solid #ddd;
      margin-bottom: 30px;
      padding-bottom: 15px;
    }

    &__top-nav-item {
      flex-basis: auto;
      margin-right: 25px;
      margin-bottom: 0;
      padding: 15px 20px;
      border-radius: 8px;

     

      &.activo {
        background-color: #e0e0e0;
      }
    }

    &__top-nav-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #dbd8d8;

      img {
          max-width: 60%;
          max-height: 60%;
      }
    }

    &__top-nav-text {
      font-size: 16px;
    text-align: center;
      white-space: nowrap;
    }

    &__content-section {
      padding: 20px;
     border: 1px solid #ddd;
      border-radius: 8px;
     margin-bottom: 25px;
      background-color: white;

      h3 {
        font-size: 20px;
      margin-bottom: 15px;
        text-align: center;
      }
    }

    &__section {
      margin-bottom: 20px;
      border: 1px solid #dbd8d8;
      border-radius: 8px;
    }

    &__section-title {
      display: flex;
     align-items: center;
      width: 100%;
      padding: 12px 18px;   
         background-color: #dbd8d8;
      border: none;
    border-bottom: 1px solid #ddd;
     text-align: center;
    font-weight: bold;
      cursor: pointer;
     box-sizing: border-box;
      font-size: 16px;
      border-radius: 8px 8px;

      &:hover {
        background-color: #dbd8d8;
      }
    }

    &__section-content {
      padding: 20px;
     background-color: white;
      border-radius: 0 0 8px 8px;
    }

    &__action-item {
     display: flex;
   gap: 20px;
    margin-bottom: 15px;
      align-items: center;
    flex-direction: row;
      justify-content: center;
    }

    &__input {
      padding: 10px;
    border: 1px solid #dbd8d8;
    border-radius: 5px;
     font-size: 16px;
      width: 60%;
     box-sizing: border-box;
    }

    &__button {
      padding: 10px 20px;
      border: 1px solid black;
    border-radius: 5px;
      background-color: white;
      cursor: pointer;
      font-size: 16px;
    }
  }
}
</style>