<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="pais" class="form-label">País <span class="text-danger">*</span></label>
      <input 
        type="text" 
        class="form-control" 
        id="pais" 
        v-model="formData.pais" 
        required
        :class="{ 'is-invalid': errors.pais }"
      >
      <div v-if="errors.pais" class="invalid-feedback">{{ errors.pais }}</div>
    </div>

    <div class="mb-3">
      <label for="ciudad" class="form-label">Ciudad <span class="text-danger">*</span></label>
      <input 
        type="text" 
        class="form-control" 
        id="ciudad" 
        v-model="formData.ciudad" 
        required
        :class="{ 'is-invalid': errors.ciudad }"
      >
      <div v-if="errors.ciudad" class="invalid-feedback">{{ errors.ciudad }}</div>
    </div>

    <div class="mb-3">
      <label for="direccion" class="form-label">Dirección <span class="text-danger">*</span></label>
      <input 
        type="text" 
        class="form-control" 
        id="direccion" 
        v-model="formData.direccion" 
        required
        :class="{ 'is-invalid': errors.direccion }"
      >
      <div v-if="errors.direccion" class="invalid-feedback">{{ errors.direccion }}</div>
    </div>

    <div class="mb-3">
      <label for="codigoPostal" class="form-label">Código Postal <span class="text-danger">*</span></label>
      <input 
        type="text" 
        class="form-control" 
        id="codigoPostal" 
        v-model="formData.codigoPostal" 
        required
        :class="{ 'is-invalid': errors.codigoPostal }"
      >
      <div v-if="errors.codigoPostal" class="invalid-feedback">{{ errors.codigoPostal }}</div>
    </div>

    <div class="mb-3">
      <label for="planta" class="form-label">Planta</label>
      <input 
        type="text" 
        class="form-control" 
        id="planta" 
        v-model="formData.planta"
        :class="{ 'is-invalid': errors.planta }"
      >
      <div v-if="errors.planta" class="invalid-feedback">{{ errors.planta }}</div>
    </div>

    <div class="mb-3">
      <label for="url_Imagen" class="form-label">URL Imagen</label>
      <input 
        type="url" 
        class="form-control" 
        id="url_Imagen" 
        v-model="formData.url_Imagen"
        placeholder="https://ejemplo.com/imagen.jpg"
        :class="{ 'is-invalid': errors.url_Imagen }"
      >
      <div v-if="errors.url_Imagen" class="invalid-feedback">{{ errors.url_Imagen }}</div>
      <div class="form-text">Ingresa una URL válida para la imagen de la sede</div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="latitud" class="form-label">Latitud</label>
          <input 
            type="text" 
            class="form-control" 
            id="latitud" 
            v-model="formData.latitud"
            placeholder="Ej: -12.046374"
            pattern="^-?\d+\.?\d*$"
            :class="{ 'is-invalid': errors.latitud }"
          >
          <div v-if="errors.latitud" class="invalid-feedback">{{ errors.latitud }}</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label for="longitud" class="form-label">Longitud</label>
          <input 
            type="text" 
            class="form-control" 
            id="longitud" 
            v-model="formData.longitud"
            placeholder="Ej: -77.042793"
            pattern="^-?\d+\.?\d*$"
            :class="{ 'is-invalid': errors.longitud }"
          >
          <div v-if="errors.longitud" class="invalid-feedback">{{ errors.longitud }}</div>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label for="observaciones" class="form-label">Observaciones</label>
      <textarea 
        class="form-control" 
        id="observaciones" 
        v-model="formData.observaciones"
        rows="3"
        placeholder="Información adicional sobre la sede..."
        :class="{ 'is-invalid': errors.observaciones }"
      ></textarea>
      <div v-if="errors.observaciones" class="invalid-feedback">{{ errors.observaciones }}</div>
    </div>

    <div class="d-flex justify-content-end mt-4">
      <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ sede?.idSede ? 'Guardar Cambios' : 'Añadir Sede' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  sede: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['submit-form', 'cancel']);

// Estado del formulario
const isSubmitting = ref(false);
const errors = ref({});

// Datos del formulario
const formData = ref({
  idSede: null,
  pais: '',
  ciudad: '',
  direccion: '',
  codigoPostal: '',
  planta: '',
  url_Imagen: '', 
  latitud: '',
  longitud: '',
  observaciones: ''
});

// Observar cambios en la prop 'sede'
watch(() => props.sede, (newSede) => {
  errors.value = {}; // Limpiar errores
  
  if (newSede) {
    // Rellenar formulario con datos existentes
    formData.value = {
      idSede: newSede.idSede,
      pais: newSede.pais || '',
      ciudad: newSede.ciudad || '',
      direccion: newSede.direccion || '',
      codigoPostal: newSede.codigoPostal || '',
      planta: newSede.planta || '',
      url_Imagen: newSede.urL_Imagen || newSede.url_Imagen || '',
      latitud: newSede.latitud || '',
      longitud: newSede.longitud || '',
      observaciones: newSede.observaciones || ''
    };
  } else {
    // Resetear formulario para nueva sede
    formData.value = {
      idSede: null,
      pais: '',
      ciudad: '',
      direccion: '',
      codigoPostal: '',
      planta: '',
      url_Imagen: '',
      latitud: '',
      longitud: '',
      observaciones: ''
    };
  }
}, { immediate: true });

// Validar formulario
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // Validaciones requeridas, trim borra espacios para evitar errores por espacios vacíos
  if (!formData.value.pais.trim()) {
    errors.value.pais = 'El país es requerido';
    isValid = false;
  }

  if (!formData.value.ciudad.trim()) {
    errors.value.ciudad = 'La ciudad es requerida';
    isValid = false;
  }

  if (!formData.value.direccion.trim()) {
    errors.value.direccion = 'La dirección es requerida';
    isValid = false;
  }

  if (!formData.value.codigoPostal.trim()) {
    errors.value.codigoPostal = 'El código postal es requerido';
    isValid = false;
  }

  // Validar URL si se proporciona
  if (formData.value.url_Imagen.trim()) {
    try {
      new URL(formData.value.url_Imagen);
    } catch {
      errors.value.url_Imagen = 'Debe ser una URL válida';
      isValid = false;
    }
  }

  // Validar coordenadas si se proporcionan
  if (formData.value.latitud.trim()) {
    const lat = parseFloat(formData.value.latitud);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.value.latitud = 'Debe ser un número entre -90 y 90';
      isValid = false;
    }
  }

  if (formData.value.longitud.trim()) {
    const lng = parseFloat(formData.value.longitud);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.value.longitud = 'Debe ser un número entre -180 y 180';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  
  try {
    // Preparar datos para envío
    const dataToSubmit = {
      ...formData.value,
      // Limpiar campos vacíos
      pais: formData.value.pais.trim(),
      ciudad: formData.value.ciudad.trim(),
      direccion: formData.value.direccion.trim(),
      codigoPostal: formData.value.codigoPostal.trim(),
      planta: formData.value.planta.trim(),
      url_Imagen: formData.value.url_Imagen.trim(),
      latitud: formData.value.latitud.trim(),
      longitud: formData.value.longitud.trim(),
      observaciones: formData.value.observaciones.trim()
    };

    emit('submit-form', dataToSubmit);
  } catch (error) {
    console.error('Error en el formulario:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.text-danger {
  color: #dc3545 !important;
}

.form-text {
  font-size: 0.875em;
  color: #6c757d;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}
</style>