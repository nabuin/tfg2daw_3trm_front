<template>
  <v-container fluid class="py-8 d-flex justify-center">
    <v-card class="flat-card rectangle-card" elevation="10" rounded="xl">
      <v-card-text>
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-row no-gutters>
            <!-- IZQUIERDA: Datos de pago -->
            <v-col cols="12" md="6" class="pa-6 section-left">
              <h6 class="section-title mb-4">💳 Datos de pago</h6>

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
              <h6 class="section-title mb-4">📍 Dirección de facturación</h6>

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

        <!-- Detalles de la reserva decorado -->
        <v-divider class="my-6"></v-divider>
        <v-card class="mx-6 mb-6 pa-4" elevation="2" color="#f9f9f9" rounded="lg">
          <h6 class="section-title mb-4">📝 Detalles de la reserva</h6>

          <v-row dense>
            <v-col cols="12" sm="6" md="4">
              <p><strong>📅 Fecha de inicio:</strong><br>{{ reserva.fechaInicio }}</p>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <p><strong>📅 Fecha de fin:</strong><br>{{ reserva.fechaFin }}</p>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <p><strong>⏰ Hora de inicio:</strong><br>{{ reserva.horaInicio }}</p>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <p><strong>⏰ Hora de fin:</strong><br>{{ reserva.horaFin }}</p>
            </v-col>

            <v-col cols="12" md="8">
              <p><strong>🎟️ Asientos reservados:</strong><br>{{ reserva.asientos }}</p>
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

      <!-- Mensajes de error/éxito -->
      <div v-if="reservationError" class="mt-4 pa-4" style="color: red; text-align: center;">
        {{ reservationError }}
      </div>
      <div v-if="reservationSuccess" class="mt-4 pa-4" style="color: green; text-align: center;">
        {{ reservationSuccess }}
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formValid = ref(false)
const acceptTerms = ref(false)
const isReserving = ref(false)
const reservationError = ref('')
const reservationSuccess = ref('')

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
  country: '',
})

const countries = ['España', 'México', 'Argentina', 'Chile', 'Colombia']

const rules = {
  cardNumberDigits: v => /^\d{16}$/.test(v.replace(/\s/g, '')) || 'Debe tener 16 dígitos',
  cvvDigits: v => /^\d{3,4}$/.test(v) || 'CVV inválido',
}

const totalFormatted = '25,00 €'

const reserva = reactive({
  fechaInicio: '2025-06-01',
  fechaFin: '2025-06-01',
  horaInicio: '09:00',
  horaFin: '11:00',
  asientos: 'A1, A2, A3',
})

function submit() {
  isReserving.value = true
  reservationError.value = ''
  reservationSuccess.value = ''

  setTimeout(() => {
    isReserving.value = false
    reservationSuccess.value = '¡Reserva completada con éxito!'
  }, 1500)
}
</script>
