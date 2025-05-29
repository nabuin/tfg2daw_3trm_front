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
      <input type="email" class="form-control-plaintext" id="email" :value="formData.email" readonly>
    </div>
    <div class="mb-3">
      <label for="rol" class="form-label">Rol</label>
      <select class="form-select" id="rol" v-model="formData.idRol" required>
        <option :value="1">Administrador</option>
        <option :value="2">Cliente</option>
      </select>
    </div>
    
    <div class="mb-3" v-if="!formData.idUsuario">
      <label for="contrasenia" class="form-label">Contraseña</label>
      <input type="password" class="form-control" id="contrasenia" v-model="formData.contrasenia" required>
      <small class="form-text text-muted">La contraseña es obligatoria para nuevos usuarios.</small>
    </div>
    
    <div class="d-flex justify-content-end mt-4">
      <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary">{{ usuario?.idUsuario ? 'Guardar Cambios' : 'Añadir Usuario' }}</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

// define las propiedades que recibe el componente
const props = defineProps({
  usuario: {
    type: Object,
    default: null // se llena si se esta editando un usuario existente
  }
})

// define los eventos que el componente puede emitir
const emit = defineEmits(['submit-form', 'cancel'])

// datos del formulario inicializados vacios o con datos del usuario si se edita
const formData = ref({
  idUsuario: null,
  nombre: '',
  apellidos: '',
  email: '',
  contrasenia: '', // la contraseña solo se envia si se cambia o si es un nuevo usuario
  idRol: 2 // por defecto se asigna el rol cliente que es el 2
})

// observa cambios en la propiedad usuario para llenar el formulario si se edita
watch(() => props.usuario, (newUsuario) => {
  if (newUsuario) {
    // llena el formulario con los datos existentes del usuario
    formData.value = { 
      ...newUsuario, 
      contrasenia: '', // la contraseña no se carga por seguridad
      idRol: newUsuario.idRol || 2 // usa el rol del usuario o asigna cliente por defecto
    } 
  } else {
    // si no hay usuario se reinicia el formulario para uno nuevo
    formData.value = {
      idUsuario: null,
      nombre: '',
      apellidos: '',
      email: '',
      contrasenia: '',
      idRol: 2 // asigna cliente por defecto
    }
  }
}, { immediate: true }) // se ejecuta al iniciar el componente para cargar los datos

// funcion que se ejecuta al enviar el formulario
const handleSubmit = () => {
  // se hace una copia de los datos del formulario
  const dataToSubmit = { ...formData.value }

  // si se esta actualizando un usuario y no se ingreso contraseña se elimina del envio
  if (dataToSubmit.idUsuario && !dataToSubmit.contrasenia.trim()) { 
    delete dataToSubmit.contrasenia 
  } else if (!dataToSubmit.idUsuario && !dataToSubmit.contrasenia.trim()) {
    // si es un nuevo usuario y la contraseña esta vacia se muestra un aviso
    alert('la contraseña es obligatoria para añadir un nuevo usuario')
    return
  }

  // emite los datos del formulario para que el padre los reciba
  emit('submit-form', dataToSubmit)
}
</script>
