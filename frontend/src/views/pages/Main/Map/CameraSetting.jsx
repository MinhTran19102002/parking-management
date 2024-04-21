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
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const DEFAULT_CAMERA = {
  location: {
    top: 0,
    left: 0,
    iconId: 'hori'
  }
};

function CameraSetting({ zone, cameraUsed, editManyCameras }, ref) {
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
          setCameras((pre) => [...pre, { ...cameraData, zone, ...DEFAULT_CAMERA }]);
        },
        onEditManyCameras() {
          editManyCameras(cameras);
        }
      };
    },
    [JSON.stringify(cameras)]
  );

  useEffect(() => {
    setCameras(cameraUsed);
  }, [cameraUsed]);

  console.log('cameraSetting render');

  return (
    <div id="cameraSetting" onDrop={onDropCamera} onDragOver={(e) => e.preventDefault()}>
      {zone &&
        cameras.map((camera, ix) => {
          return (
            <CameraPointA
              key={'camera' + ix}
              style={{
                position: 'absolute',
                display: camera.zone !== zone && 'none'
              }}
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

const CameraPointA = ({ camera, cameras, setCameras, zone, style, ...props }) => {
  const draggbleRef = useRef(null);
  const drapObj = useDraggable(draggbleRef, {
    defaultPosition: { x: camera.location.left, y: camera.location.top }
  });
  const { isDragging, dragState = {} } = drapObj;
  console.log('CameraPoint render', camera.cameraId);

  useEffect(() => {
    if (!isDragging) {
      const { offsetX: left, offsetY: top } = dragState || {};
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
        if (pos === -1) return;
        else {
          const cameraRs = cameras.slice();
          cameraRs.splice(pos, 1, newCamera);
          setCameras(cameraRs);
        }
      }
    }
  }, [isDragging]);

  return (
    <CameraPoint ref={draggbleRef}>
      {/* <Button
          icon={<DeleteOutlined />}
          danger
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('on Remove camera');
          }}
        /> */}
      <p>{camera.cameraId}</p>
      <div className="handle">
        <CameraVer />
      </div>
    </CameraPoint>
  );
};

export default forwardRef(CameraSetting);
