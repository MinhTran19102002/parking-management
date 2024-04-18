import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { CameraApi } from '~/api';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import CameraVer from '~/assets/images/camera/type=ver.svg?react';
import Camera360 from '~/assets/images/camera/type=360.svg?react';
import CameraHori from '~/assets/images/camera/type=hori.svg?react';
import { CameraPoint } from './style';
import { CameraLocations } from './data';
import { useDraggable } from '@neodrag/react';
import CameraSide from './CameraSide';

const DEFAULT_CAMERA = {
  location: {
    top: 0,
    left: 0,
    iconId: 'hori'
  }
};

function CameraSetting({ zone, settingMode, cameraUnused, cameraUsed }, ref) {
  const [cameras, setCameras] = useState([]);
  const draggbleRef = useRef(null);
  const drapObj = useDraggable(draggbleRef);

  const onDropCamera = (e) => {
    e.preventDefault();
    const cameraDroped = JSON.parse(e.dataTransfer.getData('cameraData'));
    console.log(cameraDroped);
  };

  const DefaultCameraLocation = CameraLocations[zone] || [];

  useImperativeHandle(
    ref,
    () => {
      return {
        addCameraToZone(cameraData, zone) {
          setCameras((pre) => [...pre, { ...cameraData, ...DEFAULT_CAMERA }]);
        }
      };
    },
    []
  );

  useEffect(() => {
    console.log('change Drap', drapObj);
  }, [drapObj]);

  return (
    <div
      id="cameraForm"
      onDrop={onDropCamera}
      onDragOver={(e) => e.preventDefault()}>
      {cameras.map((camera, ix) => {
        const defaultLocation =
          DefaultCameraLocation.find((el) => el.cameraId === camera.cameraId)?.location || {};
        return (
          <CameraPoint key={'camera' + ix} style={{ position: 'absolute', ...defaultLocation }}>
            <CameraVer />
          </CameraPoint>
        );
      })}
      <CameraPoint ref={draggbleRef} key={'camera'} style={{ position: 'absolute', ...DEFAULT_CAMERA.location }}>
        <CameraVer />
      </CameraPoint>
    </div>
  );
}

export default forwardRef(CameraSetting);
