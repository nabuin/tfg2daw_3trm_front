import { defineStore } from 'pinia';
import { ref, computed } from 'vue';


// interfaz para manejar la data de la api
interface ReservaInfo {
    idReserva: number;
    precioTotal: number;
    nombreSalaPrincipal: string;
    ciudadSedePrincipal: string;
    direccionSedePrincipal: string;
    rangoHorarioReserva: string;
    cantidadHorasReservadas: number;
}

export const useInfoPedidosStore = defineStore('infoPedidos', () => {
    const reservaActual = ref<ReservaInfo | null>(null); // info del objeto de la reserva que devolverá la API
    const loading = ref(false); // si carga o no la info
    const error = ref<string | null>(null); // guadar errores

    // funcion flecha para el fetch al endpoint para obtener los detalles  
    const fetchResumenReserva = async (idReserva: number) => { 
        const idReservaPrueba = 1; // como prueba se pone id estatico 11, luego se hará dinamico con la respuesta de la api al hacer la reserva

        if (!idReservaPrueba) { // luego se hará con un id real
            console.error("No se proporcionó ID de reserva para obtener el resumen.");
            error.value = "No se pudo cargar el resumen de la reserva: ID no disponible.";
            return;
        }

        // resetear todo
        loading.value = true;
        error.value = null;
        reservaActual.value = null;

        const token = localStorage.getItem("authToken");
        const url = `https://coworkingapi.jblas.me/api/Reservas/resumencompra/${idReservaPrueba}`; // id fijo para prueba

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) { // si no es status 200
                const errorText = await response.text();
                throw new Error(`Error HTTP: ${response.status} - ${errorText || response.statusText}`);
            }

            reservaActual.value = await response.json();
            console.log('Resumen de reserva recibido:', reservaActual.value);
        } catch (err: any) { // manejo excepciones
            console.error('Error al obtener el resumen de la reserva:', err);
            error.value = err.message || 'Ocurrió un error al cargar el resumen de tu reserva.';
            reservaActual.value = null; // Clear data on error
        } finally {
            loading.value = false;
        }
    };

    return {
        reservaActual, // devolver el objeto para poder manejarlo desde el componente
        loading,
        error,
        fetchResumenReserva, // funcion fetch
    };
});
