<template>
  <div class="card shadow border-0 mb-7">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Gestión de Usuarios</h5>
      <div class="header-controls">
        <div class="input-group input-group-sm input-group-inline me-3">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control ps-0" placeholder="Buscar usuario..." v-model="searchQuery">
        </div>
        <button @click="openAddUserModal" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#userModal">
          <i class="bi bi-plus me-2"></i>Añadir Usuario
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-nowrap">
        <thead class="thead-light">
          <tr>
            <th scope="col" class="text-start">Acciones</th>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Email</th>
            <th scope="col">Rol ID</th>
            <th scope="col">Fecha Registro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="adminStore.cargando">
            <td colspan="7" class="text-center py-4">Cargando usuarios...</td>
          </tr>
          <tr v-else-if="adminStore.error">
            <td colspan="7" class="text-center text-danger py-4">Error al cargar usuarios: {{ adminStore.error }}</td>
          </tr>
          <tr v-else-if="filteredUsuarios.length === 0">
            <td colspan="7" class="text-center py-4">No se encontraron usuarios.</td>
          </tr>
          <tr v-for="usuario in filteredUsuarios" :key="usuario.idUsuario">
            <td class="text-start">
          <button @click="editUser(usuario)" class="btn btn-sm btn-warning me-2" data-bs-toggle="modal" data-bs-target="#userModal">
            EDITAR
          </button>
                    <button @click="confirmDelete(usuario.idUsuario)" type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
            ELIMINAR
          </button>
            </td>
            <td>{{ usuario.idUsuario }}</td>
            <td>
              <span class="text-heading font-semibold">{{ usuario.nombre }}</span>
            </td>
            <td>{{ usuario.apellidos }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.idRol }}</td>
            <td>{{ formatFechaRegistro(usuario.fechaRegistro) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer border-0 py-5">
      <span class="text-muted text-sm">Mostrando {{ filteredUsuarios.length }} usuarios.</span>
    </div>
  </div>

  <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="userModalLabel">{{ currentUser?.idUsuario ? 'Editar Usuario' : 'Añadir Nuevo Usuario' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <UsuarioForm :usuario="currentUser" @submit-form="handleUserSubmit" @cancel="closeUserModal" />
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteConfirmModalLabel">Confirmar Eliminación</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres eliminar al usuario con ID: <strong>{{ userToDeleteId }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteUserConfirmed">ELIMINAR</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAdminStore } from '@/store/adminStore';
import UsuarioForm from '../components/forms/UsuariosForm.vue';
import { Modal } from 'bootstrap';

const adminStore = useAdminStore(); 
const searchQuery = ref(''); // buscar elementos

const currentUser = ref(null); // usuario actual para editar o añadir
const userToDeleteId = ref(null); // id para borrar el usuario especifico

let userModalInstance = null;
let deleteConfirmModalInstance = null;

onMounted(() => {
  adminStore.obtenerTodosLosUsuarios();

  userModalInstance = new Modal(document.getElementById('userModal'));
  deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal'));
});

const filteredUsuarios = computed(() => {
  if (!searchQuery.value) {
    return adminStore.usuarios;
  }
  // mejorar alcance si es mayusculas o minusculas, email, etc
  const query = searchQuery.value.toLowerCase();
  return adminStore.usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(query) ||
    usuario.apellidos.toLowerCase().includes(query) ||
    usuario.email.toLowerCase().includes(query) ||
    String(usuario.idUsuario).includes(query) ||
    String(usuario.idRol).includes(query)
  );
});


// formato legible fechas
const formatFechaRegistro = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('es-ES', options);
};

const openAddUserModal = () => {
  currentUser.value = null;
// añadir usuario, por defecto en nulo
};

const editUser = (usuario) => {
  currentUser.value = { ...usuario };
// cargar la data que ya hay del usuario elegido para editarlo
};

const confirmDelete = (id) => {
  userToDeleteId.value = id;
  // metodo para borrar por su id
};

// cerrar el add
const closeUserModal = () => {
  if (userModalInstance) {
    userModalInstance.hide();
  }
};
// confirmar el delete
const closeDeleteConfirmModal = () => {
  if (deleteConfirmModalInstance) {
    deleteConfirmModalInstance.hide();
  }
};
// confirmar edit o add
const handleUserSubmit = async (formData) => {
  let success = false;
  try {
    if (formData.idUsuario) {
      await adminStore.actualizarUsuario(formData.idUsuario, formData);
      success = true;
    } else {
      await adminStore.agregarUsuario(formData);
      success = true;
    }
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    alert(`Error al guardar usuario: ${adminStore.error || error.message}`);
  }

  if (success) {
    closeUserModal();
    await adminStore.obtenerTodosLosUsuarios();
  }
};

const deleteUserConfirmed = async () => {
  if (userToDeleteId.value) {
    try {
      await adminStore.eliminarUsuario(userToDeleteId.value);
      closeDeleteConfirmModal();
      userToDeleteId.value = null;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(`Error al eliminar usuario: ${adminStore.error || error.message}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.card-header {
  padding: 24px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .header-controls {
    width: 100%;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;

    .input-group-inline {
      width: 100%;
      margin-right: 0;
      .form-control {
        min-width: 0;
      }
    }
    .btn {
      width: 100%;
    }
  }

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .header-controls {
      width: auto;
      margin-top: 0;
      flex-direction: row;
      align-items: center;
      gap: 12px;

      .input-group-inline {
        width: 150px;
        margin-right: 0;
      }
      .btn {
        width: auto;
      }
    }
  }
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  width: 100%;
  min-width: max-content;
  border-collapse: collapse;

  thead {
    .thead-light {
      background-color: #f8f9fa;
    }
    th {
      font-weight: 600;
      white-space: nowrap;
      padding: 12px;
      vertical-align: bottom;
      border-bottom: 2px solid #dee2e6;
      text-align: left;

      &:first-child {
        text-align: start;
      }
      &:nth-child(7) {
        text-align: left;
        white-space: normal;
        min-width: 130px;
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #dee2e6;
      &:last-child {
        border-bottom: none;
      }
    }
    td {
      padding: 12px;
      vertical-align: middle;
      white-space: nowrap;
      font-size: 14px;

      &:nth-child(7) {
        white-space: normal;
        word-break: break-word;
      }
    }
  }
}

@media (max-width: 768px) {
  .table {
    min-width: 0;
  }

  .table thead th:nth-child(2),
  .table tbody td:nth-child(2),
  .table thead th:nth-child(6),
  .table tbody td:nth-child(6),
  .table thead th:nth-child(7),
  .table tbody td:nth-child(7) {
    display: none;
  }

  .table thead th,
  .table tbody td {
    padding: 8px 8px;
    font-size: 13px;
  }

  .table tbody td:first-child {
    white-space: nowrap;
    text-align: start;
    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }
  }

  .table tbody td:nth-child(3) {
    white-space: normal;
    display: flex;
    align-items: center;
    .avatar {
      flex-shrink: 0;
      margin-right: 8px;
    }
    .text-heading {
      white-space: normal;
      word-break: break-word;
    }
  }
}

.table-hover tbody tr:hover {
  background-color: #e2e6ea;
}

.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 4px;
}

.btn-neutral {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #212529;
  &:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
  }
}

.text-danger-hover:hover {
  color: #dc3545;
}

.modal-dialog {
  max-width: 500px;
  margin: 28px auto;
}

.modal-content {
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
</style>