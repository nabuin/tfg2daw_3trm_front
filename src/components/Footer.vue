<template>

  <div class="footer">
    <div class="footer-child-1">
      <img src="../imgs/logo.svg" alt="">
    </div>
    <div class="footer-child-2">
      <div class="footer-child-2_social">
        <div class="footer-child-2_social-icons">
          <div class="icon-fb"><img src="../imgs/social/fb.svg" alt=""></div>
          <div class="icon-ig"><img src="../imgs/social/ig.svg" alt=""></div>
          <div class="icon-in"><img src="../imgs/social/in.svg" alt=""></div>
          <div class="icon-tw"><img src="../imgs/social/tw.svg" alt=""></div>
          <div class="icon-x"><img src="../imgs/social/x.svg" alt=""></div>
          <div class="icon-yt"><img src="../imgs/social/yt.svg" alt=""></div>
        </div>
      </div>
      <div class="footer-child-2_info">
        <div class="footer-child-2_info-block_1">
          <div class="footer-child-1_phone">
            <h6>691236425</h6>
          </div>
          <div class="footer-child-1_email">
            <h6>Cooworking Las Fuentes</h6>
          </div>
        </div>
        <div class="footer-child-2_info-block_2">
          <div class="footer-child-1_ubi">
            <h6>C/ Rodrigo Rebolledo 67</h6>
          </div>
          <div class="footer-child-1_hour">
            <h6>De 8:00 a 16:00</h6>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.footer {

  height: 150px;
  width: 100%;
  display: flex;
  flex-direction: row;

  .footer-child-1 {
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer-child-2 {
    width: 70%;
    height: 100%;
    position: relative;

    .footer-child-2_social {
      height: 50px;
      width: 100%;
      background: rgba(255, 0, 0, 0);
      top: -25px;
      position: relative;
      display: flex;
      justify-content: flex-end;
      z-index: 1;

      .footer-child-2_social-icons {
        height: 100%;
        width: 400px;
        background: white;
        border-radius: 100px 0 0 100px;
        border: 2px solid;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 25px;
      }
    }

    .footer-child-2_info {
      position: relative;
      height: 150px;
      bottom: 50px;
      border: 1px solid;
      border-radius: 75px 0 0 0;
      background: black;
      display: flex;
      flex-direction: row;

      .footer-child-2_info-block_1 {
        height: 100%;
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .footer-child-1_phone,
        .footer-child-1_email {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;

          &::before {
            content: "";
            display: inline-block;
            width: 17px;
            height: 17px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-bottom: 2px;
          }
        }

        .footer-child-1_phone::before {
          background-image: url('../imgs/icons/phone.svg');
        }

        .footer-child-1_email::before {
          background-image: url('../imgs/icons/email.svg');
        }
      }

      .footer-child-2_info-block_2 {
        height: 100%;
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .footer-child-1_ubi,
        .footer-child-1_hour {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;

          &::before {
            content: "";
            display: inline-block;
            width: 17px;
            height: 17px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-bottom: 2px;
          }
        }

        .footer-child-1_ubi::before {
          background-image: url('../imgs/icons/ubi.svg');
        }

        .footer-child-1_hour::before {
          background-image: url('../imgs/icons/clock.svg');
          filter: invert(1);
        }
      }
    }
  }


  @media (max-width:900px) {


    display: flex;
    flex-direction: column;
    height: auto;

    .footer-child-1 {
      width: 100%;
      height: 50%;

      padding: 40px;
    }

    .footer-child-2 {
      width: 100%;
      height: 50%;

      .footer-child-2_info {
        border-radius: 0;
      }
    }

  }

  @media (max-width:500px) {
    .footer-child-2_info {
      display: flex !important;
      flex-direction: column !important;

      .footer-child-2_info-block_1 {
        width: 100% !important;
        height: 50% !important;

        padding-top: 40px !important;
      }

      .footer-child-2_info-block_2 {
        width: 100% !important;
        height: 50% !important;
      }
    }
  }

}
</style>
