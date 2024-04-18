import React, { useContext, useEffect, useRef, useState } from 'react';
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

function CameraSetting({ zone, settingMode, cameraUnused, cameraUsed }) {
  const [cameras, setCameras] = useState([]);
  const draggbleRef = useRef(null);
  const drapObj = useDraggable(draggbleRef);
  const onDropCamera = (e) => {
    e.preventDefault();
    const cameraDroped = JSON.parse(e.dataTransfer.getData('cameraData'));
    console.log(cameraDroped);
  };

  const DefaultCameraLocation = CameraLocations[zone] || [];

  console.log('CameraSetting Render');
  return (
    <div
      id="cameraForm"
      ref={draggbleRef}
      onDrop={onDropCamera}
      onDragOver={(e) => e.preventDefault()}>
      {<CameraSide data={cameraUnused} />}
      {cameras.map((camera, ix) => {
        const defaultLocation =
          DefaultCameraLocation.find((el) => el.cameraId === camera.cameraId)?.location || {};
        return (
          <CameraPoint key={'camera' + ix} style={{ position: 'absolute', ...defaultLocation }}>
            <CameraVer />
          </CameraPoint>
        );
      })}
    </div>
  );
}

export default CameraSetting;
