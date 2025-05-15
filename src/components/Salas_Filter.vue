<template>
    <div class="form-width">
    <form @submit.prevent="validarFiltro" class="filtro-form">
      <div class="form-group">
        <label for="fechaInicio" class="form-label">Fecha Inicio (dd/mm/aaaa):</label>
        <input
          type="date"
          id="fechaInicio"
          v-model="fechaInicio"
          required
          :max="fechaFin || null"
          class="form-input form-input-date"
        />
      </div>
  
      <div class="form-group">
        <label for="fechaFin" class="form-label">Fecha Fin (dd/mm/aaaa):</label>
        <input
          type="date"
          id="fechaFin"
          v-model="fechaFin"
          required
          :min="fechaInicio || null"
          class="form-input form-input-date"
        />
      </div>
  
      <div class="form-group">
        <label for="horaInicio" class="form-label">Hora Inicio:</label>
        <select
          id="horaInicio"
          v-model="horaInicio"
          required
          class="form-input form-select"
        >
          <option disabled value="">Selecciona hora</option>
          <option v-for="hora in horas" :key="hora" :value="hora">{{ hora }}</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="horaFin" class="form-label">Hora Fin:</label>
        <select
          id="horaFin"
          v-model="horaFin"
          required
          class="form-input form-select"
        >
          <option disabled value="">Selecciona hora</option>
          <option v-for="hora in horas" :key="hora" :value="hora">{{ hora }}</option>
        </select>
      </div>
  
      <div class="form-group form-group-button">
        <button type="submit" class="btn btn-primary">Filtrar</button>
      </div>
    </form>
</div>
  </template>
  
  <script>
  export default {
    name: "FiltroFechasHoras",
    data() {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      const hoyStr = `${yyyy}-${mm}-${dd}`;
  
      return {
        fechaInicio: hoyStr,
        fechaFin: hoyStr,
        horaInicio: "",
        horaFin: "",
        horas: [],
      };
    },
    created() {
      this.generarHoras();
    },
    methods: {
      generarHoras() {
        const horasArray = [];
        for (let h = 0; h < 24; h++) {
          for (let m = 0; m < 60; m += 30) {
            const hh = String(h).padStart(2, "0");
            const mm = String(m).padStart(2, "0");
            horasArray.push(`${hh}:${mm}`);
          }
        }
        this.horas = horasArray;
      },
      validarFiltro() {
        if (this.fechaFin < this.fechaInicio) {
          alert("La fecha fin no puede ser anterior a la fecha inicio.");
          return;
        }
        if (this.fechaInicio === this.fechaFin && this.horaFin <= this.horaInicio) {
          alert(
            "Si la fecha inicio y fecha fin son iguales, la hora fin debe ser mayor que la hora inicio."
          );
          return;
        }
        alert(
          `Filtrando desde ${this.fechaInicio} ${this.horaInicio} hasta ${this.fechaFin} ${this.horaFin}`
        );
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
.form-width {
  display: flex;
  background-color: black;
  padding-bottom: 15px;
}

.filtro-form {
  margin: 0 auto;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: row;
  gap: 0 1rem;

  .form-group {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    &-button {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }
  }

  .form-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: white;
  }

  .form-input {
    padding: 0.4rem 0.5rem;
    font-size: 1rem;
    border: 1px solid #aaa;
    border-radius: 4px;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }

    &-date {
      color: white;

      &::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: brightness(0) invert(1);
        transition: filter 0.3s ease;
      }

      &:hover::-webkit-calendar-picker-indicator {
        filter: brightness(0) invert(1) opacity(0.8);
      }
    }
  }

  .form-select {
    appearance: none;
    background: black;
    cursor: pointer;
    color: white;
  }

  .btn {
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &-primary {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}

  </style>
  