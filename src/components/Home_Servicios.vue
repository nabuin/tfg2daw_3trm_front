<template>

    <div class="servicios-block">

        <div class="servicios-block_height-horiz">

            <div class="servicios-block_height-horiz_block">
                <div class="servicios-block_height-horiz-text">
                    <div class="title">Servicios para nuestros usuarios</div>
                </div>
                <div class="servicios-block_height-horiz-card">
                    <div class="icon"><img src="../imgs/service/air.svg" alt=""></div>
                    <div class="title">Aire</div>
                    <div class="text">Todas las zonas de nuestras instalaciones disponen de servicios de aire acondicionado para cuando sea necesario</div>
                </div>
                <div class="servicios-block_height-horiz-card">
                    <div class="icon"><img src="../imgs/service/cocina.svg" alt=""></div>
                    <div class="title">Cocina</div>
                    <div class="text">Aparte de las zonas de trabajo, les disponemos de una zona de cocina, en la que aparte de prepara y calentar comida, podran pasar tiempo con sus compañeros</div>
                </div>
            </div>

            <div class="servicios-block_height-horiz_block">
                <div class="servicios-block_height-horiz-card">
                    <div class="icon"><img src="../imgs/service/pcs.svg" alt=""></div>
                    <div class="title">PCs</div>
                    <div class="text">En caso de que tu o tu equipo no dispongais de un equipo para poder trabajar, nosotros podemos proporcionarselo</div>
                </div>
                <div class="servicios-block_height-horiz-card">
                    <div class="icon"><img src="../imgs/service/seguridad.svg" alt=""></div>
                    <div class="title">Seguridad</div>
                    <div class="text">Disponemos de un equipo de vigilancia las 24 horas del dia, para asegurarnos de que no ocurra ningun altercado desafortunados a nuestros usuarios</div>
                </div>
                <div class="servicios-block_height-horiz-card">
                    <div class="icon"><img src="../imgs/service/wifi.svg" alt=""></div>
                    <div class="title">Internet</div>
                    <div class="text">Todas nuestas instalaciones disponen de un servicio a internet siempre que sea requerido, que el maximo nivel de seguridad</div>
                </div>
            </div>
        </div>

    </div>

</template>

<style scoped lang="scss">
.servicios-block {
  .servicios-block_height-horiz {
    height: auto;
    margin: 50px 500px;

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
</style>