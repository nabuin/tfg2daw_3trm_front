<template>
    <div class="puesto-selection-page-wrapper">
        <h2>Selección de Puestos</h2>

        <p v-if="loading" class="loading-message">Cargando puestos disponibles...</p>
        <p v-if="error" class="error-message-full">Error al cargar: {{ error }}</p>

        <div v-if="!loading && !error">
            <div v-if="puestosDisponibles.length === 0" class="no-puestos-message">
                <p>No se encontraron puestos disponibles con los criterios seleccionados.</p>
            </div>

            <div class="puestos-grid">
                <div
                    v-for="puesto in puestosDisponibles"
                    :key="puesto.idPuestoTrabajo"
                    class="puesto-card"
                    :class="{ 'selected': isPuestoSelected(puesto.idPuestoTrabajo) }"
                    @click="handlePuestoClick(puesto)"
                >
                    <h4>Puesto #{{ puesto.numeroAsiento }} (Mesa: {{ puesto.codigoMesa }})</h4>
                    <img v-if="puesto.urL_Imagen" :src="puesto.urL_Imagen" alt="Imagen del puesto" class="puesto-imagen"/>
                    <p>ID Puesto: {{ puesto.idPuestoTrabajo }}</p>
                    
                    <div class="tramo-summary">
                        <h5>Tramos disponibles:</h5>
                        <p v-if="puesto.disponibilidadesEnRango && puesto.disponibilidadesEnRango.length > 0">
                            <span v-for="(slot, idx) in puesto.disponibilidadesEnRango" :key="slot.idTramoHorario">
                                {{ slot.horaInicio.substring(0, 5) }}<span v-if="!slot.estado">(No Disp.)</span><span v-if="idx < puesto.disponibilidadesEnRango.length - 1">, </span>
                            </span>
                        </p>
                        <p v-else>No tiene tramos horarios disponibles.</p>
                    </div>
                </div>
            </div>

            <div class="resumen-section" v-if="selectedPuestos.length > 0">
                <h3>Puestos Seleccionados para Reserva</h3>
                <p class="summary-count">Has seleccionado {{ selectedPuestos.length }} puesto(s).</p>
                <div class="selected-items">
                    <div 
                        v-for="(puestoRef, index) in selectedPuestos" 
                        :key="index" 
                        class="selected-item"
                    >
                        Puesto ID: {{ puestoRef.idPuestoTrabajo }} (Hora inicio ref: {{ puestoRef.horaInicioPrimerTramo.substring(0,5) }})
                        <button @click="removePuesto(index)" class="remove-button">X</button>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button 
                        @click="resetSelection" 
                        class="cancel-button" 
                        :disabled="isReserving"
                    >
                        Cancelar Selección
                    </button>
                    <button 
                        @click="handleSubmit" 
                        class="submit-button" 
                        :disabled="isReserving || selectedPuestos.length === 0"
                    >
                        {{ isReserving ? 'Procesando...' : 'Confirmar Reserva de Todos los Tramos de los Puestos Seleccionados' }}
                    </button>
                </div>
                
                <p v-if="reservationSuccess" class="success-message">{{ reservationSuccess }}</p>
                <p v-if="reservationError" class="error-message">{{ reservationError }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { usePuestosStore } from '../store/asientosStore';
import { useSalaSeleccionadaStore } from '../store/salaSeleccionadaStore'; 
import { useFiltrosStore } from '../store/filtrosStore';
import { useReservasStore } from '../store/reservasStore';
import { useUserStore } from '../store/userStore';

import { storeToRefs } from 'pinia';

export default defineComponent({
    setup() {
        const puestosStore = usePuestosStore();
        const salaStore = useSalaSeleccionadaStore();
        const filtrosStore = useFiltrosStore();
        const reservasStore = useReservasStore();
        const userStore = useUserStore();

        // Obtener los estados del store de puestos
        const { loading, error, puestosDisponibles } = storeToRefs(puestosStore);

        // Obtener los estados del store de reservas
        const { 
            selectedPuestos, 
            isReserving,
            reservationError,
            reservationSuccess,
            isPuestoSelected 
        } = storeToRefs(reservasStore);

        // Obtener el estado del usuario del store de usuario
        const { user } = storeToRefs(userStore);

        // Cargar los asientos si hay ID sala al montar el componente
        onMounted(() => {
            if (salaStore.id !== null) {
                puestosStore.obtenerPuestosDisponibles();
            }
        });

        // Recargar puestos disponibles al cambiar los filtros
        watch(
            () => [
                salaStore.id,
                filtrosStore.fechaInicio,
                filtrosStore.fechaFin,
                filtrosStore.horaInicio,
                filtrosStore.horaFin,
            ],
            async () => {
                if (salaStore.id !== null) {
                    await puestosStore.obtenerPuestosDisponibles();
                    // IMPORTANTE: Pasar las disponibilidades actuales al store de reservas
                    // para que createReservation pueda acceder a todos los tramos del puesto.
                    reservasStore.setPuestoDisponibilidades(puestosStore.puestosDisponibles);
                    reservasStore.resetSelection(); // Reset selection when filters change
                } else {
                    puestosStore.puestosDisponibles = [];
                    reservasStore.setPuestoDisponibilidades([]); // Also clear in reservasStore
                    reservasStore.resetSelection(); // Reset selection when sala is null
                }
            },
            { immediate: true } // Ejecutarlo al inicio
        );

        // Función para manejar los clics en los puestos
        const handlePuestoClick = (puesto: any) => {
            reservasStore.togglePuestoSelection(puesto);
        };

        // Función para eliminar un puesto clicado del resumen
        const removePuesto = (index: number) => {
            selectedPuestos.value.splice(index, 1);
        };

        // Función para cuando se le de a Confirmar Reserva
        const handleSubmit = async () => {
            const description = "Reserva completada"; 
            await reservasStore.createReservation(description);
        };

        return {
            // De puestosStore
            loading,
            error,
            puestosDisponibles,

            // De reservasStore
            selectedPuestos,
            isReserving,
            reservationError,
            reservationSuccess,
            isPuestoSelected,

            user, // Acceso al user del userStore

            // Funciones
            handlePuestoClick,
            removePuesto,
            handleSubmit,
            resetSelection: reservasStore.resetSelection, // Exponer resetSelection para el botón
        };
    },
});
</script>

<style scoped>
.puesto-selection-page-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f8f9fa;
    min-height: calc(100vh - 60px); /* Adjust for header/footer if present */
    display: flex;
    flex-direction: column;
    gap: 20px;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
    font-size: 28px;
}

.loading-message, .no-puestos-message {
    text-align: center;
    padding: 20px;
    color: #555;
    background-color: #e9ecef;
    border-radius: 8px;
}

.error-message-full {
    background-color: #ffe6e6;
    border-left: 4px solid #ff3333;
    padding: 10px 15px;
    margin-bottom: 20px;
    border-radius: 4px;
    color: #cc0000;
    text-align: center;
}

.puestos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.puesto-card {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.puesto-card:hover:not(.selected) {
    background-color: #f0f0f0;
    border-color: #a0a0a0;
}

.puesto-card.selected {
    background-color: #e0f2f7; 
    border-color: #007bff;
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.3);
}

.puesto-card h4 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #333;
    font-size: 1.2em;
}

.puesto-imagen {
    max-width: 100px;
    height: auto;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid #eee;
}

.puesto-card p {
    margin: 5px 0;
    color: #555;
}

.tramo-summary {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;
    width: 100%;
}

.tramo-summary h5 {
    margin: 0 0 8px 0;
    color: #666;
    font-size: 1em;
}

.tramo-summary p {
    font-size: 0.9em;
    color: #444;
}

/* Resumen Section */
.resumen-section {
    margin-top: 30px;
    padding: 25px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f5f5f5;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.resumen-section h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 1.5em;
    text-align: center;
}

.summary-count {
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
    color: #007bff;
}

.selected-items {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 20px;
    padding-right: 5px;
}

.selected-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin-bottom: 8px;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    font-size: 0.95em;
    color: #333;
}

.remove-button {
    background-color: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
}

.remove-button:hover {
    background-color: #c82333;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 25px;
}

.submit-button, .cancel-button {
    padding: 12px 25px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    font-weight: bold;
    font-size: 1.1em;
    transition: background-color 0.2s ease, opacity 0.2s ease;
}

.submit-button {
    background-color: green;
    color: white;
}

.submit-button:hover:not(:disabled) {
    background-color: #218838;
}

.submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
}

.cancel-button {
    background-color: gray;
    color: white;
}

.cancel-button:hover:not(:disabled) {
    background-color: #5a6268;
}

.cancel-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.success-message {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-left: 5px solid #28a745;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
}

.error-message {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-left: 5px solid #dc3545;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
}
</style>