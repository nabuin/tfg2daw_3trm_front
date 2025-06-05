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
      <input type="number" class="form-control" id="capacidad" v-model.number="formData.capacidad" disabled>
      <small class="form-text text-muted">La capacidad se establece automáticamente según el tipo de sala.</small>
    </div>
    
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" id="bloqueado" v-model="formData.bloqueado">
      <label class="form-check-label" for="bloqueado">
        Bloqueada
      </label>
    </div>

    <div class="mb-3">
      <label for="idTipoSala" class="form-label">Tipo de Sala</label>
      <select id="idTipoSala" class="form-select" v-model.number="formData.idTipoSala" required @change="handleTipoSalaChange">
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
  tiposSalas: Array,
  sedes: Array,
  tiposPuestoTrabajo: Array,
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

const isLoadingExistingSala = ref(false);

watch(() => props.sala, (newSala) => {
  isLoadingExistingSala.value = true;
  
  if (newSala && newSala.idSala !== 0) {
    formData.value = { ...newSala };

    if (newSala.tipoSala && newSala.tipoSala.idTipoPuestoTrabajo) {
      formData.value.idTipoPuestoTrabajo = newSala.tipoSala.idTipoPuestoTrabajo;
    } else {
      formData.value.idTipoPuestoTrabajo = 0;
    }
  } else {
    formData.value = {
      idSala: 0,
      nombre: '',
      url_Imagen: '',
      capacidad: 0,
      idTipoSala: 0,
      idSede: 0,
      bloqueado: false,
      zonasTrabajo: [],
      idTipoPuestoTrabajo: 0,
    };
  }
  
  // Pequeño delay para asegurar que el DOM se haya actualizado
  setTimeout(() => {
    isLoadingExistingSala.value = false;
  }, 50);
}, { immediate: true });

const handleTipoSalaChange = () => {
  // solo aplicar la lógica automática si no estamos cargando una sala existente
  // y si es una sala nueva (idSala === 0)
  if (!isLoadingExistingSala.value && formData.value.idSala === 0) {
    const newIdTipoSala = formData.value.idTipoSala;
    
    if (newIdTipoSala === 1) {
      formData.value.idTipoPuestoTrabajo = 1;
      formData.value.capacidad = 40;
    } else if (newIdTipoSala === 2) {
      formData.value.idTipoPuestoTrabajo = 1;
      formData.value.capacidad = 32;
    } else if (newIdTipoSala === 3) {
      formData.value.idTipoPuestoTrabajo = 1;
      formData.value.capacidad = 12;
    } else if (newIdTipoSala === 4) {
      formData.value.idTipoPuestoTrabajo = 2;
      formData.value.capacidad = 20;
    } else {
      formData.value.idTipoPuestoTrabajo = 0;
      formData.value.capacidad = 0;
    }
  }
};

const selectedTipoSala = computed(() => {
  return props.tiposSalas.find(ts => ts.idTipoSala === formData.value.idTipoSala);
});

const handleSubmit = () => {
  emit('submit-form', formData.value);
};

const handleCancel = () => {
  emit('cancel');
};
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