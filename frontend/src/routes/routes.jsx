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
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { lazy } from 'react';
const Driver = lazy(() => import('~/views/pages/Main/Driver'));
const Home = lazy(() => import('~/views/pages/Main/Home'));
const DriverMap = lazy(() => import('~/views/pages/DriverPages/Map'));
const Event = lazy(() => import('~/views/pages/Main/Event'));
const UserPage = lazy(() => import('~/views/pages/Main/UserPage'));
const Staff = lazy(() => import('~/views/pages/Main/Staff'));
const Camera = lazy(() => import('~/views/pages/Main/Camera'));
const SettingMap = lazy(() => import('~/views/pages/Main/Setting-Map'));
const Personal = lazy(() => import('~/views/pages/DriverPages/Personal'));
const HistoryDriver = lazy(() => import('~/views/pages/DriverPages/History'));
const CameraStream = lazy(() => import('~/views/pages/Main/CameraStream'));
const Map = lazy(() => import('~/views/pages/Main/Map'));
const History = lazy(() => import('~/views/pages/Main/History'));
const Payment = lazy(() => import('~/views/pages/Main/Payment'));
const Report = lazy(() => import('~/views/pages/Main/Report'));
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
  },
  {
    key: 'report',
    label: 'Báo cáo',
    path: '/report',
    element: <Report />,
    icon: <FileTextOutlined />
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
      },
      {
        key: 'staff',
        label: 'Quản lý nhân viên',
        path: '/staff',
        element: <Staff />
      },
      {
        key: 'user',
        label: 'Quản lý người dùng',
        path: '/user',
        element: <UserPage />
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
