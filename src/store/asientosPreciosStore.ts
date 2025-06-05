import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAsientosPreciosStore = defineStore('asientosPrecios', () => {
  const precioTotal = ref(0)
  const loading    = ref(false)
  const error      = ref<string|null>(null)


  async function calcularPrecio(
    idsPuestos: number[],
    horas: number
  ): Promise<number> {
    loading.value = true
    error.value   = null
    precioTotal.value = 0

    if (idsPuestos.length === 0 || horas <= 0) {
      loading.value = false
      return 0
    }

    const id  = idsPuestos[0]
    const url = `https://coworkingapi.jblas.me/api/Salas/puesto/${id}/asiento-precio`

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)

      const dato = await res.json()
      const precioUnitario = typeof dato === 'number'
        ? dato
        : (dato.precio as number) ?? 0

      const total = precioUnitario * idsPuestos.length * horas
      precioTotal.value = total
      return total

    } catch (e: any) {
      error.value = e.message
      console.error(' error al obtener precio:', e.message)
      return 0

    } finally {
      loading.value = false
    }
  }

  return { precioTotal, loading, error, calcularPrecio }
})
