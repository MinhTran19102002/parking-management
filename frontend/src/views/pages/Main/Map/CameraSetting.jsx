import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
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
import { Button, Space } from 'antd';
import { DeleteOutlined, RetweetOutlined } from '@ant-design/icons';

const DEFAULT_CAMERA = {
  location: {
    top: 0,
    left: 0,
    iconId: 'hori'
  }
};

function CameraSetting({ zone, cameraUsed, editManyCameras, onRemoveCameraFormMap }, ref) {
  const [cameras, setCameras] = useState([...cameraUsed]);
  const isEdit = useRef(false);
  const draggbleRef = useRef(null);
  const drapObj = useDraggable(draggbleRef);

  const onDropCamera = (e) => {
    e.preventDefault();
    const cameraDroped = JSON.parse(e.dataTransfer.getData('cameraData'));
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

  const hanldeDeleteCameraFromMap = (camera) => {
    console.log(camera.cameraId);
    setCameras((prev) => prev.filter((cameraItem) => cameraItem?.cameraId !== camera?.cameraId));
    onRemoveCameraFormMap(camera);
  };

  console.log('cameraSetting render');

  return (
    <div id="cameraForm" onDrop={onDropCamera} onDragOver={(e) => e.preventDefault()}>
      {useMemo(() => {
        return cameras.map((camera, ix) => (
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
            extra={
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
                onClick={() => hanldeDeleteCameraFromMap(camera)}
              />
            }
          />
        ));
      }, [zone, cameras])}
    </div>
  );
}

const CAMERA_ICONS = {
  ver: <CameraVer />,
  hori: <CameraHori />,
  cam360: <Camera360 />
};

const CAMERA_ICONIDS = ['ver', 'hori', 'cam360'];
const CameraPointA = ({ camera, cameras, setCameras, zone, extra, style, ...props }) => {
  const draggbleRef = useRef(null);
  const [position, setPosition] = useState({
    x: camera?.location?.left || 0,
    y: camera?.location?.top || 0
  });
  const [cameraIconId, setCameraIconId] = useState(camera?.iconId || 'ver');
  const drapObj = useDraggable(draggbleRef, {
    position,
    handle: '.dragPoint',
    onDrag: ({ offsetX, offsetY }) => setPosition({ x: offsetX, y: offsetY })
  });
  const { isDragging, dragState = {} } = drapObj;
  console.log('camera render', camera);

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

  useLayoutEffect(() => {
    setPosition({
      x: camera?.location?.left || 0,
      y: camera?.location?.top || 0
    });
  }, [JSON.stringify(camera)]);

  const hanldeChangeIcon = () => {
    let index = CAMERA_ICONIDS.findIndex((el) => el === cameraIconId);
    if (index === CAMERA_ICONIDS.length - 1) index = 0;
    else index++;
    setCameraIconId(CAMERA_ICONIDS[index]);
  };

  return (
    <CameraPoint ref={draggbleRef} style={style}>
      <Space.Compact
        direction="vertical"
        style={{ position: 'absolute', transform: 'translate(100%, 0%)', top: 0, right: 0 }}>
        <Button
          icon={<RetweetOutlined />}
          size="small"
          style={{ borderColor: '#0958d9', color: '#0958d9' }}
          onClick={hanldeChangeIcon}
        />
        {extra}
      </Space.Compact>
      <div className="dragPoint">
        <p>{camera.cameraId}</p>
        {CAMERA_ICONS[cameraIconId]}
      </div>
    </CameraPoint>
  );
};

export default forwardRef(CameraSetting);
