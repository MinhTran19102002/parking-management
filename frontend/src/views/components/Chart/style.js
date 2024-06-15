import styled, { useTheme } from "styled-components";

export const BlockPieChart = styled.div`
display: flex;
justify-content: center;
flex-flow: row;
text-align: center;
height: 100%;

> div {
  height: 100%;
  width: 100%;
}

.chart-container {
  display: flex;
  align-items: flex-start;
}

.chart-container .ant-legend {
  width: 100%;
}

.chart-wrapper {
  & div {
    color: ${({ theme }) => theme.colors.text}!important;
  }
}
.circle-container {
  position: absolute;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 50%;
}
.g2-html-annotation {
  white-space: nowrap !important;
  // background-color: #ffffff;
}
.legend-container {
  display: flex;
  .legend-wrapper {
    text-align: left;
    display: flex;
    margin: auto 0px;
    flex-direction: column;
    gap: 0.6rem;
    .legend {
      .ant-badge-status {
        width: 150px;
        max-width: 90%;
      }
      .ant-badge-status-dot {
        width: 8px;
        height: 8px;
]      }
      .ant-badge-status-text {
        margin-right: 20px;
        font-size: 1rem;
        color: ${({ theme }) => theme.colors.text};
      }
      b {
        color: ${({ theme }) => theme.colors.text};
        text-align: right;
      }

      .legend-value {
        display: inline-block;
        font-weight: 400;
      }
    }
  }
}
`;

export const BlockColumnChart = styled.div`
  height: 96%;
`;

export const BlockBarChart = styled.div`
  padding: 1rem 1rem;
  height: 100%;
`;

export const BlockHalfChart = styled.div`
  height: 88%;
  padding: 1rem;
`;

export const BlockLineChart = styled.div`
  height: 100%;
  padding: 10px 16px;
  & canvas {
    height: 100% !important;
  }
`;

export const FooterStyled = styled.div`
  margin-top: 1rem;
  h3 {
    width: 100%;
    text-align: center;
    color: #fff;
    font-weight: 500;
  }
`;


export const BlockDualAxesChart = styled.div`
  height: 98%;

  canvas {
    height: 100%;
  }
`