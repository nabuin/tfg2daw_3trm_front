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
          </div>
        <span class="admin-panel__top-nav-text">Usuarios/Roles</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'salas' }"
        @click="botonActual = 'salas'"
      >
        <div class="admin-panel__top-nav-icon">
          </div>
        <span class="admin-panel__top-nav-text">Salas/Sedes</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'zonas' }"
        @click="botonActual = 'zonas'"
      >
        <div class="admin-panel__top-nav-icon">
          </div>
        <span class="admin-panel__top-nav-text">Zonas/Puestos</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'reservas' }"
        @click="botonActual = 'reservas'"
      >
        <div class="admin-panel__top-nav-icon">
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
      botonActual: 'usuarios', // por defecto
      seccionActiva: null, // desplegable de cada bloque
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
  width: 90%;
  max-width: 800px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: sans-serif;
  margin: 20px auto;
  box-sizing: border-box;

  &__title {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: black;
    background-color: rgb(190, 190, 190);
  }

  &__top-navigation {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
  }

  &__top-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    background-color: #f9f9f9;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    box-sizing: border-box;

    &:hover {
      background-color: #eee;
    }

    &.activo {
      background-color: white;
    }
  }

  &__top-nav-icon {
    width: 30px;
    height: 30px;
    border: 1px solid #333;
    border-radius: 5px;
    margin-bottom: 5px;
  }

  &__top-nav-text {
    font-size: 14px;
    text-align: center;
  }

  &__content-section {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-bottom: 20px;
    background-color: white;
  }

  &__section {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 3px;
  }

  &__section-title {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 15px;
    background-color: #f9f9f9;
    border: none;
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-weight: bold;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
      background-color: #eee;
    }
  }

  &__section-content {
    padding: 15px;
    background-color: white;
  }

  &__action-item {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
  }

  &__input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  &__button {
    padding: 8px 12px;
    border: 1px solid #333;
    border-radius: 3px;
    background-color: #f9f9f9;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>