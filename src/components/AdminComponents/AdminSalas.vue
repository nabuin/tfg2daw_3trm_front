<template>
  <div class="card shadow border-0 mb-7">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Gestión de Salas</h5>
      <div class="header-controls">
        <div class="input-group input-group-sm input-group-inline me-3">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control ps-0" placeholder="Buscar sala..." v-model="searchQuery">
        </div>
        <button @click="openAddSalaModal" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#salaModal">
          <i class="bi bi-plus me-2"></i>Añadir Sala
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
            <th scope="col">Capacidad</th>
            <th scope="col">Tipo de Sala</th>
            <th scope="col">Sede (ID)</th>
            <th scope="col">Bloqueada</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="salasStore.cargando">
            <td colspan="7" class="text-center py-4">Cargando salas...</td>
          </tr>
          <tr v-else-if="salasStore.error">
            <td colspan="7" class="text-center text-danger py-4">Error al cargar salas: {{ salasStore.error }}</td>
          </tr>
          <tr v-else-if="filteredSalas.length === 0">
            <td colspan="7" class="text-center py-4">No se encontraron salas.</td>
          </tr>
          <tr v-for="sala in filteredSalas" :key="sala.idSala">
            <td class="text-start">
              <button @click="editSala(sala)" class="btn btn-sm btn-warning me-2" data-bs-toggle="modal" data-bs-target="#salaModal">
                EDITAR
              </button>
              <button @click="confirmDelete(sala.idSala)" type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                ELIMINAR
              </button>
            </td>
            <td>{{ sala.idSala }}</td>
            <td>
              <span class="text-heading font-semibold">{{ sala.nombre }}</span>
            </td>
            <td>{{ sala.capacidad }}</td>
            <td>{{ salasStore.obtenerTipoSalaPorId(sala.idTipoSala)?.nombre || 'Desconocido' }}</td>
            <td>{{ sala.idSede }}</td>
            <td>
              <span :class="['badge', sala.bloqueado ? 'bg-danger' : 'bg-success']">
                {{ sala.bloqueado ? 'Sí' : 'No' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer border-0 py-5">
      <span class="text-muted text-sm">Mostrando {{ filteredSalas.length }} salas.</span>
    </div>
  </div>

  <div class="modal fade" id="salaModal" tabindex="-1" aria-labelledby="salaModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="salaModalLabel">{{ currentSala?.idSala ? 'Editar Sala' : 'Añadir Nueva Sala' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <SalaForm 
            :sala="currentSala" 
            :tiposSalas="salasStore.tiposSalas"
            :sedes="sedesStore.sedes" 
            @submit-form="handleSalaSubmit" 
            @cancel="closeSalaModal" 
          />
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
          <p>¿Estás seguro de que quieres eliminar la sala con ID: <strong>{{ salaToDeleteId }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteSalaConfirmed">ELIMINAR</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import { useSalasStore, type Sala, type TipoSala } from '../../store/AdminStores/AdminSalasStore'
import { useSedesStore } from '../../store/AdminStores/AdminSedesStore'
import SalaForm from '../../components/forms/SalaForm.vue'
import { Modal } from 'bootstrap'

// instancias de las stores
const salasStore = useSalasStore()
const sedesStore = useSedesStore()

// tipos reutilizables
type Nullable<T> = T | null

// estado reactivo para busqueda y sala actual
const searchQuery: Ref<string> = ref('')
const currentSala: Ref<Nullable<Sala>> = ref(null)
const salaToDeleteId: Ref<Nullable<number>> = ref(null)

// instancias de modales
let salaModalInstance: Nullable<Modal> = null
let deleteConfirmModalInstance: Nullable<Modal> = null

onMounted(async () => {
  try {
    // cargar todas las salas tipos de sala y sedes
    await Promise.all([
      salasStore.obtenerTodasLasSalas(),
      salasStore.obtenerTodosLosTiposSalas(),
      sedesStore.obtenerTodasLasSedes()
    ])
    // inicializar modal de sala y confirmacion
    salaModalInstance = new Modal(document.getElementById('salaModal')!)
    deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal')!)
  } catch (error: any) {
    console.error('error al cargar datos iniciales', error)
  }
})

// filtrar salas segun texto de busqueda
const filteredSalas = computed((): Sala[] => {
  if (!searchQuery.value) {
    return salasStore.salas
  }
  const query = searchQuery.value.toLowerCase()
  return salasStore.salas.filter(sala =>
    sala.nombre.toLowerCase().includes(query) ||
    sala.capacidad.toString().includes(query) ||
    sala.idSala.toString().includes(query) ||
    (salasStore.obtenerTipoSalaPorId(sala.idTipoSala)?.nombre || '').toLowerCase().includes(query) ||
    sala.idSede.toString().includes(query)
  )
})

// abrir modal para agregar sala (currentSala nulo)
const openAddSalaModal = (): void => {
  currentSala.value = null
}

// editar sala cargando datos en currentSala
const editSala = (sala: Sala): void => {
  currentSala.value = { ...sala }
}

// preparar id de sala para eliminar
const confirmDelete = (id: number): void => {
  salaToDeleteId.value = id
}

// cerrar modal de sala
const closeSalaModal = (): void => {
  salaModalInstance?.hide()
}

// cerrar modal de confirmacion de eliminacion
const closeDeleteConfirmModal = (): void => {
  deleteConfirmModalInstance?.hide()
}

// manejar envio de formulario sala
const handleSalaSubmit = async (formData: Sala): Promise<void> => {
  try {
    if (formData.idSala) {
      // actualizar sala existente
      await salasStore.actualizarSala(formData.idSala, formData)
    } else {
      // crear nueva sala
      await salasStore.agregarSala(formData)
    }
    closeSalaModal()
    // recargar lista de salas
    await salasStore.obtenerTodasLasSalas()
  } catch (error: any) {
    console.error('error al guardar sala', error)
    alert(`error al guardar sala: ${salasStore.error || error.message}`)
  }
}

// confirmar eliminacion de sala
const deleteSalaConfirmed = async (): Promise<void> => {
  if (salaToDeleteId.value != null) {
    try {
      await salasStore.eliminarSala(salaToDeleteId.value)
      closeDeleteConfirmModal()
      salaToDeleteId.value = null
      // recargar lista de salas
      await salasStore.obtenerTodasLasSalas()
    } catch (error: any) {
      console.error('error al eliminar sala', error)
      alert(`error al eliminar sala: ${salasStore.error || error.message}`)
    }
  }
}
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


    }
  }
}

@media (max-width: 768px) {
  .table {
    min-width: 0;
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