import styled, { css } from 'styled-components';
import { Image, Popover } from 'antd';

export const SlotStyled = styled.div`
  height: 100px;
  border: solid 1px #666;
  border-radius: 4px;
  position: absolute;

  &:hover {
    border-color: #000;
  }

  .slot-id {
  }
`;

export const TransformBlock = styled.div`
  height: 96%;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fff;

  @keyframes flashing {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .flashing {
    animation: flashing 0.7s infinite; /* The 'infinite' value will make the animation loop indefinitely */
  }
  .slot {
    position: absolute;
  }

  .map-wrapper {
  }

  .image-container {
    position: absolute;
    z-index: 3;
    transition: transform 0.2s;
    animation: loadingAnimation 1s forwards ease-in-out;
    animation-delay: 10s;
    @keyframes loadingAnimation {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const DetailFloorStyled = styled(Popover)`
  .ant-popover-content {
    border: 1px solid #000;
  }
`;

export const InnerDetailFloorStyled = styled.div`
  span.label {
    color: ${({ theme }) => theme.colorTextSecondary};
  }
`;

export const CameraPoint = styled.div`
  &.selected-camera {
    .camera-point-inner {
      background-color: #b36709 !important;
    }
  }
  &:hover {
    opacity: 0.8;
  }
`;

export const CameraSidebarStyled = styled.div`
  button {
    display: block;
    margin-left: auto;
  }
`;
