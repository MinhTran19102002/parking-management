import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CameraApi } from '~/api';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import CameraVer from '~/assets/images/camera/type=ver.svg?react';
import Camera360 from '~/assets/images/camera/type=360.svg?react';
import CameraHori from '~/assets/images/camera/type=hori.svg?react';
import { CameraPoint } from '../style';
import { CameraLocations } from '../data';
import { useDraggable } from '@neodrag/react';
import CameraService from '~/services/CameraService';
import { Popover } from 'antd';
import { CameraCard } from '~/views/components';

function CameraLayer({ zone, data = [], onHoverCamera, selectedCameraId, onClick }) {
  const { actions } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const cameras = useMemo(() => {
    return data.filter((el) => el.zone === zone);
  }, [zone, data]);

  return (
    <div id="cameraLayer">
      {cameras.map((camera = {}) => {
        return (
          <CameraPoint
            onClick={() => onClick && onClick(camera.cameraId)}
            onMouseOver={() => onHoverCamera(camera)}
            onMouseOut={() => onHoverCamera({})}
            key={'camera' + camera._id}
            className={`${selectedCameraId === camera.cameraId ? 'selected-camera' : ''}`}
            style={{ position: 'absolute', ...camera.location, ...CameraService.LimitSize }}>
            <Popover content={<CameraCard {...camera} />}>
              {CameraService.GetIconByIdIcon(camera.location.iconId)}
            </Popover>
          </CameraPoint>
        );
      })}
    </div>
  );
}

export default CameraLayer;
