<template>
  <v-container fluid class="py-8 d-flex justify-center">
    <v-card class="flat-card rectangle-card">
      <v-card-text>
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-row no-gutters>
            <!-- IZQUIERDA: Datos de pago -->
            <v-col cols="12" md="6" class="pa-6 section-left">
              <h6 class="section-title">Datos de pago</h6>

              <v-text-field
                class="flat-field"
                v-model="payment.cardName"
                label="Nombre del titular"
                outlined
                dense
                hide-details="auto"
              />

              <v-text-field
                class="flat-field card-number-field unique"
                v-model="payment.cardNumber"
                :rules="[rules.cardNumberDigits]"
                label="Número de tarjeta"
                outlined
                dense
                hide-details="auto"
                maxlength="19"
                placeholder="1234 5678 9012 3456"
              />

              <v-row class="mt-4">
                <v-col cols="6">
                  <v-text-field
                    class="flat-field"
                    v-model="payment.expiry"
                    label="MM/AA"
                    outlined
                    dense
                    hide-details="auto"
                    maxlength="5"
                    placeholder="05/28"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    class="flat-field"
                    v-model="payment.cvv"
                    :rules="[rules.cvvDigits]"
                    label="CVV"
                    outlined
                    dense
                    hide-details="auto"
                    maxlength="4"
                  />
                </v-col>
              </v-row>
            </v-col>

            <!-- DERECHA: Dirección de facturación -->
            <v-col cols="12" md="6" class="pa-6 section-right">
              <h6 class="section-title">Dirección de facturación</h6>

              <v-text-field
                class="flat-field"
                v-model="billing.addressLine1"
                label="Dirección"
                outlined
                dense
                hide-details="auto"
              />

              <v-text-field
                class="flat-field mt-4"
                v-model="billing.addressLine2"
                label="Apto / Piso (opcional)"
                outlined
                dense
                hide-details="auto"
              />

              <v-row class="mt-4">
                <v-col cols="6">
                  <v-text-field
                    class="flat-field"
                    v-model="billing.city"
                    label="Ciudad"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    class="flat-field"
                    v-model="billing.state"
                    label="Provincia / Región"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row class="mt-4">
                <v-col cols="6">
                  <v-text-field
                    class="flat-field"
                    v-model="billing.zip"
                    label="Código postal"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    class="flat-field"
                    v-model="billing.country"
                    :items="countries"
                    label="País"
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <!-- Checkbox nativo -->
              <div class="mt-6">
                <label class="flat-checkbox-label">
                  <input
                    type="checkbox"
                    v-model="acceptTerms"
                    class="flat-checkbox-input"
                  />
                  <span class="flat-checkbox-box"></span>
                  <span class="flat-checkbox-text">
                    Acepto los términos y condiciones
                  </span>
                </label>
              </div>
            </v-col>
          </v-row>
        </v-form>

        <v-divider class="my-6"></v-divider>

        <v-card class="mx-6 mb-6 pa-4" elevation="2" color="#f9f9f9" rounded="lg">
          <h6 class="section-title mb-4">📝 Detalles de la reserva</h6>

          <v-row dense>
            <v-col cols="12" sm="6">
              <p><strong>📅 Fecha de inicio:</strong><br>{{ fechaInicio }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <p><strong>📅 Fecha de fin:</strong><br>{{ fechaFin }}</p>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" sm="6">
              <p><strong>⏰ Hora de inicio:</strong><br>{{ horaInicio }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <p><strong>⏰ Hora de fin:</strong><br>{{ horaFin }}</p>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" sm="6">
              <p><strong>🏢 Sala:</strong><br>
                {{ salaNombres[selectedSeatDetails[0]?.id] || 'Cargando…' }}
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <p><strong>🎟️ Asientos seleccionados:</strong></p>
              <ul v-if="selectedSeatDetails.length">
                <li v-for="seat in selectedSeatDetails" :key="seat.id">
                  Puesto: {{ seat.numeroAsiento }}
                </li>
              </ul>
              <p v-else>No hay asientos seleccionados.</p>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>

      <v-card-actions class="justify-end pa-6">
        <v-btn
          class="flat-button"
          :disabled="!formValid || isReserving"
          @click="submit"
        >
          {{ isReserving ? 'Procesando...' : `Pagar ${totalFormatted}` }}
        </v-btn>
      </v-card-actions>

      <div v-if="reservationError" class="mt-4 pa-4" style="color: red; text-align: center;">
        {{ reservationError }}
      </div>
      <div v-if="reservationSuccess" class="mt-4 pa-4" style="color: green; text-align: center;">
        {{ reservationSuccess }}
      </div>
    </v-card>
  </v-container>
</template>


<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useReservasStore } from '../store/reservasStore'
import { useFiltrosStore } from '../store/filtrosStore'
import { usePuestosStore } from '../store/asientosStore'
import { useSalaAsientoStore } from '../store/salaAsientoStore'

// Stores
const reservasStore = useReservasStore()
const {
  selectedPuestos,
  isReserving,
  reservationError,
  reservationSuccess,
  currentPuestoDisponibilidades
} = storeToRefs(reservasStore)

const filtrosStore = useFiltrosStore()
const { fechaInicio, fechaFin, horaInicio, horaFin } = storeToRefs(filtrosStore)

const puestosStore = usePuestosStore()
const { puestosDisponibles } = storeToRefs(puestosStore)

const salaAsientoStore = useSalaAsientoStore()

// Carga puestos y sincroniza con reservas
onMounted(() => {
  puestosStore.obtenerPuestosDisponibles()
})
watch(
  puestosDisponibles,
  (nuevos) => {
    reservasStore.setPuestoDisponibilidades(nuevos)
  },
  { immediate: true }
)

// Computed para cruzar selección con detalles
const selectedSeatDetails = computed(() =>
  selectedPuestos.value.map(sel => {
    const info = currentPuestoDisponibilidades.value.find(
      p => p.idPuestoTrabajo === sel.idPuestoTrabajo
    )
    return {
      id: sel.idPuestoTrabajo,
      numeroAsiento: info?.numeroAsiento || `Puesto ${sel.idPuestoTrabajo}`
    }
  })
)

// Cache reactivo de nombres de sala
const salaNombres = reactive<Record<number,string>>({})

// Cada vez que cambian las selecciones, pide el nombre de la sala
watch(
  selectedSeatDetails,
  (list) => {
    list.forEach(seat => {
      if (!(seat.id in salaNombres)) {
        salaAsientoStore
          .obtenerSalaNombre(seat.id)
          .then(name => {
            salaNombres[seat.id] = name
          })
          .catch(() => {
            salaNombres[seat.id] = 'Desconocida'
          })
      }
    })
  },
  { immediate: true }
)

// Formulario de pago
const form = ref(null)
const formValid = ref(false)

const payment = reactive({
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
})

const billing = reactive({
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  country: null,
})

const countries = [
  'España', 'México', 'Argentina',
  'Estados Unidos', 'Canadá', 'Chile', 'Colombia',
]

const acceptTerms = ref(false)

const total = ref(29.99)
const totalFormatted = computed(() =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(total.value)
)

const rules = {
  cardNumberDigits: (v: string) =>
    (v && v.replace(/\s/g, '').length === 16) ||
    'La tarjeta debe tener 16 dígitos',
  cvvDigits: (v: string) =>
    (v && /^\d{3,4}$/.test(v)) ||
    'El CVV debe tener 3 – 4 dígitos',
}

async function submit() {
  if (!formValid.value || !acceptTerms.value) return

  try {
    await reservasStore.createReservation('reserva desde zona de pago')
    alert('Reserva completada con éxito.')
    form.value.reset()
  } catch (error) {
    console.error('Error al hacer la reserva:', error)
    alert('Ocurrió un error al procesar la reserva.')
  }
}
</script>



<style scoped lang="scss">
.flat-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.rectangle-card {
  width: 800px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.section-left,
.section-right {
  background-color: #fafafa;
}

.section-left {
  border-right: 1px solid #e0e0e0;
}

.section-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #424242;
}

.flat-field {
  ::v-deep {
    .v-field__control {
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    .v-field__outline {
      border-color: transparent;
    }
  }
}

.card-number-field {
  ::v-deep {
    .v-field__control {
      padding-top: 25px;
    }
  }
}

.flat-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.flat-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.flat-checkbox-box {
  width: 20px;
  height: 20px;
  border: 2px solid #bdbdbd;
  border-radius: 4px;
  display: inline-block;
  margin-right: 0.5rem;
  position: relative;
}

.flat-checkbox-input:checked + .flat-checkbox-box {
  background-color: #1976d2;
  border-color: #1976d2;
}

.flat-checkbox-box::after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.flat-checkbox-input:checked + .flat-checkbox-box::after {
  display: block;
}

.flat-checkbox-text {
  color: #424242;
  font-size: 0.95rem;
}

.flat-button {
  text-transform: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  box-shadow: none;
  transition: box-shadow 0.2s ease;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 960px) {
  .rectangle-card {
    width: 100%;
  }
  .section-left {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}

.unique {
  padding-top: 25px;
}
</style>
