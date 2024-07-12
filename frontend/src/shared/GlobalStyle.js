import { createGlobalStyle } from 'styled-components';
import LexendThinFont from '~/assets/fonts/lexend/Lexend-Thin.ttf';
import LexendLightFont from '~/assets/fonts/lexend/Lexend-Light.ttf';
import LexendRegularFont from '~/assets/fonts/lexend/Lexend-Regular.ttf';
import LexendMediumFont from '~/assets/fonts/lexend/Lexend-Medium.ttf';
import LexendSemiBoldFont from '~/assets/fonts/lexend/Lexend-SemiBold.ttf';
import LexendBoldFont from '~/assets/fonts/lexend/Lexend-Bold.ttf';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    @font-face {
        font-family: 'lexend';
        font-display: block;
        font-style:normal;
        src: url(${LexendRegularFont})  format('truetype');
    }
    @font-face {
        font-family: 'lexend';
        font-weight: 300;
        font-display: block;
        src: url(${LexendLightFont})  format('truetype');
    }
    @font-face {
        font-family: 'lexend';
        font-weight: 500;
        font-display: block;
        src: url(${LexendMediumFont})  format('truetype');
    }

    @font-face {
        font-family: 'lexend';
        font-weight: 600;
        font-display: block;
        src: url(${LexendSemiBoldFont})  format('truetype');
    }
    @font-face {
        font-family: 'lexend';
        font-weight: 700;
        font-display: block;
        src: url(${LexendBoldFont})  format('truetype');
    }

    :root {
        font-size: 14px;
        --bg-main-color: linear-gradient(360deg, #040B2D 0%, #0C2163 53.65%, #103258 100%);
    }


    iframe#webpack-dev-server-client-overlay{display:none!important}

    body {
        font-family: 'Lexend', sans-serif;
    }

    html {
        font-size: 62.5%;
    }

    a {
        text-decoration: none;
    }
    
    img{
        object-fit: contain;
    }

    .border-none: {
        border: none;
    }

    .border-1 {
        border-radius: 8px;
    }

    .k-card {
        border-radius: 8px;
        &.hide-header {
            .k-card-header {
                display: none;
            }
        }

        .k-card-body {
            padding-inline: 0;
            padding-block: 0;
        }
    }

    .card {
        padding: 16px;
        border-radius: 8px;
    }

    .border-radius-default {
        border-radius-default: 8px;
    }

    .no-border {
        border: none;
    }

    .hover-default:hover {
        background: ${({ theme }) => theme.colorBgTextHover};
    }

    .react-resizable {
    position: relative;
    }

    .react-resizable-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-origin: content-box;
        box-sizing: border-box;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+');
        background-position: bottom right;
        padding: 0 3px 3px 0;
    }
    .react-resizable-handle-sw {
        bottom: 0;
        left: 0;
        cursor: sw-resize;
        transform: rotate(90deg);
    }
    .react-resizable-handle-se {
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }
    .react-resizable-handle-nw {
        top: 0;
        left: 0;
        cursor: nw-resize;
        transform: rotate(180deg);
    }
    .react-resizable-handle-ne {
        top: 0;
        right: 0;
        cursor: ne-resize;
        transform: rotate(270deg);
    }
    .react-resizable-handle-w,
    .react-resizable-handle-e {
        top: 50%;
        margin-top: -10px;
        cursor: ew-resize;
    }
    .react-resizable-handle-w {
        left: 0;
        transform: rotate(135deg);
    }
    .react-resizable-handle-e {
        right: 0;
        transform: rotate(315deg);
    }
    .react-resizable-handle-n,
    .react-resizable-handle-s {
        left: 50%;
        margin-left: -10px;
        cursor: ns-resize;
    }
    .react-resizable-handle-n {
        top: 0;
        transform: rotate(225deg);
    }
    .react-resizable-handle-s {
        bottom: 0;
        transform: rotate(45deg);
    }

    .k-tilelayout {
        background-color: transparent;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .cursor-move {
        cursor: move;
    }
`;
