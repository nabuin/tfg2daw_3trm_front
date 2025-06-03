<template>
  <div class="servicios">
    <div class="servicios__contenedor">
      <div class="servicios__fila">
        <div class="servicios__texto">
          <div class="servicios__titulo tt-svr">Servicios para nuestros usuarios</div>
        </div>
        <div class="servicios__card blue">
          <div class="servicios__icono"><img src="../imgs/service/air.svg" alt=""></div>
          <div class="servicios__card-titulo">Aire</div>
          <div class="servicios__card-texto">
            Todas las zonas de nuestras instalaciones disponen de servicios de aire acondicionado para cuando sea necesario
          </div>
        </div>
        <div class="servicios__card green">
          <div class="servicios__icono"><img src="../imgs/service/cocina.svg" alt=""></div>
          <div class="servicios__card-titulo">Cocina</div>
          <div class="servicios__card-texto">
            Aparte de las zonas de trabajo, les disponemos de una zona de cocina, en la que aparte de preparar y calentar comida, podrán pasar tiempo con sus compañeros
          </div>
        </div>
      </div>

      <div class="servicios__fila">
        <div class="servicios__card blue">
          <div class="servicios__icono"><img src="../imgs/service/pcs.svg" alt=""></div>
          <div class="servicios__card-titulo">PCs</div>
          <div class="servicios__card-texto">
            En caso de que tu o tu equipo no dispongáis de un equipo para poder trabajar, nosotros podemos proporcionárselo
          </div>
        </div>
        <div class="servicios__card green">
          <div class="servicios__icono"><img src="../imgs/service/seguridad.svg" alt=""></div>
          <div class="servicios__card-titulo">Seguridad</div>
          <div class="servicios__card-texto">
            Disponemos de un equipo de vigilancia las 24 horas del día, para asegurarnos de que no ocurra ningún altercado desafortunado a nuestros usuarios
          </div>
        </div>
        <div class="servicios__card blue">
          <div class="servicios__icono"><img src="../imgs/service/wifi.svg" alt=""></div>
          <div class="servicios__card-titulo">Internet</div>
          <div class="servicios__card-texto">
            Todas nuestras instalaciones disponen de un servicio a internet siempre que sea requerido, con el máximo nivel de seguridad
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.servicios {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0;

  &__contenedor {
    height: auto;
    width: 702px;

    .servicios__fila {
      height: 50%;
      width: 100%;
      display: flex;
      flex-direction: row;

      .servicios__texto {
        width: 33.33%;
        margin: 20px;
        font-size: 50px;
        font-weight: bold;
      }

      .servicios__card {
        width: 33.33%;
        border: 2px solid;
        margin: 20px;

        .servicios__icono {
          img {
            vertical-align: middle;
            height: 80px;
            padding: 20px 10px 10px 25px;
          }
        }

        .servicios__card-titulo {
          font-size: 32px;
          padding: 20px 10px 10px 25px;
          font-weight: bold;
        }

        .servicios__card-texto {
          padding: 10px 10px 10px 25px;
        }
      }
    }
  }
}

@media (max-width: 700px) {
  .servicios {
    &__contenedor {
      width: 100%;
      padding: 0 10px;

      .servicios__fila {
        flex-direction: column;
        align-items: center;

        .servicios__texto {
          width: 100%;
          text-align: center;
          font-size: 30px;
          margin: 20px 0;
        }

        .servicios__card {
          width: 100%;
          margin: 10px 0;

          .servicios__icono {
            display: flex !important;
            justify-content: center !important;

            img {
              padding: 10px 10px 0 10px;
              height: 60px;
            }
          }

          .servicios__card-titulo {
            font-size: 24px;
            padding: 10px 10px 0 10px;
            text-align: center;
          }

          .servicios__card-texto {
            padding: 10px;
            text-align: center;
          }
        }
      }
    }
  }
}

.blue {
  background-color: #accad440;
  border-color: #006485;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
}

.green {
  background: #9fc9a247;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
}

.tt-svr {
  color: #002b00;
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
}
</style>

