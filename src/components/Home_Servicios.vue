<template>

  <div class="servicios-block">

    <div class="servicios-block_height-horiz">

      <div class="servicios-block_height-horiz_block">
        <div class="servicios-block_height-horiz-text">
          <div class="title tt-svr">Servicios para nuestros usuarios</div>
        </div>
        <div class="servicios-block_height-horiz-card blue">
          <div class="icon"><img src="../imgs/service/air.svg" alt=""></div>
          <div class="title">Aire</div>
          <div class="text">Todas las zonas de nuestras instalaciones disponen de servicios de aire acondicionado para
            cuando sea necesario</div>
        </div>
        <div class="servicios-block_height-horiz-card green">
          <div class="icon"><img src="../imgs/service/cocina.svg" alt=""></div>
          <div class="title">Cocina</div>
          <div class="text">Aparte de las zonas de trabajo, les disponemos de una zona de cocina, en la que aparte de
            prepara y calentar comida, podran pasar tiempo con sus compañeros</div>
        </div>
      </div>

      <div class="servicios-block_height-horiz_block">
        <div class="servicios-block_height-horiz-card blue">
          <div class="icon"><img src="../imgs/service/pcs.svg" alt=""></div>
          <div class="title">PCs</div>
          <div class="text">En caso de que tu o tu equipo no dispongais de un equipo para poder trabajar, nosotros
            podemos proporcionarselo</div>
        </div>
        <div class="servicios-block_height-horiz-card green">
          <div class="icon"><img src="../imgs/service/seguridad.svg" alt=""></div>
          <div class="title">Seguridad</div>
          <div class="text">Disponemos de un equipo de vigilancia las 24 horas del dia, para asegurarnos de que no
            ocurra ningun altercado desafortunados a nuestros usuarios</div>
        </div>
        <div class="servicios-block_height-horiz-card blue">
          <div class="icon"><img src="../imgs/service/wifi.svg" alt=""></div>
          <div class="title">Internet</div>
          <div class="text">Todas nuestas instalaciones disponen de un servicio a internet siempre que sea requerido,
            que el maximo nivel de seguridad</div>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped lang="scss">
.servicios-block {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0;

  .servicios-block_height-horiz {
    height: auto;
    width: 702px;

    .servicios-block_height-horiz_block {
      height: 50%;
      width: 100%;
      display: flex;
      flex-direction: row;

      .servicios-block_height-horiz-text {
        width: 33.33%;
        margin: 20px;
        font-size: 50px;
        font-weight: bold;
      }

      .servicios-block_height-horiz-card {
        width: 33.33%;
        border: 2px solid;
        margin: 20px;

        .icon {
          img {
            vertical-align: middle;
            height: 80px;
            padding: 20px 10px 10px 25px;
          }
        }

        .title {
          font-size: 32px;
          padding: 20px 10px 10px 25px;
          font-weight: bold;
        }

        .text {
          padding: 10px 10px 10px 25px;
        }
      }
    }
  }
}

@media (max-width: 700px) {
  .servicios-block {
    .servicios-block_height-horiz {
      width: 100%;
      padding: 0 10px;

      .servicios-block_height-horiz_block {
        flex-direction: column;
        align-items: center;

        .servicios-block_height-horiz-text {
          width: 100%;
          text-align: center;
          font-size: 30px;
          margin: 20px 0;
        }

        .servicios-block_height-horiz-card {
          width: 100%;
          margin: 10px 0;

          .icon {

            display: flex !important;
            justify-content: center !important;

            img {
              padding: 10px 10px 0 10px;
              height: 60px;
            }
          }

          .title {
            font-size: 24px;
            padding: 10px 10px 0 10px;
            text-align: center;
          }

          .text {
            padding: 10px;
            text-align: center;
          }
        }
      }
    }
  }
}

.blue{
    background-color: #accad440;
    border-color: #006485;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
}
.green{
    background: #9fc9a247;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
}

.tt-svr{
    color: #002b00;
    text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
}
</style>
