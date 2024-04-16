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

function CameraSetting({ zone, settingMode, cameraUnused, cameraUsed, editManyCameras }, ref) {
  const [cameras, setCameras] = useState([...cameraUsed]);
  const isEdit = useRef(false);
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
        },
        onEditManyCameras() {
          editManyCameras(cameras);
        }
      };
    },
    [JSON.stringify(cameras)]
  );

  useEffect(() => {
    setCameras(cameraUsed)
  }, [cameraUsed]);

  return (
    <div id="cameraForm" onDrop={onDropCamera} onDragOver={(e) => e.preventDefault()}>
      {cameras.map((camera, ix) => {
        const defaultLocation =
          DefaultCameraLocation.find((el) => el.cameraId === camera.cameraId)?.location || {};
        return (
          <CameraPointA
            key={'camera' + ix}
            style={{ position: 'absolute', ...defaultLocation}}
            camera={camera}
            setCameras={setCameras}
            cameras={cameras}
            zone={zone}
          />
        );
      })}
    </div>
  );
}

const CameraPointA = ({ camera, cameras, setCameras, zone, ...props }) => {
  const draggbleRef = useRef(null);
  const drapObj = useDraggable(draggbleRef);
  const { isDragging, dragState = {} } = drapObj;

  useEffect(() => {
    const { offsetX: left = DEFAULT_CAMERA.location.x, offsetY: top = DEFAULT_CAMERA.location.y } =
      dragState || {};
    if (top && left) {
      const newCamera = {
        ...camera,
        zone,
        location: {
          top,
          left
        }
      };
      const pos = cameras.findIndex((el) => el.cameraId === camera.cameraId);
      if (pos === -1)
        setCameras((prev) => {
          prev.push(newCamera);
          return prev;
        });
      else {
        console.log('setCmaeras');
        const rs = cameras.slice();
        rs.splice(pos, 1, newCamera);
        setCameras(rs);
      }
    }
  }, [dragState.offsetX, dragState.offsetY]);

  return (
    <CameraPoint ref={draggbleRef} {...props}>
      <CameraVer />
    </CameraPoint>
  );
};

export default forwardRef(CameraSetting);
