<template>
  <div class="card shadow border-0 mb-7">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Gestión de Reservas</h5>
      <div class="header-controls">
        <div class="input-group input-group-sm input-group-inline me-3">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control ps-0" placeholder="Buscar reserva..." v-model="searchQuery">
        </div>
        </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-nowrap">
        <thead class="thead-light">
          <tr>
            <th scope="col" class="text-start">Acciones</th>
            <th scope="col">ID Reserva</th>
            <th scope="col">Fecha</th>
            <th scope="col">Descripción</th>
            <th scope="col">Precio Total</th>
            <th scope="col">Usuario ID</th>
            <th scope="col">Usuario Nombre</th>
            <th scope="col">Usuario Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="reservasStore.cargando">
            <td colspan="8" class="text-center py-4">Cargando reservas...</td>
          </tr>
          <tr v-else-if="reservasStore.error">
            <td colspan="8" class="text-center text-danger py-4">Error al cargar reservas: {{ reservasStore.error }}</td>
          </tr>
          <tr v-else-if="filteredReservas.length === 0">
            <td colspan="8" class="text-center py-4">No se encontraron reservas.</td>
          </tr>
          <tr v-for="reserva in filteredReservas" :key="reserva.idReserva">
            <td class="text-start">
              <button @click="confirmDelete(reserva.idReserva)" type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                ELIMINAR
              </button>
            </td>
            <td>{{ reserva.idReserva }}</td>
            <td>{{ new Date(reserva.fecha).toLocaleDateString() }}</td> <td>
              <span class="text-heading font-semibold">{{ reserva.reservaDescripcion }}</span>
            </td>
            <td>{{ reserva.precioTotal.toFixed(2) }} €</td>
            <td>{{ reserva.usuarioId }}</td>
            <td>{{ reserva.usuarioNombre }}</td>
            <td>{{ reserva.usuarioEmail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer border-0 py-5">
      <span class="text-muted text-sm">Mostrando {{ filteredReservas.length }} reservas.</span>
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
          <p>¿Estás seguro de que quieres eliminar la reserva con ID: <strong>{{ reservaToDeleteId }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteReservaConfirmed">ELIMINAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import { useReservasStore, type Reserva } from '../../store/AdminStores/adminReservasStore'
import { Modal } from 'bootstrap'

// instancias de las stores
const reservasStore = useReservasStore()

// tipos reutilizables
type Nullable<T> = T | null

// estado reactivo para busqueda y reserva actual (currentReserva no se usa directamente para edición, solo si quisieras mostrar detalles en un modal)
const searchQuery: Ref<string> = ref('')
const currentReserva: Ref<Nullable<Reserva>> = ref(null) // Para ver detalles si se implementa un modal de vista
const reservaToDeleteId: Ref<Nullable<number>> = ref(null)

// instancias de modales
let deleteConfirmModalInstance: Nullable<Modal> = null

onMounted(async () => {
  try {
    // cargar todas las reservas
    await reservasStore.obtenerTodasLasReservas()
    // inicializar modal de confirmacion
    deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal')!)
  } catch (error: any) {
    console.error('Error al cargar datos iniciales de reservas:', error)
  }
})

// filtrar reservas según texto de búsqueda
const filteredReservas = computed((): Reserva[] => {
  if (!searchQuery.value) {
    return reservasStore.reservas
  }
  const query = searchQuery.value.toLowerCase()
  return reservasStore.reservas.filter(reserva =>
    reserva.reservaDescripcion.toLowerCase().includes(query) ||
    reserva.idReserva.toString().includes(query) ||
    reserva.usuarioNombre.toLowerCase().includes(query) ||
    reserva.usuarioEmail.toLowerCase().includes(query) ||
    new Date(reserva.fecha).toLocaleDateString().includes(query) // Permite buscar por fecha formateada
  )
})


// preparar id de reserva para eliminar
const confirmDelete = (id: number): void => {
  reservaToDeleteId.value = id
}

// cerrar modal de confirmacion de eliminacion
const closeDeleteConfirmModal = (): void => {
  deleteConfirmModalInstance?.hide()
}

// confirmar eliminacion de reserva
const deleteReservaConfirmed = async (): Promise<void> => {
  if (reservaToDeleteId.value != null) {
    try {
      await reservasStore.eliminarReserva(reservaToDeleteId.value)
      closeDeleteConfirmModal()
      reservaToDeleteId.value = null
      // recargar lista de reservas
      await reservasStore.obtenerTodasLasReservas()
    } catch (error: any) {
      console.error('Error al eliminar reserva:', error)
      alert(`Error al eliminar reserva: ${reservasStore.error || error.message}`)
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