import {
  CarOutlined,
  ContactsOutlined,
  DashboardOutlined,
  InteractionOutlined,
  LineChartOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  CameraOutlined,
  SettingOutlined,
  HistoryOutlined,
  VideoCameraOutlined,
  DollarOutlined
} from '@ant-design/icons';
import Driver from '~/views/pages/Main/Driver';
import Employee from '~/views/pages/Main/Employee';
import Home from '~/views/pages/Main/Home';
import DriverMap from '~/views/pages/DriverPages/Map';
import Event from '~/views/pages/Main/Event';
import UserPage from '~/views/pages/Main/UserPage';
import Staff from '~/views/pages/Main/Staff';
import Camera from '~/views/pages/Main/Camera';
import SettingMap from '~/views/pages/Main/Setting-Map';
import Personal from '~/views/pages/DriverPages/Personal';
import HistoryDriver from '~/views/pages/DriverPages/History';
import CameraStream from '~/views/pages/Main/CameraStream';
import Map from '~/views/pages/Main/Map';
import History from '~/views/pages/Main/History';
import Payment from '~/views/pages/Main/Payment';
// Public routes
const publicRoutes = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    element: <Home />,
    icon: <DashboardOutlined />
  },
  {
    key: 'map',
    label: 'Bản đồ',
    path: '/map',
    element: <Map />,
    icon: <CarOutlined />
  },
  {
    key: 'history',
    label: 'Lịch sử',
    path: '/history',
    element: <History />,
    icon: <HistoryOutlined />
  },
  {
    key: 'cameraStream',
    label: 'Stream Camera',
    path: '/cameraStream',
    element: <CameraStream />,
    icon: <VideoCameraOutlined />
  },
  {
    key: 'driver',
    label: 'Quản lý chủ xe',
    path: '/driver',
    element: <Driver />,
    icon: <UserOutlined />
  },
  {
    key: 'payment',
    label: 'Quản lý payment',
    path: '/payment',
    element: <Payment />,
    icon: <DollarOutlined />
  }
];

const driverRoutes = [
  {
    key: 'personal',
    label: 'Thông tin cá nhân',
    path: '/personal',
    element: <Personal />,
    icon: <UserOutlined />
  },
  {
    key: 'history',
    label: 'Lịch sử',
    path: '/history',
    element: <HistoryDriver />,
    icon: <HistoryOutlined />
  },
  {
    key: 'map',
    label: 'Bản đồ',
    path: '/map',
    element: <DriverMap />,
    icon: <CarOutlined />
  }
];

const adminRoutes = [
  {
    key: 'staff',
    label: 'Quản lý nhân viên',
    path: '/staff',
    element: <Staff />,
    icon: <UsergroupAddOutlined />
  },
  {
    key: 'user',
    label: 'Quản lý người dùng',
    path: '/user',
    element: <UserPage />,
    icon: <ContactsOutlined />
  },
  {
    key: 'camera',
    label: 'Quản lý Camera',
    path: '/camera',
    element: <Camera />,
    icon: <CameraOutlined />
  },
  {
    key: 'setting',
    label: 'Cài đặt',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'setting-map',
        label: 'Bản đồ',
        path: '/setting-map',
        element: <SettingMap />
      }
    ]
  }
];

const devRoutes = [
  {
    key: 'event',
    label: 'Nhập xuất xe',
    path: '/event',
    element: <Event />,
    icon: <InteractionOutlined />
  }
];

export { publicRoutes, adminRoutes, driverRoutes, devRoutes };
