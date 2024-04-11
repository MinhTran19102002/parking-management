import { createGlobalStyle, css } from 'styled-components';

export default createGlobalStyle`
    .ant-layout-sider-children {
        display: flex;
        flex-flow: column;
        flex-direction: column;
        padding-bottom: 80px;
    }

    ${'' /* .ant-menu.notCollapsed {
        .ant-menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100px;

            .anticon {
                font-size: 1.6rem;
            }

            .ant-menu-title-content {
                margin-inline-start: 0 !important;
                font-weight: 600;
                font-size: 1.2rem;
            }
        }
    } */}
        
    .ant-image-img {
        border-radius: 8px;
    }

    .ant-card.card-main{
        border-radius: 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: none;

        .ant-card-head {
            padding: 10px 10px 0px;
            border: none;
            min-height: auto;
            .ant-card-head-title {
                display: contents;
                padding: 0;
            }
            .ant-card-extra{
                padding: 0;
            }
        }

        .ant-card-body {
            flex: 1;
            padding: 0 16px;
        }
    }

    .full-screen {
        height: 100vh;
        margin-bottom: 20px;
        text-align: center;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;

        > div {
            transform: translateY(40vh);
        }
    }

    .ant-card {
        &.event-card {
            .ant-card-head {
                min-height: 2.6rem;
                border-bottom-color: transparent;
            }

            .ant-card-body {
                padding: 0.4rem;
            }

            .event-tag {
                position: absolute;
                right: -4px;
                bottom: 4px;
            }
        }
    }

    .ant-table {
        border: 1px solid #f0f0f0;
    }

    .ct-border {
        border: 1px solid #f0f0f0;
    }

    .ant-spin-nested-loading {
        &.h-100 {
            > div {
                height: 100%;
            }
        }
    }
`;
