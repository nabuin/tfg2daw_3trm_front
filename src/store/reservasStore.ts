import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useFiltrosStore } from './filtrosStore'; 

interface SelectedSlot {
  idPuestoTrabajo: number;
  idTramoHorario: number;
  horaInicio: string;
}

export const useReservasStore = defineStore('reservas', () => {
  const selectedSlots = ref<SelectedSlot[]>([]);
  const isReserving = ref(false);
  const reservationError = ref<string | null>(null);
  const reservationSuccess = ref<string | null>(null);

  const filtrosStore = useFiltrosStore();

  const getReservationLines = computed(() => {
    return selectedSlots.value.map(slot => ({
      idPuestoTrabajo: slot.idPuestoTrabajo,
      idTramoHorario: slot.idTramoHorario,
    }));
  });

  const isSlotSelected = computed(() => (puestoId: number, tramoId: number) => {
    return selectedSlots.value.some(
      slot => slot.idPuestoTrabajo === puestoId && slot.idTramoHorario === tramoId
    );
  });

   const getReservationDateTime = computed(() => {
        const fecha = filtrosStore.fechaInicio;
        if (!fecha || selectedSlots.value.length === 0) {
            return null;
        }
        const hora = selectedSlots.value[0].horaInicio;
        const time = hora.length <= 5 ? `${hora}:00` : hora;

        return `${fecha}T${time}`;
   });


  function toggleSlotSelection(puesto: any, slot: any) {
    const index = selectedSlots.value.findIndex(
      s => s.idPuestoTrabajo === puesto.idPuestoTrabajo && s.idTramoHorario === slot.idTramoHorario
    );

    if (index === -1) {
      if (slot.estado) {
         selectedSlots.value.push({
           idPuestoTrabajo: puesto.idPuestoTrabajo,
           idTramoHorario: slot.idTramoHorario,
           horaInicio: slot.horaInicio,
         });
         reservationError.value = null;
         reservationSuccess.value = null;
      } else {
        console.warn("Tramo no disponible");
      }
    } else {
      selectedSlots.value.splice(index, 1);
       reservationError.value = null;
       reservationSuccess.value = null;
    }
  }

  function resetSelection() {
    selectedSlots.value = [];
    reservationError.value = null;
    reservationSuccess.value = null;
    isReserving.value = false;
  }

  async function createReservation(userId: number, description: string = "Reserva") {
    if (selectedSlots.value.length === 0) { // si no hay seleccionado nada
      reservationError.value = "No hay tramos seleccionados para reservar.";
      return;
    }

    isReserving.value = true;
    reservationError.value = null;
    reservationSuccess.value = null;

    const reservationData = {
      idUsuario: userId,
      descripcion: description,
      fechaReserva: getReservationDateTime.value,
      lineas: getReservationLines.value,
    };

    console.log("Sending reservation data:", JSON.stringify(reservationData, null, 2));

    try {
      const response = await fetch('https://localhost:7179/api/Reservas/reservacompleta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // mas adelante se metera jwt
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        let errorDetail = await response.text();
         try {
             const errorJson = JSON.parse(errorDetail);
             errorDetail = errorJson.message || errorDetail;
        } catch (e) {
            // peticion no es formato json
        }
        throw new Error(`Error al crear la reserva: ${response.status} - ${response.statusText}. Detalles: ${errorDetail}`);
      }

      reservationSuccess.value = "¡Reserva realizada con éxito!";
      resetSelection(); // opcion seleccionada se pone a 0

    } catch (error: any) {
      console.error("Reservation API error:", error);
      reservationError.value = error.message || "Ocurrió un error al intentar reservar.";
    } finally {
      isReserving.value = false;
    }
  }

  return {
    // State
    selectedSlots,
    isReserving,
    reservationError,
    reservationSuccess,

    // Getters
    getReservationLines,
    isSlotSelected,

    // Actions
    toggleSlotSelection,
    resetSelection,
    createReservation,
  };
});