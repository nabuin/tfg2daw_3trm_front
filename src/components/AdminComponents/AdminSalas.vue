<template>
  <div class="card shadow border-0 mb-7">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Gestión de Salas</h5>
      <div class="header-controls">
        <div class="caracteristicas-buttons">
          <button @click="openGestionCaracteristicasSalaModal" class="btn btn-info btn-sm me-2" data-bs-toggle="modal" data-bs-target="#gestionCaracteristicasSalaModal">
            <i class="bi bi-gear me-2"></i>Gestionar Características de Sala
          </button>
          <button @click="openAddCaracteristicaModal" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#caracteristicaModal">
            <i class="bi bi-plus-circle me-2"></i>Añadir Característica
          </button>
          <button @click="openGenerarPuestosModal" class="btn btn-secondary btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#generarPuestosModal">
            <i class="bi bi-person-workspace me-2"></i>Añadir Puestos
          </button>
          <button @click="openGenerarDisponibilidadesModal" class="btn btn-primary btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#generarDisponibilidadesModal">
            <i class="bi bi-calendar-plus me-2"></i>Generar Disponibilidades
          </button>
        </div>
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

  <div class="modal fade" id="gestionCaracteristicasModal" tabindex="-1" aria-labelledby="gestionCaracteristicasModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="gestionCaracteristicasModalLabel">Gestión de Características de Salas</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio Añadido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="salasStore.cargando">
                  <td colspan="5" class="text-center py-3">Cargando características...</td>
                </tr>
                <tr v-else-if="salasStore.caracteristicasSalas.length === 0">
                  <td colspan="5" class="text-center py-3">No hay características disponibles.</td>
                </tr>
                <tr v-for="caracteristica in salasStore.caracteristicasSalas" :key="caracteristica.idCaracteristica">
                  <td>
                    <button @click="editCaracteristica(caracteristica)" class="btn btn-sm btn-warning me-1" data-bs-toggle="modal" data-bs-target="#caracteristicaModal">
                      <i class="bi bi-pencil me-1"></i>EDITAR
                    </button>
                    <button @click="confirmDeleteCaracteristica(caracteristica.idCaracteristica)" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteCaracteristicaModal">
                      <i class="bi bi-trash me-1"></i>ELIMINAR
                    </button>
                  </td>
                  <td>{{ caracteristica.idCaracteristica }}</td>
                  <td>{{ caracteristica.nombre }}</td>
                  <td>{{ caracteristica.descripcion }}</td>
                  <td>€{{ caracteristica.precioAniadido.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="gestionCaracteristicasSalaModal" tabindex="-1" aria-labelledby="gestionCaracteristicasSalaModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="gestionCaracteristicasSalaModalLabel">Asignar/Desasignar Características a Salas</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="selectSala" class="form-label">Seleccionar Sala:</label>
            <select class="form-select" id="selectSala" v-model="selectedSalaId" @change="fetchCaracteristicasForSelectedSala">
              <option :value="null" disabled>Selecciona una sala</option>
              <option v-for="sala in salasStore.salasConCaracteristicas" :key="sala.idSala" :value="sala.idSala">
                {{ sala.nombre }} (ID: {{ sala.idSala }})
              </option>
            </select>
          </div>

          <div v-if="selectedSalaId">
            <h6>Características de la sala seleccionada:</h6>
            <div v-if="selectedSalaCharacteristics.length > 0" class="mb-3">
              <span v-for="caract in selectedSalaCharacteristics" :key="caract.idCaracteristica" class="badge bg-primary me-2 mb-2">
                {{ caract.nombre }}
                <button @click="removeCaracteristicaFromSelectedSala(caract.idCaracteristica)" class="btn-close btn-close-white ms-1" aria-label="Remove"></button>
              </span>
            </div>
            <p v-else class="text-muted">Esta sala no tiene características asignadas.</p>

            <h6>Añadir nuevas características:</h6>
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <select class="form-select" v-model="newCaracteristicaIdToAdd">
                  <option :value="null" disabled>Selecciona una característica</option>
                  <option v-for="caracteristica in availableCaracteristicas" :key="caracteristica.idCaracteristica" :value="caracteristica.idCaracteristica">
                    {{ caracteristica.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <button @click="addCaracteristicaToSelectedSala" class="btn btn-primary w-100" :disabled="!newCaracteristicaIdToAdd">Añadir Característica</button>
              </div>
            </div>
          </div>
          <div v-else class="alert alert-info mt-3">
            Por favor, selecciona una sala para gestionar sus características.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="caracteristicaModal" tabindex="-1" aria-labelledby="caracteristicaModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="caracteristicaModalLabel">{{ currentCaracteristica?.idCaracteristica ? 'Editar Característica' : 'Añadir Nueva Característica' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCaracteristicaSubmit">
            <div class="mb-3">
              <label for="nombreCaracteristica" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="nombreCaracteristica" v-model="caracteristicaForm.nombre" required>
            </div>
            <div class="mb-3">
              <label for="descripcionCaracteristica" class="form-label">Descripción</label>
              <textarea class="form-control" id="descripcionCaracteristica" rows="3" v-model="caracteristicaForm.descripcion" required></textarea>
            </div>
            <div class="mb-3">
              <label for="precioCaracteristica" class="form-label">Precio Añadido</label>
              <input type="number" step="0.01" min="0" class="form-control" id="precioCaracteristica" v-model="caracteristicaForm.precioAniadido" required>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="closeCaracteristicaModal">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ currentCaracteristica?.idCaracteristica ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="deleteCaracteristicaModal" tabindex="-1" aria-labelledby="deleteCaracteristicaModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteCaracteristicaModalLabel">Confirmar Eliminación de Característica</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres eliminar la característica con ID: <strong>{{ caracteristicaToDeleteId }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteCaracteristicaConfirmed">ELIMINAR</button>
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

  <div class="modal fade" id="generarPuestosModal" tabindex="-1" aria-labelledby="generarPuestosModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="generarPuestosModalLabel">Generar Puestos de Trabajo</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Esto revisará cada sala y su capacidad. Si faltan asientos para cubrir su capacidad, se añadirán automáticamente.</p>
          <p class="text-danger">Esta acción puede tardar un momento y creará nuevos registros de puestos de trabajo.</p>
          <div v-if="generarPuestosMessage" :class="['alert mt-3', generarPuestosMessageType === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
            {{ generarPuestosMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="clearGenerarPuestosMessage">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="generarPuestosTrabajoConfirmado">Confirmar y Generar</button>
        </div>
      </div>
    </div>
  </div>

<div class="modal fade" id="generarDisponibilidadesModal" tabindex="-1" aria-labelledby="generarDisponibilidadesModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="generarDisponibilidadesModalLabel">Generar Disponibilidades</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Esta acción generará las disponibilidades diarias para todas las salas del año especificado.</p>
        <p class="text-danger">Esto puede tardar varios minutos y creará una gran cantidad de registros.</p>
        <div class="mb-3">
          <label for="anioDisponibilidad" class="form-label">Año para Generar Disponibilidades:</label>
          <input type="number" class="form-control" id="anioDisponibilidad" v-model.number="anioParaDisponibilidad" :min="currentYear" :max="currentYear + 5" required>
        </div>
        <div v-if="isGeneratingDisponibilidades" class="alert alert-info mt-3" role="alert">
          Generando disponibilidades, por favor espera... Esto puede tardar varios minutos.
          <div class="spinner-border spinner-border-sm ms-2" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div v-else-if="generarDisponibilidadesMessage" :class="['alert mt-3', generarDisponibilidadesMessageType === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
          {{ generarDisponibilidadesMessage }}
        </div>
        </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="clearGenerarDisponibilidadesMessage">Cancelar</button>
        <button type="button" class="btn btn-primary" @click="generarDisponibilidadesConfirmado" :disabled="!anioParaDisponibilidad || anioParaDisponibilidad < currentYear || isGeneratingDisponibilidades">Confirmar y Generar</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import { useSalasStore, type Sala, type TipoSala, type CaracteristicaSala, type SalasConCaracteristicasDTO } from '../../store/AdminStores/adminSalasStore'
import { useSedesStore } from '../../store/AdminStores/adminSedesStore'
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

// estado reactivo para características
const currentCaracteristica: Ref<Nullable<CaracteristicaSala>> = ref(null)
const caracteristicaToDeleteId: Ref<Nullable<number>> = ref(null)
const caracteristicaForm = ref({
  nombre: '',
  descripcion: '',
  precioAniadido: 0
})

//estados reactivos para la gestión de características por sala
const selectedSalaId: Ref<Nullable<number>> = ref(null);
const selectedSalaCharacteristics: Ref<CaracteristicaSala[]> = ref([]);
const newCaracteristicaIdToAdd: Ref<Nullable<number>> = ref(null);

// Estado reactivo para el mensaje de generación de puestos
const generarPuestosMessage: Ref<string | null> = ref(null);
const generarPuestosMessageType: Ref<'success' | 'danger' | null> = ref(null);

const anioParaDisponibilidad: Ref<number | null> = ref(null);
const generarDisponibilidadesMessage: Ref<string | null> = ref(null);
const generarDisponibilidadesMessageType: Ref<'success' | 'danger' | null> = ref(null);
const isGeneratingDisponibilidades: Ref<boolean> = ref(false);

const currentYear = new Date().getFullYear();


// instancias de modales
let salaModalInstance: Nullable<Modal> = null
let deleteConfirmModalInstance: Nullable<Modal> = null
let gestionCaracteristicasModalInstance: Nullable<Modal> = null
let caracteristicaModalInstance: Nullable<Modal> = null
let deleteCaracteristicaModalInstance: Nullable<Modal> = null
let gestionCaracteristicasSalaModalInstance: Nullable<Modal> = null
let generarPuestosModalInstance: Nullable<Modal> = null
// NUEVA INSTANCIA DE MODAL
let generarDisponibilidadesModalInstance: Nullable<Modal> = null


onMounted(async () => {
  await salasStore.obtenerTodasLasSalas()
  await salasStore.obtenerTodosLosTiposSalas()
  await salasStore.obtenerTodosTiposPuestoTrabajo()
  await salasStore.obtenerTodasLasCaracteristicasSalas()
  await salasStore.obtenerTodasLasSalasConCaracteristicas() // Cargar salas con características
  await sedesStore.obtenerTodasLasSedes()

  // Inicializar instancias de modales después de que el DOM esté montado
  salaModalInstance = new Modal(document.getElementById('salaModal')!)
  deleteConfirmModalInstance = new Modal(document.getElementById('deleteConfirmModal')!)
  gestionCaracteristicasModalInstance = new Modal(document.getElementById('gestionCaracteristicasModal')!)
  caracteristicaModalInstance = new Modal(document.getElementById('caracteristicaModal')!)
  deleteCaracteristicaModalInstance = new Modal(document.getElementById('deleteCaracteristicaModal')!)
  gestionCaracteristicasSalaModalInstance = new Modal(document.getElementById('gestionCaracteristicasSalaModal')!)
  generarPuestosModalInstance = new Modal(document.getElementById('generarPuestosModal')!)
  generarDisponibilidadesModalInstance = new Modal(document.getElementById('generarDisponibilidadesModal')!)
})

// filtro salas
const filteredSalas = computed(() => {
  if (!salasStore.salas) {
    return []
  }
  return salasStore.salas.filter(sala =>
    sala.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    sala.idSala.toString().includes(searchQuery.value) ||
    (salasStore.obtenerTipoSalaPorId(sala.idTipoSala)?.nombre || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    sala.idSede.toString().includes(searchQuery.value)
  )
})

// Propiedad computada para características disponibles para añadir
const availableCaracteristicas = computed(() => {
    // Filtra las características que NO están ya en la sala seleccionada
    if (!selectedSalaId.value) return [];
    const salaActual = salasStore.obtenerSalaConCaracteristicasPorId(selectedSalaId.value);
    const caracteristicasActualesIds = new Set(selectedSalaCharacteristics.value.map(c => c.idCaracteristica));

    return salasStore.caracteristicasSalas.filter(caracteristica =>
      !caracteristicasActualesIds.has(caracteristica.idCaracteristica)
    );
});

// Métodos para la gestión de salas
const openAddSalaModal = () => {
  currentSala.value = null
  salaModalInstance?.show()
}

const editSala = (sala: Sala) => {
  currentSala.value = { ...sala }
  salaModalInstance?.show()
}

const handleSalaSubmit = async (salaData: Partial<Sala>) => {
  try {
    if (currentSala.value?.idSala) {
      await salasStore.actualizarSala(currentSala.value.idSala, salaData)
    } else {
      await salasStore.agregarSala(salaData)
    }
    closeSalaModal()
    await salasStore.obtenerTodasLasSalas() // Refrescar la lista de salas
    await salasStore.obtenerTodasLasSalasConCaracteristicas(); // Actualizar el estado de salas con características
  } catch (error) {
    console.error('Error al guardar la sala:', error)
  }
}

const confirmDelete = (id: number) => {
  salaToDeleteId.value = id
  deleteConfirmModalInstance?.show()
}

const deleteSalaConfirmed = async () => {
  if (salaToDeleteId.value !== null) {
    try {
      await salasStore.eliminarSala(salaToDeleteId.value)
      deleteConfirmModalInstance?.hide()
      salaToDeleteId.value = null
      await salasStore.obtenerTodasLasSalas() // Refrescar la lista de salas
      await salasStore.obtenerTodasLasSalasConCaracteristicas(); // Actualizar el estado de salas con características
    } catch (error) {
      console.error('Error al eliminar la sala:', error)
    }
  }
}

const closeSalaModal = () => {
  salaModalInstance?.hide()
  currentSala.value = null
}

// Métodos para la gestión de características (CRUD de CaracteristicasSala)
const openGestionCaracteristicasModal = () => {
  gestionCaracteristicasModalInstance?.show()
}

const openAddCaracteristicaModal = () => {
  currentCaracteristica.value = null
  caracteristicaForm.value = { nombre: '', descripcion: '', precioAniadido: 0 }
  caracteristicaModalInstance?.show()
}

const editCaracteristica = (caracteristica: CaracteristicaSala) => {
  currentCaracteristica.value = { ...caracteristica }
  caracteristicaForm.value = { ...caracteristica }
  caracteristicaModalInstance?.show()
}

const handleCaracteristicaSubmit = async () => {
  try {
    if (currentCaracteristica.value?.idCaracteristica) {
      await salasStore.actualizarCaracteristica(currentCaracteristica.value.idCaracteristica, caracteristicaForm.value)
    } else {
      await salasStore.agregarCaracteristica(caracteristicaForm.value)
    }
    closeCaracteristicaModal()
    await salasStore.obtenerTodasLasCaracteristicasSalas() // Refrescar la lista
    await salasStore.obtenerTodasLasSalasConCaracteristicas(); // Actualizar el estado de salas con características
  } catch (error) {
    console.error('Error al guardar la característica:', error)
  }
}

const confirmDeleteCaracteristica = (id: number) => {
  caracteristicaToDeleteId.value = id
  deleteCaracteristicaModalInstance?.show()
}

const deleteCaracteristicaConfirmed = async () => {
  if (caracteristicaToDeleteId.value !== null) {
    try {
      await salasStore.eliminarCaracteristica(caracteristicaToDeleteId.value)
      deleteCaracteristicaModalInstance?.hide()
      caracteristicaToDeleteId.value = null
      await salasStore.obtenerTodasLasCaracteristicasSalas() // Refrescar la lista
      await salasStore.obtenerTodasLasSalasConCaracteristicas(); // Actualizar el estado de salas con características
    } catch (error) {
      console.error('Error al eliminar la característica:', error)
    }
  }
}

const closeCaracteristicaModal = () => {
  caracteristicaModalInstance?.hide()
  currentCaracteristica.value = null
  caracteristicaForm.value = { nombre: '', descripcion: '', precioAniadido: 0 }
}

//  gestión de características POR SALA
const openGestionCaracteristicasSalaModal = async () => {
  // Asegurarse de que las salas con características estén cargadas al abrir
  await salasStore.obtenerTodasLasSalasConCaracteristicas();
  selectedSalaId.value = null; // Resetear la selección de sala
  selectedSalaCharacteristics.value = []; // Resetear características mostradas
  newCaracteristicaIdToAdd.value = null; // Resetear la característica a añadir
  gestionCaracteristicasSalaModalInstance?.show();
};

const fetchCaracteristicasForSelectedSala = async () => {
  if (selectedSalaId.value) {
    try {
      const salaConCaract = salasStore.obtenerSalaConCaracteristicasPorId(selectedSalaId.value);
      selectedSalaCharacteristics.value = salaConCaract ? salaConCaract.caracteristicas : [];
    } catch (error) {
      console.error(`Error al obtener características para la sala ${selectedSalaId.value}:`, error);
      selectedSalaCharacteristics.value = [];
    }
  }
};

const addCaracteristicaToSelectedSala = async () => {
  if (selectedSalaId.value !== null && newCaracteristicaIdToAdd.value !== null) {
    try {
      await salasStore.añadirCaracteristicaASala(selectedSalaId.value, newCaracteristicaIdToAdd.value);
      await fetchCaracteristicasForSelectedSala(); // Refrescar la lista de características de la sala
      newCaracteristicaIdToAdd.value = null; // Limpiar la selección
    } catch (error) {
      console.error('Error al añadir característica a la sala:', error);
      // alert(salasStore.error || 'Error desconocido al añadir característica.'); // Replaced by in-modal message
    }
  }
};

const removeCaracteristicaFromSelectedSala = async (idCaracteristica: number) => {
  if (selectedSalaId.value !== null) {
    try {
      await salasStore.eliminarCaracteristicaDeSala(selectedSalaId.value, idCaracteristica);
      await fetchCaracteristicasForSelectedSala(); // Refrescar la lista de características de la sala
    } catch (error) {
      console.error('Error al eliminar característica de la sala:', error);
    }
  }
};

// Nuevos métodos para generar puestos de trabajo
const openGenerarPuestosModal = () => {
  generarPuestosMessage.value = null; // Clear previous message
  generarPuestosMessageType.value = null; // Clear previous message type
  generarPuestosModalInstance?.show();
};

const generarPuestosTrabajoConfirmado = async () => {
  try {
    const result = await salasStore.generarAsientosDeSalas();
    // si la api da respuesta, es decir, todo salió bien
    generarPuestosMessage.value = result || 'Asientos de trabajo añadidos para las salas que lo necesitaban';
    generarPuestosMessageType.value = 'success';
  } catch (error: any) {
    console.error('Error al generar puestos de trabajo:', error);
    generarPuestosMessage.value = error.message || 'Error desconocido al generar puestos de trabajo.';
    generarPuestosMessageType.value = 'danger';
  }
};

// borrar el mensaje cuando se cierre el popup
const clearGenerarPuestosMessage = () => {
  generarPuestosMessage.value = null;
  generarPuestosMessageType.value = null;
  generarPuestosModalInstance?.hide();
};

const openGenerarDisponibilidadesModal = () => {
  anioParaDisponibilidad.value = currentYear; // Establecer el año actual por defecto
  generarDisponibilidadesMessage.value = null; // Limpiar mensajes anteriores
  generarDisponibilidadesMessageType.value = null; // Limpiar tipos de mensaje anteriores
  isGeneratingDisponibilidades.value = false; // Asegurarse de que el loading esté apagado al abrir
  generarDisponibilidadesModalInstance?.show();
};

const generarDisponibilidadesConfirmado = async () => {
  if (anioParaDisponibilidad.value === null) {
    generarDisponibilidadesMessage.value = 'Por favor, introduce un año válido.';
    generarDisponibilidadesMessageType.value = 'danger';
    return;
  }

  isGeneratingDisponibilidades.value = true; // Activar el loading
  generarDisponibilidadesMessage.value = null; // Limpiar mensajes anteriores
  generarDisponibilidadesMessageType.value = null; // Limpiar tipo de mensaje anterior

  try {
    const result = await salasStore.generarDisponibilidadesPorAnio(anioParaDisponibilidad.value);
    generarDisponibilidadesMessage.value = result;
    generarDisponibilidadesMessageType.value = 'success';
  } catch (error: any) {
    console.error('Error al generar disponibilidades:', error);
    generarDisponibilidadesMessage.value = error.message || 'Error desconocido al generar disponibilidades.';
    generarDisponibilidadesMessageType.value = 'danger';
  } finally {
    isGeneratingDisponibilidades.value = false; // Desactivar el loading al finalizar
  }
};

const clearGenerarDisponibilidadesMessage = () => {
  generarDisponibilidadesMessage.value = null;
  generarDisponibilidadesMessageType.value = null;
  isGeneratingDisponibilidades.value = false; // Asegurarse de que el loading esté apagado al cerrar
  generarDisponibilidadesModalInstance?.hide();
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

    .caracteristicas-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      .caracteristicas-buttons { /* Ajuste para desktop */
        flex-direction: row;
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

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5em 0.75em;
  font-size: 0.875em;
}

.badge .btn-close-white {
  font-size: 0.6em;
  margin-left: 0.5em;
  opacity: 0.8;
}

.badge .btn-close-white:hover {
  opacity: 1;
}
</style>