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
