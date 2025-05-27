<template>
  <div class="card shadow border-0 mb-7">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Gestión de Sedes</h5>
      <div class="header-controls">
        <div class="input-group input-group-sm input-group-inline me-3">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control ps-0" placeholder="Buscar sede..." v-model="searchQuery">
        </div>
        <button @click="openAddSedeModal" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#sedeModal">
          <i class="bi bi-plus me-2"></i>Añadir Sede
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-nowrap">
        <thead class="thead-light">
          <tr>
            <th scope="col" class="text-start">Acciones</th>
            <th scope="col">ID</th>
            <th scope="col">País</th>
            <th scope="col">Ciudad</th>
            <th scope="col">Dirección</th>
            <th scope="col">Código Postal</th>
            <th scope="col">Planta</th>
            </tr>
        </thead>
        <tbody>
          <tr v-if="sedesStore.cargando">
            <td colspan="7" class="text-center py-4">Cargando sedes...</td>
          </tr>
          <tr v-else-if="sedesStore.error">
            <td colspan="7" class="text-center text-danger py-4">Error al cargar sedes: {{ sedesStore.error }}</td>
          </tr>
          <tr v-else-if="filteredSedes.length === 0">
            <td colspan="7" class="text-center py-4">No se encontraron sedes.</td>
          </tr>
          <tr v-for="sede in filteredSedes" :key="sede.idSede">
            <td class="text-start">
              <button @click="editSede(sede)" class="btn btn-sm btn-warning me-2" data-bs-toggle="modal" data-bs-target="#sedeModal">
                EDITAR
              </button>
              <button @click="confirmDelete(sede.idSede)" type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                ELIMINAR
              </button>
            </td>
            <td>{{ sede.idSede }}</td>
            <td>
              <span class="text-heading font-semibold">{{ sede.pais }}</span>
            </td>
            <td>{{ sede.ciudad }}</td>
            <td>{{ sede.direccion }}</td>
            <td>{{ sede.codigoPostal }}</td>
            <td>{{ sede.planta }}</td>
            </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer border-0 py-5">
      <span class="text-muted text-sm">Mostrando {{ filteredSedes.length }} sedes.</span>
    </div>
  </div>

  <div class="modal fade" id="sedeModal" tabindex="-1" aria-labelledby="sedeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="sedeModalLabel">{{ currentSede?.idSede ? 'Editar Sede' : 'Añadir Nueva Sede' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <SedeForm :sede="currentSede" @submit-form="handleSedeSubmit" @cancel="closeSedeModal" />
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
          <p>¿Estás seguro de que quieres eliminar la sede con ID: <strong>{{ sedeToDeleteId }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteSedeConfirmed">ELIMINAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSedesStore } from '@/store/SedesStore';
import SedeForm from '../../components/forms/SedeForm.vue';
import { Modal } from 'bootstrap';

// usar la store de sedes
const sedesStore = useSedesStore();
const searchQuery = ref('');

const currentSede = ref(null);
const sedeToDeleteId = ref(null);

let sedeModalInstance = null;
let deleteConfirmModalInstance = null;

onMounted(() => {
  // obtener sedes
  sedesStore.obtenerTodasLasSedes();

  sedeModalInstance = new Modal(document.getElementById('sedeModal'));
  deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal'));
});

const filteredSedes = computed(() => {
  if (!searchQuery.value) {
    return sedesStore.sedes;
  }
  const query = searchQuery.value.toLowerCase();
  // busqueda info de las que hay
  return sedesStore.sedes.filter(sede =>
    sede.pais.toLowerCase().includes(query) ||
    sede.ciudad.toLowerCase().includes(query) ||
    sede.direccion.toLowerCase().includes(query) ||
    sede.codigoPostal.toLowerCase().includes(query) ||
    sede.planta.toLowerCase().includes(query) ||
    String(sede.idSede).includes(query)
  );
});

const openAddSedeModal = () => {
  currentSede.value = null;
};

const editSede = (sede) => {
  currentSede.value = { ...sede };
};

const confirmDelete = (id) => {
  sedeToDeleteId.value = id;
};

const closeSedeModal = () => {
  if (sedeModalInstance) {
    sedeModalInstance.hide();
  }
};

const closeDeleteConfirmModal = () => {
  if (deleteConfirmModalInstance) {
    deleteConfirmModalInstance.hide();
  }
};

const handleSedeSubmit = async (formData) => {
  let success = false;
  try {
    if (formData.idSede) {
      // actualizar sede con data formateada
      await sedesStore.actualizarSede(formData.idSede, formData);
      success = true;
    } else {
      // metodo añadir sede
      await sedesStore.agregarSede(formData);
      success = true;
    }
  } catch (error) {
    console.error('Error al guardar sede:', error); // debug
  }

  if (success) {
    closeSedeModal();
    // recargar sedes
    await sedesStore.obtenerTodasLasSedes();
  }
};

const deleteSedeConfirmed = async () => {
  if (sedeToDeleteId.value) {
    try {
      // llamar al delete
      await sedesStore.eliminarSede(sedeToDeleteId.value);
      closeDeleteConfirmModal();
      sedeToDeleteId.value = null;
      // borrar y recargar las sedes con la borrada
      await sedesStore.obtenerTodasLasSedes();
    } catch (error) {
      console.error('Error al eliminar sede:', error); // debug
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
    .text-heading {
      white-space: normal;
      word-break: break-word;
    }
  }
}

.table-hover tbody tr:hover {
  background-color: #e2e6ea;
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