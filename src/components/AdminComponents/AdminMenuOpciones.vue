<template>
  <div class="admin-page">
    <section class="top-image-gallery">
      <router-link to="/adminusers" class="image-link">
        <div class="image-item">
          <img src="../../imgs/icons/admin-usuario.svg" alt="Gestionar Usuarios" class="gallery-image" />
          <p class="image-text">Usuarios</p>
        </div>
      </router-link>

      <router-link to="/adminsedes" class="image-link">
        <div class="image-item">
          <img src="../../imgs/icons/admin-oficina.svg" alt="Gestionar Sedes" class="gallery-image" />
          <p class="image-text">Sedes</p>
        </div>
      </router-link> 

      <router-link to="/adminsalas" class="image-link">
        <div class="image-item">
          <img src="../../imgs/icons/admin-zonas.svg" alt="Gestionar Salas" class="gallery-image" />
          <p class="image-text">Salas</p>
        </div>
      </router-link>

      <router-link to="/adminreservas" class="image-link">
        <div class="image-item">
          <img src="../../imgs/icons/admin-calendario.svg" alt="Gestionar Reservas" class="gallery-image" />
          <p class="image-text">Reservas</p>
        </div>
      </router-link>
      

       <router-link to="/grafico" class="image-link">
        <div class="image-item">
          <img src="../../imgs/icons/admin-estadisticas.svg" alt="Estadisticas de ventas" class="gallery-image" />
          <p class="image-text">Estadisticas</p>
        </div>
      </router-link>
    </section>
  </div>
</template>


<style scoped>
.admin-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.top-image-gallery {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  padding: 20px 10px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 800px;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 80px;
  max-width: 120px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  padding: 10px;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.image-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.gallery-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-bottom: 6px;
}

.image-text {
  font-size: 0.85em;
  font-weight: bold;
  color: #333;
  margin: 0;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .top-image-gallery {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    margin-bottom: 20px;
  }

  .image-item {
    width: 40%;
    max-width: none;
    min-width: 100px;
    padding: 8px;
  }

  .gallery-image {
    width: 30px;
    height: 30px;
  }

  .image-text {
    font-size: 0.75em;
  }
}

@media (max-width: 480px) {
  .image-item {
    width: 45%;
    padding: 6px;
  }

  .gallery-image {
    width: 28px;
    height: 28px;
  }

  .image-text {
    font-size: 0.7em;
  }
}
</style>