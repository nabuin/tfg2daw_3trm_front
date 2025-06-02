import { defineStore } from 'pinia'

// elementos q espera la api
interface EmailFormularioContactoDTO {
    nombre: string
    apellidos: string
    correo: string
    consulta: string
}

// definimos el estado que tendra el store
interface FormularioHomeState {
    loading: boolean
    errorMessage: string | null
    successMessage: string | null
}

// url base
const API_BASE_URL = 'https://coworkingapi.jblas.me/api/Email'

// definimos el store usando pinia
export const useFormularioHomeStore = defineStore('formularioHome', {
    // estado inicial del store
    state: (): FormularioHomeState => ({
        loading: false,
        errorMessage: null,
        successMessage: null,
    }),

    // acciones que puede realizar el store
    actions: {
        // funcion para enviar los datos del formulario
        async submitFormulario(formData: EmailFormularioContactoDTO): Promise<boolean> {
            // indicar que se esta procesando el envio
            this.loading = true
            this.errorMessage = null
            this.successMessage = null

            try {
                // hacer una peticion post al backend con los datos
                const response = await fetch(`${API_BASE_URL}/contact-form`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })

                // si la respuesta no funciono, manejar el error
                if (!response.ok) {
                    const errorData = await response.json()

                    // errores de validacion
                    if (response.status === 400 && errorData.errors) {
                        let validationErrors = ''
                        for (const key in errorData.errors) {
                            if (Object.prototype.hasOwnProperty.call(errorData.errors, key)) {
                                validationErrors += `${errorData.errors[key].join(', ')}\n`
                            }
                        }
                        this.errorMessage = `por favor corrige los siguientes errores:\n${validationErrors}`
                    } else {
                        // otros errores del servidor
                        this.errorMessage = errorData.message || `error del servidor ${response.statusText}`
                    }

                    return false // retorno falso indica que fallo
                }

                // mensaje exito
                const result = await response.json()
                this.successMessage = result.message || 'mensaje enviado con exito'
                return true // se envio correctamente

            } catch (error: any) {
                // mensaje generico de conexion
                console.error('error al enviar el formulario', error)
                this.errorMessage = 'no se pudo conectar con el servidor por favor verifica tu conexion'
                return false
            } finally {
                // desactivar el estado de carga
                this.loading = false
            }
        },
    },
})