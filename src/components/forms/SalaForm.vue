<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="nombre" class="form-label">Nombre</label>
      <input type="text" class="form-control" id="nombre" v-model="formData.nombre" required>
    </div>
    <div class="mb-3">
      <label for="url_Imagen" class="form-label">URL Imagen</label>
      <input type="text" class="form-control" id="url_Imagen" v-model="formData.url_Imagen">
    </div>
    
    <div class="mb-3" v-if="formData.idSala !== 0">
      <label for="capacidad" class="form-label">Capacidad</label>
      <input type="number" class="form-control" id="capacidad" v-model.number="formData.capacidad" required min="1">
    </div>
    
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="bloqueado" v-model="formData.bloqueado">
      <label class="form-check-label" for="bloqueado">
        Bloqueada
      </label>
    </div>

    <div class="mb-3">
      <label for="idTipoSala" class="form-label">Tipo de Sala</label>
      <select id="idTipoSala" class="form-select" v-model.number="formData.idTipoSala" required>
        <option value="0" disabled>Selecciona un tipo de sala</option>
        <option v-for="tipo in tiposSalas" :key="tipo.idTipoSala" :value="tipo.idTipoSala">
          {{ tipo.nombre }}
        </option>
      </select>
    </div>

    <div class="mb-3" v-if="formData.idSala !== 0">
      <label for="idTipoPuestoTrabajo" class="form-label">Tipo de Puesto de Trabajo</label>
      <select id="idTipoPuestoTrabajo" class="form-select" 
              v-model.number="formData.idTipoPuestoTrabajo" 
              required 
              disabled> 
        <option value="0" disabled>Selecciona un tipo de puesto</option>
        <option v-for="tpt in tiposPuestoTrabajo" :key="tpt.idTipoPuestoTrabajo" :value="tpt.idTipoPuestoTrabajo">
          {{ tpt.nombre }}
        </option>
      </select>
      <small class="form-text text-muted">Este campo se selecciona automáticamente según el Tipo de Sala.</small>
    </div>

    <div class="mb-3">
      <label for="idSede" class="form-label">Sede</label>
      <select id="idSede" class="form-select" v-model.number="formData.idSede" required>
        <option value="0" disabled>Selecciona una sede</option>
        <option v-for="sede in sedes" :key="sede.idSede" :value="sede.idSede">
          {{ sede.nombre || (sede.ciudad ? sede.ciudad + ' - ' + sede.direccion : 'Sede sin nombre') }} 
        </option>
      </select>
    </div>

    <div class="modal-footer d-flex justify-content-end">
      <button type="button" class="btn btn-secondary me-2" @click="handleCancel">Cancelar</button>
      <button type="submit" class="btn btn-primary">Guardar Sala</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  sala: Object,
  tiposSalas: Array, // de salas store
  sedes: Array,     //de sedes store
  tiposPuestoTrabajo: Array, // de tipos de puesto de trabajo store
});

const emit = defineEmits(['submit-form', 'cancel']);

const formData = ref({
  idSala: 0,
  nombre: '',
  url_Imagen: '',
  capacidad: 0,
  idTipoSala: 0,
  idSede: 0,
  bloqueado: false,
  zonasTrabajo: [],
  idTipoPuestoTrabajo: 0,
});

// observa cuando cambia la sala que viene por props
watch(() => props.sala, (newSala) => {
  if (newSala && newSala.idSala !== 0) { // Check if it's an existing sala (idSala is not 0)
    // si hay una sala la copiamos al formulario
    formData.value = { ...newSala }

    // si la sala trae tipoSala con idTipoPuestoTrabajo lo usamos
    if (newSala.tipoSala && newSala.tipoSala.idTipoPuestoTrabajo) {
        formData.value.idTipoPuestoTrabajo = newSala.tipoSala.idTipoPuestoTrabajo
    } else {
        // si no trae lo dejamos en cero
        formData.value.idTipoPuestoTrabajo = 0
    }
  } else {
    // si no hay sala reiniciamos el formulario para agregar una nueva
    formData.value = {
      idSala: 0,
      nombre: '',
      url_Imagen: '',
      capacidad: 0,
      idTipoSala: 0,
      idSede: 0,
      bloqueado: false,
      zonasTrabajo: [],
      idTipoPuestoTrabajo: 0
    }
  }
}, { immediate: true })

// observa cuando cambia el tipo de sala para asignar tipo de puesto de trabajo
watch(() => formData.value.idTipoSala, (newIdTipoSala) => {
    if (newIdTipoSala === 1 || newIdTipoSala === 2 || newIdTipoSala === 3) {
        // si es tipo 1 2 o 3 asignamos tipo de puesto 1
        formData.value.idTipoPuestoTrabajo = 1
    } else if (newIdTipoSala === 4) {
        // si es tipo 4 asignamos tipo de puesto 2
        formData.value.idTipoPuestoTrabajo = 2
    } else {
        // si no coincide con ninguno dejamos en cero
        formData.value.idTipoPuestoTrabajo = 0
    }
}, { immediate: true })

// calcula el tipo de sala seleccionado
const selectedTipoSala = computed(() => {
  return props.tiposSalas.find(ts => ts.idTipoSala === formData.value.idTipoSala)
})

// funcion para enviar el formulario
const handleSubmit = () => {
  emit('submit-form', formData.value)
}

// funcion para cancelar
const handleCancel = () => {
  emit('cancel')
}

</script>

<style scoped>
.form-label {
  font-weight: bold;
}

.form-control, .form-select {
  border-radius: 0.375rem;
}

.text-danger {
  font-size: 0.875em;
}
</style>