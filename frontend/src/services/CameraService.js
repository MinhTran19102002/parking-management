import CameraVer from '~/assets/images/camera/type=ver.svg?react';
import Camera360 from '~/assets/images/camera/type=360.svg?react';
import CameraHori from '~/assets/images/camera/type=hori.svg?react';
import Icon from '@ant-design/icons';

const CAMERA_ICONIDS = ['ver', 'hori', 'cam360'];
const CAMERA_ICONS = {
  ver: <CameraVer className="w-100 h-100" />,
  hori: <CameraHori className="w-100 h-100" />,
  cam360: <Camera360 className="w-100 h-100" />
};
export default {
  LimitSize: { minHeight: 40, minWidth: 40, maxHeight: 100, maxWidth: 100 },
  GetIconIds: () => CAMERA_ICONIDS,
  GetIcons: () => CAMERA_ICONS,
  GetIconByIdIcon: (iconId, className) => (
    <div className='camera-point-inner' style={{ backgroundColor: '#e08516', border: '0.2em solid #063443', borderRadius: 8 }}>
      {CAMERA_ICONS[iconId]}
    </div>
  )
};
