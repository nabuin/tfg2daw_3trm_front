<script></script>

<template>
    <div class="info">
        <div class="info__center">
            <div class="info__left">
                <div class="info__image">
                    <img src="../imgs/others/jovenes.png" alt="">
                </div>
            </div>
            <div class="info__right">
                <div class="info__text">
                    <div class="info__title">¡Bienvenido a WorkHub!</div>
                    <div class="info__description">
                        Aquí empieza tu nueva aventura emprendedora. En nuestro espacio, diseñado especialmente para
                        startups y mentes inquietas como la tuya, encontrarás más que escritorios y WiFi: descubrirás
                        una comunidad vibrante, un entorno que impulsa la creatividad y todas las herramientas
                        necesarias para hacer despegar tu proyecto.
                        <br><br>
                        Conecta, colabora y crece junto a otros emprendedores que, como tú, están transformando ideas en
                        realidades. Bienvenido a un lugar donde el futuro se construye cada día.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
.info {
    padding: 25px 0 50px 0;

    &__center {
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 50px 0;

        &::before,
        &::after {
            content: "";
            position: absolute;
            left: 10%;
            right: 10%;
            height: 2px;
            background-color: #000;
        }

        &::before {
            top: 0;
        }

        &::after {
            bottom: 0;
        }

        @media (min-width: 1161px) {
            flex-direction: row;
            height: 500px;
        }
    }

    &__left {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;

        @media (min-width: 1161px) {
            width: 50%;
            justify-content: flex-end;
        }
    }

    &__image {
        width: 350px;
        height: 200px;
        max-width: 500px;
        max-height: 300px;
        margin-bottom: 10px;
        position: relative;

        @media (min-width: 601px) {
            width: 500px;
            height: 300px;
        }

        @media (min-width: 1161px) {
            margin-right: 25px;
            margin-bottom: 0;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }

    &__right {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;

        @media (min-width: 1161px) {
            width: 50%;
            justify-content: flex-start;
        }
    }

    &__text {
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 10px;

        @media (min-width: 601px) {
            width: 430px;
        }

        @media (min-width: 1161px) {
            margin-left: 25px;
            margin-top: 0;
        }
    }

    &__title {
        padding: 10px;
        font-weight: 700;
        font-size: 32px;

        @media (min-width: 1161px) {
            font-size: 40px;
        }
    }

    &__description {
        padding: 10px;
    }
}

</style>