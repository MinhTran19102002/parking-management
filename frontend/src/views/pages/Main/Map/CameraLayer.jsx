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

function CameraLayer({ zone }) {
  const { actions } = useContext(AppContext);
  const isMounted = useRef(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const draggableRef = useRef(null);
  const drapObj = useDraggable(draggableRef);

  useEffect(() => {
    console.log('drapObj', drapObj);
  }, [drapObj]);

  const callApi = async () => {
    try {
      const api = await CameraApi.getByFilter({ zone });
      setData(api.data);
      isMounted.current = true;
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApi();
  }, [zone]);

  const DefaultCameraLocation = CameraLocations[zone] || [];
  return (
    <div id="cameraLayer" ref={draggableRef}>
      {data.map((camera, ix) => {
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

const getCameraIcon = (type) => {
  if (type === 'ver') return <CameraVer />;
  else if (type === 'hori') return <CameraHori />;
  else if (type === '360') return <Camera360 />;
  else <CameraVer />;
};
export default CameraLayer;
