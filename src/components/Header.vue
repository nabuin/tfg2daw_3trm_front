<template>
    <div class="header">
      <div class="header-child-1">
        <div class="header-child-1_left">
          <div class="header-child-1_left_info">
            <h6>Espacio de Cooworking en Zaragoza</h6>
          </div>
        </div>
        <div class="header-child-1_right">
          <div class="header-child-1_right_phone"><h6>691236425</h6></div>
          <div class="header-child-1_right_email"><h6>Cooworking Las Fuentes</h6></div>
          <div class="header-child-1_right_ubi"><h6>C/ Rodrigo Rebolledo 67</h6></div>
        </div>
      </div>
      <div class="header-child-2">
          <div class="header-child-2_left">
            <img src="../imgs/logo.svg">
          </div>

          <div class="header-child-2_mid">
            <div class="header-child-2_mid_heigt">
            <div class="header-child-2_mid_bienvenido">Bienvenido</div>
            <div class="header-child-2_mid_espacios">Espácios</div>
            <div class="header-child-2_mid_precios">Precios</div>
            <div class="header-child-2_mid_servicios">Sérvicios</div>
            <div class="header-child-2_mid_masInfo">Mas Info </div>
            </div>
          </div>

          <div class="header-child-2_right">
            <img src="../imgs/icons/User_Logo.svg">
          </div>
      </div>
    </div>
  </template>

  <style lang="scss" scoped>
  h6{
    color: white;
    margin-bottom: 0;
  }
  .header {
    height: 150px;

    .header-child-1 {

      background-color: black;
      height: 50px;
      display: flex;
      flex-direction: row;

      .header-child-1_left {
        width: 50%;
        height: 100%;

        .header-child-1_left_info {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
        }
      }

      .header-child-1_right {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;

        @media (max-width: 1560px){
          width: 65%;
        }

        .header-child-1_right_phone {
            width: 33%;
            display: flex;
            height: 100%;
            justify-content: flex-end;
            align-items: center;
            position: relative;
            gap: 8px;

            &::before{
                content: "";
                display: inline-block;
                width: 17px;
                height: 17px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                background-image: url('../imgs/icons/phone.svg');
            }
        }
        .header-child-1_right_email {
            width: 33%;
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
            gap: 8px;

            &::before{
                content: "";
                display: inline-block;
                width: 17px;
                height: 17px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                background-image: url('../imgs/icons/email.svg');
            }
        }
        .header-child-1_right_ubi {
            width: 33%;
            display: flex;
            height: 100%;
            justify-content: flex-start;
            align-items: center;
            gap: 8px;

            &::before{
                content: "";
                display: inline-block;
                width: 17px;
                height: 17px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                background-image: url('../imgs/icons/ubi.svg');
            }
        }
      }
    }

    .header-child-2 {
      height: 100px;
      display: flex;
      flex-direction: row;
      background: #e5e5e5;

      .header-child-2_left{
        height: 100%;
        width: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .header-child-2_mid{
        height: 100%;
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        @media (max-width: 1500px){
          width: 60%;
        }


      .header-child-2_mid_heigt{
        display: flex;
        flex-direction: row;
        height: 65px;

        .header-child-2_mid_bienvenido{
          display: flex;
          align-items: center;
          margin: 5px 0px 0 25px;
          padding-right: 25px;
          font-size: 25px;
          font-weight: 500;
          display: flex;
          flex-direction: row;
          border-right: 2px solid black;
        }

        .header-child-2_mid_espacios{
          display: flex;
          align-items: center;
          margin: 5px 0px 0 25px;
          padding-right: 25px;
          font-size: 25px;
          font-weight: 500;
          flex-direction: row;
          border-right: 2px solid black;
        }

        .header-child-2_mid_precios{
          display: flex;
          align-items: center;
          margin: 5px 0px 0 25px;
          padding-right: 25px;
          font-size: 25px;
          font-weight: 500;
          flex-direction: row;
          border-right: 2px solid black;
        }

        .header-child-2_mid_servicios{
          display: flex;
          align-items: center;
          margin: 5px 0px 0 25px;
          padding-right: 25px;
          font-size: 25px;
          font-weight: 500;
          flex-direction: row;
          border-right: 2px solid black;
        }
        .header-child-2_mid_masInfo{
          display: flex;
          align-items: center;
          margin: 5px 0px 0 25px;
          padding: 25px;
          font-size: 25px;
          font-weight: 500;
          border: 2px solid black;

          @media (max-width: 1657px){
            padding: 8px 15px;
            min-width: 150px;
          }

          @media (max-width: 1617px){
            padding: 8px 10px;
            min-width: 175px;
          }

          &::after{
                content: "";
                display: inline-block;
                width: 17px;
                height: 17px;
                margin-left: 15px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                background-image: url('../imgs/icons/arrow.svg');
            }

        }

      }

      }
      .header-child-2_right{
        height: 100%;
        width: 25%;
        display: flex;
        justify-content: center;
        align-items: center;

        @media (max-width: 1500px){
          width: 15%;
        }

        img{
          height: 56px;
          margin-top: 5px;
        }
      }

    }
  }

  /*Menu hamburguesa apartir de 1250px*/
  </style>
