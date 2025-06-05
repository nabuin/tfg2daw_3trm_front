<template>
  <v-container fluid class="py-8 d-flex justify-center">
    <v-card class="flat-card rectangle-card">
      <v-card-text>
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-6 section-left">
              <h6 class="section-title">Datos de pago</h6>
              <v-text-field class="flat-field" v-model="payment.cardName" label="Nombre del titular" outlined dense
                hide-details="auto" />
              <v-text-field class="flat-field card-number-field unique" v-model="payment.cardNumber"
                :rules="[rules.cardNumberDigits]" label="Número de tarjeta" outlined dense hide-details="auto"
                maxlength="19" placeholder="1234 5678 9012 3456" />
              <v-row class="mt-4">
                <v-col cols="6">
                  <v-text-field class="flat-field" v-model="payment.expiry" label="MM/AA" outlined dense
                    hide-details="auto" maxlength="5" placeholder="05/28" />
                </v-col>
                <v-col cols="6">
                  <v-text-field class="flat-field" v-model="payment.cvv" :rules="[rules.cvvDigits]" label="CVV" outlined
                    dense hide-details="auto" maxlength="4" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pa-6 section-right">
              <h6 class="section-title">Dirección de facturación</h6>
              <v-text-field class="flat-field" v-model="billing.addressLine1" label="Dirección" outlined dense
                hide-details="auto" />
              <v-text-field class="flat-field mt-4" v-model="billing.addressLine2" label="Apto / Piso (opcional)"
                outlined dense hide-details="auto" />
              <v-row class="mt-4">
                <v-col cols="6">
                  <v-text-field class="flat-field" v-model="billing.city" label="Ciudad" outlined dense
                    hide-details="auto" />
                </v-col>
                <v-col cols="6">
                  <v-text-field class="flat-field" v-model="billing.state" label="Provincia / Región" outlined dense
                    hide-details="auto" />
                </v-col>
              </v-row>
              <v-row class="mt-4">
                <v-col cols="6">
                  <v-text-field class="flat-field" v-model="billing.zip" label="Código postal" outlined dense
                    hide-details="auto" />
                </v-col>
                <v-col cols="6">
                  <v-select class="flat-field" v-model="billing.country" :items="countries" label="País" outlined dense
                    hide-details="auto" />
                </v-col>
              </v-row>
              <div class="mt-6">
                <label class="flat-checkbox-label">
                  <input type="checkbox" v-model="acceptTerms" class="flat-checkbox-input" />
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
        <v-btn class="flat-button" :disabled="!formValid || isReserving" @click="submit">
          {{ isReserving ? 'Procesando...' : `Pagar: ${totalFormatted}` }}
        </v-btn>
      </v-card-actions>
      <div v-if="termsError" class="mt-2 pa-2" style="color: red; text-align: center;">
        {{ termsError }}
      </div>
      <div v-if="reservationError" class="mt-4 pa-4" style="color: red; text-align: center;">
        {{ reservationError }}
      </div>
      <div v-if="reservationSuccess" class="mt-4 pa-4" style="color: green; text-align: center;">
        {{ reservationSuccess }}
      </div>
    </v-card>

    <v-dialog v-model="showSuccessDialog" max-width="420" persistent>
      <v-card class="popup-card text-center">
        <v-card-title class="popup-title">
          ¡Reserva completada!
        </v-card-title>
        <v-card-text class="popup-text">
          Tu reserva ha sido procesada con éxito. Te esperamos en tu espacio reservado.
        </v-card-text>
        <v-card-actions class="justify-center mt-4">
          <v-btn class="popup-button" @click="router.push('/userinfo')">
            Ir a mis reservas
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useReservasStore } from '../store/reservasStore';
import { useFiltrosStore } from '../store/filtrosStore';
import { useSalaAsientoStore } from '../store/salaAsientoStore';
import { useAsientosPreciosStore } from '../store/asientosPreciosStore';

const router = useRouter();
const reservasStore = useReservasStore();
const { selectedPuestos, isReserving, reservationError, reservationSuccess, currentPuestoDisponibilidades } = storeToRefs(reservasStore);

const filtrosStore = useFiltrosStore();
const { fechaInicio, fechaFin, horaInicio, horaFin } = storeToRefs(filtrosStore);

const salaAsientoStore = useSalaAsientoStore();

const precioStore = useAsientosPreciosStore();
const { precioTotal } = storeToRefs(precioStore);

const termsError = ref<string | null>(null);
const form = ref(null);
const formValid = ref(false);
const showSuccessDialog = ref(false);

const payment = reactive({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
const billing = reactive({ addressLine1: '', addressLine2: '', city: '', state: '', zip: '', country: null });
const countries = ['España', 'México', 'Argentina', 'Estados Unidos', 'Canadá', 'Chile', 'Colombia'];
const acceptTerms = ref(false);

const rules = {
  cardNumberDigits: (v: string) => (v && v.replace(/\s/g, '').length === 16) || 'la tarjeta debe tener 16 dígitos',
  cvvDigits: (v: string) => (v && /^\d{3,4}$/.test(v)) || 'el cvv debe tener 3 – 4 dígitos',
};

function calcularHoras(): number {
  const [h1, m1] = horaInicio.value.split(':').map(Number);
  const [h2, m2] = horaFin.value.split(':').map(Number);
  const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
  return minutos > 0 ? minutos / 60 : 0;
}

async function recalcPrice() {
  const ids = selectedPuestos.value.map(p => p.idPuestoTrabajo);
  const horas = calcularHoras();
  await precioStore.calcularPrecio(ids, horas);
}

const diasLaborales = computed(() => {
  const startDate = new Date(fechaInicio.value);
  const endDate = new Date(fechaFin.value);
  let diasLaborales = 0;
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) diasLaborales++;
  }
  return diasLaborales;
});

const precioTotalDias = computed(() => precioTotal.value * diasLaborales.value);

const totalFormatted = computed(() =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioTotalDias.value)
);

onMounted(async () => {
  if (selectedPuestos.value.length === 0) {
    router.push('/');
    return;
  }
  recalcPrice();
});


watch([selectedPuestos, horaInicio, horaFin], recalcPrice);

const selectedSeatDetails = computed(() => selectedPuestos.value.map(sel => {
  const info = currentPuestoDisponibilidades.value.find(p => p.idPuestoTrabajo === sel.idPuestoTrabajo);
  return {
    id: sel.idPuestoTrabajo,
    numeroAsiento: info?.numeroAsiento || `Puesto ${sel.idPuestoTrabajo}`
  };
}));

const salaNombres = reactive<Record<number, string>>({});
watch(selectedSeatDetails, list => {
  list.forEach(seat => {
    if (!(seat.id in salaNombres)) {
      salaAsientoStore.obtenerSalaNombre(seat.id).then(name => salaNombres[seat.id] = name).catch(() => salaNombres[seat.id] = 'Desconocida');
    }
  });
}, { immediate: true });

async function submit() {
  termsError.value = null;
  if (!acceptTerms.value) {
    termsError.value = 'Debes aceptar los términos y condiciones';
    return;
  }
  if (!formValid.value) return;
  try {
    await reservasStore.createReservation('reserva desde zona de pago');
    showSuccessDialog.value = true;
    form.value.reset();
  } catch (error) {
    console.error('error al hacer la reserva:', error);
    alert('ocurrió un error al procesar la reserva.');
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

.flat-checkbox-input:checked+.flat-checkbox-box {
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

.flat-checkbox-input:checked+.flat-checkbox-box::after {
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

.popup-card {
  border-radius: 16px;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.4s ease-out;
}

.popup-title {
  color: #2e7d32;
  font-weight: 700;
  font-size: 1.4rem;
}

.popup-text {
  font-size: 1rem;
  color: #424242;
  margin-top: 0.5rem;
}

.popup-button {
  background-color: #43a047;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  font-size: 0.95rem;
  padding: 0;
  transition: background-color 0.3s ease;
    width: 180px;
}
</style>
