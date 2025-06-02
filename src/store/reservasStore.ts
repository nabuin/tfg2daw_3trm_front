import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useFiltrosStore } from './filtrosStore';
import { useUserStore } from './UserStore';

// Interfaz para el puesto seleccionado
interface SelectedPuesto {
    idPuestoTrabajo: number;
    horaInicioPrimerTramo?: string | null; // string o nulo
}

export const useReservasStore = defineStore('reservas', () => {
    // selectedPuestos almacena los puestos que el usuario ha clicado para reservar
    const selectedPuestos = ref<SelectedPuesto[]>([]);
    const isReserving = ref(false);
    const reservationError = ref<string | null>(null);
    const reservationSuccess = ref<string | null>(null);

    const filtrosStore = useFiltrosStore();
    const userStore = useUserStore();

    // almacena los detalles completos de los puestos (incluyendo sus tramos) para crear reservas.
    const currentPuestoDisponibilidades = ref<any[]>([]);

    // Comprobar si un puesto está seleccionado
    const isPuestoSelected = computed(() => (puestoId: number) => {
        return selectedPuestos.value.some(puesto => puesto.idPuestoTrabajo === puestoId);
    });

    // Función para seleccionar/deseleccionar un puesto completo
    function togglePuestoSelection(puesto: any) {
        const index = selectedPuestos.value.findIndex(
            s => s.idPuestoTrabajo === puesto.idPuestoTrabajo
        );

        if (index === -1) {
            // Si el puesto no está seleccionado, añadirlo
            if (puesto.disponibilidadesEnRango && puesto.disponibilidadesEnRango.length > 0) {
                // Se busca el primer tramo que tenga una hora de inicio definida
                const primerTramoValido = puesto.disponibilidadesEnRango.find(
                    (slot: any) => slot.horaInicio 
                );

                selectedPuestos.value.push({
                    idPuestoTrabajo: puesto.idPuestoTrabajo,
                    // Guarda la horaInicio del primer tramo válido, o null si no se encuentra
                    horaInicioPrimerTramo: primerTramoValido ? primerTramoValido.horaInicio : null,
                });
                reservationError.value = null; // Limpiar errores si la selección es exitosa
                reservationSuccess.value = null; // Limpiar mensajes de éxito
            } else {
                reservationError.value = "Este puesto no tiene tramos horarios disponibles para la fecha seleccionada.";
            }
        } else {
            // Si el puesto ya está seleccionado, lo deselecciona
            selectedPuestos.value.splice(index, 1);
            reservationError.value = null; // Limpiar errores
            reservationSuccess.value = null; // Limpiar mensajes de éxito
        }
    }

    // Pone todo en null, los puestos elegidos, los errores y el mensaje de exito
    function resetSelection() {
        selectedPuestos.value = [];
        reservationError.value = null;
        reservationSuccess.value = null;
        isReserving.value = false;
    }

    // almacena los puestos disponibles actuales para que el store de reservas pueda usarlos.
    function setPuestoDisponibilidades(puestos: any[]) {
        currentPuestoDisponibilidades.value = puestos;
    }

    async function createReservation(description: string = "Reserva") {
        if (selectedPuestos.value.length === 0) {
            reservationError.value = "No hay puestos seleccionados para reservar.";
            return;
        }

        const userId = userStore.user?.idUsuario;
        if (!userId) {
            reservationError.value = "No se pudo obtener la información del usuario. Por favor, inicie sesión.";
            return;
        }

        isReserving.value = true;
        reservationError.value = null;
        reservationSuccess.value = null;

        // Construir líneas de reserva con todos los tramos de todos los puestos seleccionados
        // Se cambió el tipo de idTramoHorario a idDisponibilidad para alinearse con el DTO del backend
        const reservationLines: { idPuestoTrabajo: number; idDisponibilidad: number; }[] = []; 
        let anyPuestoHasAvailableSlots = false;

        for (const selectedPuestoRef of selectedPuestos.value) {
            const puestoCompleto = currentPuestoDisponibilidades.value.find(
                p => p.idPuestoTrabajo === selectedPuestoRef.idPuestoTrabajo
            );

            if (puestoCompleto && puestoCompleto.disponibilidadesEnRango) {
                const tramosDisponiblesParaPuesto = puestoCompleto.disponibilidadesEnRango
                    .filter((slot: any) => slot.estado); // Solo tramos DISPONIBLES

                if (tramosDisponiblesParaPuesto.length > 0) {
                    anyPuestoHasAvailableSlots = true;
                    tramosDisponiblesParaPuesto.forEach((slot: any) => {
                        reservationLines.push({
                            idPuestoTrabajo: puestoCompleto.idPuestoTrabajo,
                            idDisponibilidad: slot.idDisponibilidad,
                        });
                    });
                }
            }
        }

        if (!anyPuestoHasAvailableSlots || reservationLines.length === 0) {
            reservationError.value = "Ninguno de los puestos seleccionados tiene tramos horarios disponibles para la fecha seleccionada.";
            isReserving.value = false;
            return;
        }

        // Obtener la fecha y darle formato para el endpoint
        const fechaReservaISO = new Date(filtrosStore.fechaInicio).toISOString();

        const reservationData = {
            idUsuario: userId,
            descripcion: description,
            fechaReserva: fechaReservaISO,
            lineas: reservationLines,
        };

        try {
            const response = await fetch('https://localhost:7179/api/Reservas/reservacompleta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            if (!response.ok) {
                let errorDetail = await response.text();
                try {
                    const errorJson = JSON.parse(errorDetail);
                    errorDetail = errorJson.message || errorJson.detail || errorDetail;
                } catch (e) {
                    // No es JSON
                }
                throw new Error(`Error al crear la reserva: ${response.status} - ${response.statusText}. Detalles: ${errorDetail}`);
            }

            reservationSuccess.value = "Reserva realizada con éxito";
            resetSelection();
        } catch (error: any) {
            console.error("Reservation API error:", error);
            reservationError.value = error.message || "Ocurrió un error al intentar reservar.";
        } finally {
            isReserving.value = false;
        }
    }

    return {
        // Estados
        selectedPuestos,
        isReserving,
        reservationError,
        reservationSuccess,
        currentPuestoDisponibilidades,

        // Getters
        isPuestoSelected,

        // Métodos
        togglePuestoSelection,
        resetSelection,
        createReservation,
        setPuestoDisponibilidades,
    };
});
