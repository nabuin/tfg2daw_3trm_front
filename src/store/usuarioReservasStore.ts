import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { useUserStore } from './userStore';

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
                console.log("Reservas obtenidas:", this.reservations); // debug
            } catch (err: any) {
                this.error = err.message || "Fallo al cargar las reservas.";
                console.error("Error fetching user reservations:", err); // debug
            } finally {
                this.loading = false;
            }
        },
        clearReservations() {
            this.reservations = null;
            this.loading = false;
            this.error = null;
        },
    },
});