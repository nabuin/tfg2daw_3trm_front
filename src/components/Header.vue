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
      <div class="header-child-2"></div>
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
                background-image: url('../imgs/icons/Map-Pin.svg');
            }
        }
      }
    }
  
    .header-child-2 {
      height: 100px;
    }
  }
  </style>
  