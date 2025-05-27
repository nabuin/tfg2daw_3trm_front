<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="nombre" class="form-label">Nombre</label>
      <input type="text" class="form-control" id="nombre" v-model="formData.nombre" required>
    </div>
    <div class="mb-3">
      <label for="apellidos" class="form-label">Apellidos</label>
      <input type="text" class="form-control" id="apellidos" v-model="formData.apellidos" required>
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" v-model="formData.email" required>
    </div>
    <div class="mb-3">
      <label for="contrasenia" class="form-label">Contraseña</label>
      <input type="password" class="form-control" id="contrasenia" v-model="formData.contrasenia" :required="!formData.idUsuario">
      <small class="form-text text-muted" v-if="formData.idUsuario">Deja en blanco para no cambiar la contraseña.</small>
    </div>
    <div class="d-flex justify-content-end mt-4">
      <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary">{{ usuario?.idUsuario ? 'Guardar Cambios' : 'Añadir Usuario' }}</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAdminStore } from '@/store/AdminStores/adminStore';

const props = defineProps({
  usuario: {
    type: Object,
    default: null // Será rellenado al editar
  }
});

const emit = defineEmits(['submit-form', 'cancel']);
const adminStore = useAdminStore();

// Inicializar formData valores vacios o la data del usuario
const formData = ref({
  idUsuario: null,
  nombre: '',
  apellidos: '',
  email: '',
  contrasenia: '', // la contraseña solo se envía si se cambia o es un nuevo usuario
});

// Cargar roles cuando el componente se monta
onMounted(() => {
  // solo cargar roles si no están ya en el store para evitar llamadas duplicadas
  if (adminStore.roles.length === 0) {
    adminStore.obtenerTodosLosRoles();
  }
});

// Observar cambios en la prop 'usuario' para rellenar el formulario para edición, con la info q ya estaba
watch(() => props.usuario, (newUsuario) => {
  if (newUsuario) {
    // Rellenar formulario con datos de usuario existente
    formData.value = { ...newUsuario, contrasenia: '' }; // la contraseña tampoco la saca por el dto
  } else {
    // Resetear formulario para un nuevo usuario
    formData.value = {
      idUsuario: null,
      nombre: '',
      apellidos: '',
      email: '',
      contrasenia: '',
      idRol: 2, // Por defecto, rol de Cliente
    };
  }
}, { immediate: true }); // Ejecutar inmediatamente al montar el componente para inicializar

const handleSubmit = () => {
  // Emitir el formulario con los datos
  const dataToSubmit = { ...formData.value };
  if (!dataToSubmit.contrasenia) {
    delete dataToSubmit.contrasenia; // No enviar la contraseña si no se ha puesto
  }
  emit('submit-form', dataToSubmit);
};
</script>
