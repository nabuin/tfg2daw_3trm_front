// src/store/asientosPreciosStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAsientosPreciosStore = defineStore('asientosPrecios', () => {
  // ref para almacenar el precio total calculado
  const precioTotal = ref(0)
  // estado de carga mientras se hace el fetch
  const loading = ref(false)
  // guarda un mensaje de error si algo falla
  const error = ref<string|null>(null)

  // funcion q calcula el precio segun la cantidad de asientos
  async function calcularPrecio(idsPuestos: number[]): Promise<number> {
    // inicia el estado de carga
    loading.value = true
    // limpia cualquier error previo
    error.value = null
    // reinicia el precioTotal antes de calcular
    precioTotal.value = 0

    // si no hay ids, no hay nada que calcular
    if (idsPuestos.length === 0) {
      console.error('No hay asientos seleccionados para precio')
      loading.value = false
      return 0
    }

    // cogemos el primer id para pedir el precio unitario
    const id = idsPuestos[0]
    const url = `https://localhost:7179/api/Salas/puesto/${id}/asiento-precio`
    console.log(`🔍 Fetch precio asiento ${id}: ${url}`)

    try {
      // hacemos la peticion al backend
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)

      // parseamos la respuesta como json
      const dato = await res.json()
      // obtenemos el precio unitario, pilla numero o objeto con precio
      const precioUnitario = typeof dato === 'number'
        ? dato
        : (dato.precio as number) ?? 0
      console.log(`Precio unitario asiento ${id}: ${precioUnitario}`)

      // multiplicamos por la cantidad de ids recibidos
      const total = precioUnitario * idsPuestos.length
      precioTotal.value = total
      console.log(`Precio total (${idsPuestos.length} asientos): ${total}`)
      return total

    } catch (e: any) {
      // capturamos errores y los guardamos
      error.value = e.message
      console.error('Error al obtener precio:', e.message)
      return 0
    } finally {
      // siempre desactivamos el loading
      loading.value = false
    }
  }

  // retornamos el estado y la funcion principal
  return { precioTotal, loading, error, calcularPrecio }
})

