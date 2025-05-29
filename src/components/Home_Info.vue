<script></script>

<template>

    <div class="div-block-info">
        <div class="div-block-info_center">
            <div class="div-block-info_center-left">
                <div class="div-block-info_center-image">
                    <img src="../imgs/others/jovenes.png" alt="">
                </div>
            </div>
            <div class="div-block-info_center-right">
                <div class="div-block-info_center-text">
                    <div class="div-block-info_center-text_title">¡Bienvenido a WorkHub!</div>

                    <div class="div-block-info_center-text_info">
                        Aquí empieza tu nueva aventura emprendedora. En nuestro espacio, diseñado especialmente para
                        startups y mentes inquietas como la tuya, encontrarás más que escritorios y WiFi: descubrirás
                        una comunidad vibrante, un entorno que impulsa la creatividad y todas las herramientas
                        necesarias para hacer despegar tu proyecto.

                        Conecta, colabora y crece junto a otros emprendedores que, como tú, están transformando ideas en
                        realidades. Bienvenido a un lugar donde el futuro se construye cada día.
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
.div-block-info {

    padding: 25px 0 50px 0;

    .div-block-info_center {

        height: 500px;
        display: flex;
        flex-direction: row;
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

        @media (max-width: 1160px) {
            flex-direction: column;
            height: auto;
        }

        .div-block-info_center-left {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            @media (max-width: 1160px) {
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
            }

            .div-block-info_center-image {
                height: 300px;
                width: 500px;
                max-height: 300px;
                max-width: 500px;
                margin-right: 25px;
                position: relative;

                @media (max-width: 1160px) {
                    margin-right: 0;
                    margin-bottom: 10px;
                }

                @media (max-width: 600px) {
                    height: 200px;
                    width: 350px;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
            }
        }

        .div-block-info_center-right {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            @media (max-width: 1160px) {
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
            }


            .div-block-info_center-text {
                width: 430px;
                margin-left: 25px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                @media (max-width: 1160px) {
                    margin-top: 10px;
                    margin-left: 0;
                }

                @media (max-width: 600px) {
                    height: auto;
                    width: 300px;
                }

                .div-block-info_center-text_title {
                    padding: 10px;
                    font-weight: 700;
                    font-size: 40px;
                }

                .div-block-info_center-text_info {
                    padding: 10px;
                }
            }
        }
    }
}
</style>