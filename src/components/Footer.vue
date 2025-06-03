<template>
  <div class="footer">
    <div class="footer__logo-container">
      <img class="footer__logo" src="../imgs/logo.png" alt="">
    </div>
    <div class="footer__content">
      <div class="footer__social">
        <div class="footer__social-icons">
          <div class="footer__icon footer__icon--fb">
            <a href="https://www.facebook.com/profile.php?id=61575937731949" target="_blank" rel="noopener noreferrer">
              <img src="../imgs/social/fb.svg" alt="">
            </a>
          </div>
          <div class="footer__icon footer__icon--ig">
            <a href="https://www.instagram.com/coworkingzaragozaoficial/" target="_blank" rel="noopener noreferrer">
              <img src="../imgs/social/ig.svg" alt="">
            </a>
          </div>
          <div class="footer__icon footer__icon--in">
            <a href="https://www.linkedin.com/in/nicolas-undefined-207812362/" target="_blank" rel="noopener noreferrer">
              <img src="../imgs/social/in.svg" alt="">
            </a>
          </div>
          <div class="footer__icon footer__icon--tw">
            <a href="https://x.com/CoworkingZgzOf" target="_blank" rel="noopener noreferrer">
              <img src="../imgs/social/tw.svg" alt="">
            </a>
          </div>
          <div class="footer__icon footer__icon--x">
            <a href="https://x.com/CoworkingZgzOf" target="_blank" rel="noopener noreferrer">
              <img src="../imgs/social/x.svg" alt="">
            </a>
          </div>
          <div class="footer__icon footer__icon--yt">
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <img src="../imgs/social/yt.svg" alt="">
            </a>
          </div>
        </div>
      </div>
      <div class="footer__info">
        <div class="footer__info-block footer__info-block--contact">
          <div class="footer__info-item footer__info-item--phone">
            <h6>691236425</h6>
          </div>
          <div class="footer__info-item footer__info-item--email">
            <h6>Cooworking Las Fuentes</h6>
          </div>
        </div>
        <div class="footer__info-block footer__info-block--location">
          <div class="footer__info-item footer__info-item--address">
            <h6>coworkingzgzdaw@gmail.com 67</h6>
          </div>
          <div class="footer__info-item footer__info-item--hours">
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
  padding-top: 25px;

  &__logo-container {
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__logo {
    height: 120px;
  }

  &__content {
    width: 70%;
    height: 0 !important;
    position: relative;

    .footer__social {
      height: 50px;
      width: 100%;
      top: -25px;
      position: relative;
      display: flex;
      justify-content: flex-end;
      z-index: 1;

      &-icons {
        height: 100%;
        width: 400px;
        background: white;
        border-radius: 100px 0 0 100px;
        border: 2px solid #234b59;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 25px;
      }
    }

    .footer__info {
      position: relative;
      height: 150px;
      bottom: 50px;
      border: 1px solid;
      border-radius: 75px 0 0 0;
      background: #234b59;
      display: flex;
      flex-direction: row;

      &-block {
        height: 100%;
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &--contact,
        &--location {
          .footer__info-item {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            gap: 10px;

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

            &--phone::before {
              background-image: url('../imgs/icons/phone.svg');
            }

            &--email::before {
              background-image: url('../imgs/icons/email.svg');
            }

            &--address::before {
              background-image: url('../imgs/icons/ubi.svg');
            }

            &--hours::before {
              background-image: url('../imgs/icons/clock.svg');
              filter: invert(1);
            }
          }
        }
      }
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    padding-top: 0;

    &__logo-container {
      width: 100%;
      height: 50%;
      padding: 40px;
    }

    &__content {
      width: 100%;
      height: 50%;

      .footer__info {
        border-radius: 0;
      }
    }
  }

  @media (max-width: 500px) {
    .footer__info {
      flex-direction: column !important;

      .footer__info-block {
        width: 100% !important;
        height: 50% !important;

        &--contact {
          padding-top: 40px !important;
        }
      }
    }
  }
}
</style>

