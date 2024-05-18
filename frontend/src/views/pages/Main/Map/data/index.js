import { SLOTS_C } from './parkingC';
import { SLOTS_B } from './parkingB';
import { SLOTS_A } from './parkingA';

export const GetPlotsInfor = (zone) => {
  let vehicles = [];
  let newWidth = 0;
  let veWidth = 0;
  let height = 100;
  let textStyle = {};
  switch (zone) {
    case 'A':
      vehicles = SLOTS_A;
      newWidth = 40;
      height = 68;
      veWidth = 24;
      textStyle = {
        fontSize: 11
      };
      break;
    case 'B':
      vehicles = SLOTS_B;
      newWidth = 56;
      height = 90;
      veWidth = 34;
      break;
    case 'C':
      vehicles = SLOTS_C;
      newWidth = 54;
      height = 90;
      veWidth = 34;
      break;
  }

  return { slots: vehicles, width: newWidth, height, veWidth, textStyle };
};

export const DISABLED_MAP_INTERACTION = (disabled) => {
  return (
    disabled && {
      disableZoom: true,
      disablePan: true,
      value: {
        scale: 1,
        translation: {
          x: 0,
          y: 0
        }
      }
    }
  );
};

export const CameraLocations = {
  A: [
    {
      cameraId: 'CAM_001',
      location: {
        top: 116,
        left: 464
      }
    },
    {
      cameraId: 'CAM_002',
      location: {
        top: 54,
        left: 12
      }
    }
  ]
};
