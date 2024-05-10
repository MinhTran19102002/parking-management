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
import { CameraPoint } from '../style';
import { CameraLocations } from '../data/data';
import { useDraggable } from '@neodrag/react';
import CameraSide from './CameraSide';
import { Button, Space, theme } from 'antd';
import Icon, { DeleteOutlined, RetweetOutlined } from '@ant-design/icons';
// import { ResizableBox, Resizable } from 'react-resizable';
import { Resizable } from 're-resizable';
import CameraService from '~/services/CameraService';

const DEFAULT_CAMERA = {
  slots: [],
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
          setCameras([{ ...cameraData, zone, ...DEFAULT_CAMERA }, ...cameras]);
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
    setCameras((prev) => prev.filter((cameraItem) => cameraItem?.cameraId !== camera?.cameraId));
    onRemoveCameraFormMap(camera);
  };

  const onChangeCamera = (index, newCamera) => {
    const rs = cameras.slice();
    rs[index] = newCamera;
    setCameras(rs);
  };

  const onChangeLocation = (index, location) => {
    const rs = cameras.slice();
    rs[index] = {
      ...rs[index],
      location: {
        ...DEFAULT_POSITION,
        ...location
      }
    };

    setCameras(rs);
  };

  return (
    <div id="cameraForm" onDrop={onDropCamera} onDragOver={(e) => e.preventDefault()}>
      {useMemo(() => {
        return cameras.map((camera, ix) => (
          <CameraPointA
            index={ix}
            key={'camera' + camera._id + ix}
            style={{
              position: 'absolute',
              display: camera.zone !== zone && 'none'
            }}
            camera={camera}
            setCameras={setCameras}
            cameras={cameras}
            zone={zone}
            onChangeCamera={onChangeCamera}
            onChange={onChangeLocation}
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

const CAMERA_ICONS = CameraService.GetIcons();
const DEFAULT_POSITION = { width: 64, height: 64, top: 0, left: 0, iconId: 'ver' };
const CAMERA_ICONIDS = CameraService.GetIconIds();
const CameraPointA = ({
  camera,
  cameras,
  setCameras,
  zone,
  onChangeCamera,
  extra,
  index,
  style,
  onChange,
  ...props
}) => {
  const { location = {} } = camera;
  const { width, height, top, left, iconId } = location || DEFAULT_POSITION;
  const draggbleRef = useRef(null);
  const { token } = theme.useToken();
  const drapObj = useDraggable(draggbleRef, {
    defaultPosition: {
      x: left,
      y: top
    },
    handle: '.dragPoint',
    onDragEnd: ({ offsetX, offsetY }) =>
      onChange(index, { ...location, top: offsetY, left: offsetX })
  });

  const hanldeChangeIcon = () => {
    let ix = CAMERA_ICONIDS.findIndex((el) => el === iconId);
    if (index === CAMERA_ICONIDS.length - 1) ix = 0;
    else ix++;
    onChange(index, { ...location, iconId: CAMERA_ICONIDS[ix] });
  };

  const onChangeSize = ({ width: addWidth, height: addHeight }) => {
    let newW = width + addWidth;
    let newH = height + addHeight;
    onChange(index, { ...location, width: newW, height: newH });
  };

  const icon = CameraService.GetIconByIdIcon(iconId);

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
      <Resizable
        {...CameraService.LimitSize}
        lockAspectRatio={1}
        onResizeStop={(_, __, ___, delta) => onChangeSize(delta)}
        enable={{ topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}>
        <div
          className="dragPoint box w-100 h-100"
          style={{
            border: `solid 1px transparent`
          }}>
          {icon}
        </div>
      </Resizable>
    </CameraPoint>
  );
};

export default forwardRef(CameraSetting);
