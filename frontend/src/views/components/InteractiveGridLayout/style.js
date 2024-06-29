import styled from "styled-components";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

export const ResponsiveGridLayoutStyled = styled(ResponsiveGridLayout)`
    .react-grid-item.react-grid-placeholder {
        background: rgba(255, 255, 255, 0.4);
        border-radius: 8px;
    }

    .react-resizable-handle.react-resizable-handle-se {
        color: #fff;
        &:after {
            border-right-color: 
        }
    }
`