import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { useUserStore } from './UserStore';

// interfaz para la data que va a traer la API
interface Reservation {
    idReserva: number;
    precioTotal: number;
    nombreSalaPrincipal: string;
    ciudadSedePrincipal: string;
    direccionSedePrincipal: string;
    imagenSalaPrincipal: string;
    rangoHorarioReserva: string; // "MM/DD/YYYY HH:mm - MM/DD/YYYY HH:mm"
    cantidadHorasReservadas: number;
}

interface ReservationState {
    reservations: Reservation[] | null; // array de reservas por si saca mas de una
    loading: boolean;
    error: string | null;
}

export const useReservationStore = defineStore("reservation", {
    state: (): ReservationState => ({
        reservations: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchUserReservations(token: string) {
            // Access the user store
            const userStore = useUserStore();
            const userId = userStore.user?.idUsuario; // usar el ID del usuario logeado desde su store

            if (!userId) {
                this.error = "No se pudo obtener el ID del usuario. Por favor, inicie sesión.";
                this.loading = false;
                return;
            }

            this.loading = true;
            this.error = null;
            this.reservations = null; // borrar reservas previas para evitar conflictos

            try {
                const endpoint = `https://localhost:7179/api/Reservas/reservasdeusuario/${userId}`;

                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || "Error al obtener las reservas del usuario."
                    );
                }

                const data: Reservation[] = await res.json();
                this.reservations = data;
                console.log("Reservas obtenidas:", this.reservations); 
            } catch (err: any) {
                this.error = err.message || "Fallo al cargar las reservas.";
                console.error("Error fetching user reservations:", err);
            } finally {
                this.loading = false;
            }
        },
        clearReservations() {
            this.reservations = null;
            this.loading = false;
            this.error = null;
        },

            // metodo para cancelar (borrar) una reserva
          async cancelarReserva(reservationId: number, token: string) {
            this.loading = true;
            this.error = null;

            try {
                const endpoint = `https://localhost:7179/api/Reservas/${reservationId}`;

                const res = await fetch(endpoint, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) { // si no fue status 204, osea algo falló
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || "Error al cancelar la reserva."
                    );
                }
                // si se borra una reserva, se actualiza el array de reservas excluyendo la que se borró
                if (this.reservations) {
                    this.reservations = this.reservations.filter(
                        (res) => res.idReserva !== reservationId
                    );
                }
                console.log(`Reserva ${reservationId} eliminada con éxito.`);
            } catch (err: any) { // si da algun error se guarda
                this.error = err.message || "Fallo al cancelar la reserva.";
                console.error("Error deleting reservation:", err); 
                throw err;
            } finally {
                this.loading = false; // desactiva el loading
            }
        },

        // metodo para obtener el código QR de una reserva
        async fetchQrCode(reservationId: number, token: string): Promise<Blob | null> {
            this.error = null; // Limpia errores previos relacionados con QR
            try {
                const endpoint = `https://localhost:7179/api/Reservas/generarqr/${reservationId}`;
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'image/png' // este endpoint responde el qr en formato PNG
                    }
                });

                if (!response.ok) {
                    let errorText = await response.text(); // si algo falla devolverá un txt de error
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorText = errorJson.message || errorJson.detail || errorText;
                    } catch { }
                    throw new Error(`Error al obtener el QR para la reserva ${reservationId}: ${errorText}`);
                }

                const imageBlob = await response.blob(); // blob es Binary Large Object, osea, usado para manejar binarios grandes como imagenes, png aqui
                return imageBlob;

            } catch (err: any) {
                console.error(`Error al obtener el QR para la reserva ${reservationId}:`, err);
                this.error = err.message || "Error al obtener el código QR."; // asigna el error al estado del store
                return null; // devuelve null en caso de error
            }
        },
    },
});