import { Card } from 'antd';
import styled from 'styled-components';

export const MultiCardStyled = styled.div`
  border-radius: 8px;

  .multi-card-header {
    padding: 8px 16px;
  }
  .multi-card-header-title {
  }

  .multi-card-body {
    padding: 8px 16px;
  }
`;

export const CustomedCard = styled(Card)`
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  &.bg {
  }

  &.border {
    border-color: transparent !important;
  }

  &.no-border {
    border-color: transparent !important;
  }

  .card-header {
    padding: 8px 16px;

    &.border-bottom {
    }
  }
  .card-header-title {
  }
  .card-body {
    flex: 1;
    overflow: auto;
  }

  .loading-state {
    &.skeleton {
      margin: auto;
    }
  }

  .layout-flex-center {
    height: 100%;
    display: flex;
  }
`;

export const HeaderCardStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  width: 100%;

  .col {
    &.left {
      display: flex;
      align-items: center;
      gap: 8px;

      .anticon {
        font-size: 1.6rem;
      }
    }
  }
`;

export const CardContainerStyled = styled.div`
  padding: 8px 16px;

  .ant-table-cell {
    padding: 12px 16px;
  }
`;

export const InnerCard = styled.div`
  border-radius: 8px;
  border: 1px solid #000000;

  .card-inner-header {
    padding: 4px 8px;
    border-bottom: 1px solid #000000;
  }

  .card-inner-body {
    .card-inner-body-item {
      border-radius: 8px;
      ${'' /* border: 1px solid #000000; */}
    }
  }
`;

export const SingleChartStyled = styled.div`
  border-radius: 8px;

  .single-card-header {
    padding: 8px 16px;
  }
  .single-card-header-title {
  }

  .single-card-body {
    padding: 8px 16px;
  }
`;
