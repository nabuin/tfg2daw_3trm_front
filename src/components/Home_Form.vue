<script setup lang="ts">
import { ref } from 'vue';
import { useFormularioHomeStore } from '../store/formularioHomeStore';

// iniciar el store
const formStore = useFormularioHomeStore();

// estados campo formulario
const formData = ref({
    nombre: '',
    apellidos: '',
    correo: '',
    consulta: ''
});

// funcion envio formulario
const enviarFormulario = async () => {
    // Llama a la acción del store para enviar el formulario
    const enviado = await formStore.submitFormulario(formData.value);

    if (enviado) {
        // si se envia, se reinicia todo, por si se envia otro asegurar que no queden datos del anterior
        formData.value = {
            nombre: '',
            apellidos: '',
            correo: '',
            consulta: ''
        };
    }
};
</script>


<template>
    <div id="form" class="form form--container">
        <h2 class="form__title">Formulario de Contacto</h2>

        <div class="form__info">
            <div class="form__ubicacion form__info-item">
                C/ Rodrigo Rebolledo 67
            </div>
            <div class="form__email form__info-item">
                Cooworking Las Fuentes
            </div>
        </div>

        <form class="form__formulario" @submit.prevent="enviarFormulario">
            <div class="form__fila form__row">
                <div class="form__grupo form__group">
                    <label class="form__label form__group-label" for="nombre">Nombre*</label>
                    <input type="text" id="nombre" class="form__input form__group-input" v-model="formData.nombre" required />
                </div>
                <div class="form__grupo form__group">
                    <label class="form__label form__group-label" for="apellidos">Apellidos*</label>
                    <input type="text" id="apellidos" class="form__input form__group-input" v-model="formData.apellidos" required />
                </div>
                <div class="form__grupo form__group">
                    <label class="form__label form__group-label" for="correo">Correo*</label>
                    <input type="email" id="correo" class="form__input form__group-input" v-model="formData.correo" required />
                </div>
            </div>

            <div class="form__grupo form__grupo--textarea form__group form__group--textarea">
                <label class="form__label form__group-label" for="consulta">Escriba su Consulta*</label>
                <textarea id="consulta" class="form__textarea form__group-textarea" v-model="formData.consulta" required></textarea>
            </div>
            
            <div class="form__boton form__actions">
                <button type="submit" class="form__enviar form__submit" :disabled="formStore.loading">
                    {{ formStore.loading ? 'Enviando...' : 'Enviar' }}
                </button>
            </div>
        </form>

        <div v-if="formStore.successMessage" class="message message--success">
            <p>{{ formStore.successMessage }}</p>
        </div>
        <div v-if="formStore.errorMessage" class="message message--error">
            <p>{{ formStore.errorMessage }}</p>
        </div>
    </div>
</template>


<style scoped lang="scss">
.form {
    &--container {
        background-color: #000;
        color: #fff;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__title {
        text-align: center;
        font-size: 40px;
        margin-bottom: 2rem;
        font-weight: 700;
    }

    &__info {
        display: flex;
        justify-content: space-around;
        margin-bottom: 2rem;
        gap: 11rem;

        @media(max-width: 800px) {
            gap: 10% !important;
        }

        &-item {
            display: flex;
            height: 100%;
            justify-content: flex-start;
            align-items: center;
            gap: 8px;
            margin-top: 0.5rem;
            font-size: 1.2rem;
            flex-direction: column;
            text-align: center;
        }
    }

    &__ubicacion::before,
    &__email::before {
        content: "";
        display: inline-block;
        width: 35px;
        height: 35px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    &__ubicacion::before {
        background-image: url('../imgs/icons/ubi.svg');
    }

    &__email::before {
        background-image: url('../imgs/icons/email.svg');
    }

    &__formulario {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 1100px;
    }

    &__fila,
    &__row {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    &__grupo,
    &__group {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 200px;

        &--textarea {
            width: 100%;
        }

        &-label {
            margin-bottom: 0.3rem;
            font-size: 22px;
            color: white;
        }

        &-input,
        &-textarea {
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid white;
            background-color: white;
        }

        &-textarea {
            height: 200px;
            resize: vertical;
        }
    }

    &__boton,
    &__actions {
        margin-top: 1rem;
        text-align: left;

        button {
            background-color: white;
        }
    }

    &__enviar,
    &__submit {
        background: lightgray;
        color: black;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            background: gray;
        }
    }
}

.message--success {
    color: #0f0;
}

.message--error {
    color: #f00;
}

</style>
