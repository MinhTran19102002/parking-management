import {
  CarOutlined,
  ContactsOutlined,
  DashboardOutlined,
  InteractionOutlined,
  LineChartOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  CameraOutlined
} from '@ant-design/icons';
import Driver from '~/views/pages/Main/Driver';
import Employee from '~/views/pages/Main/Employee';
import Home from '~/views/pages/Main/Home';
import Map from '~/views/pages/Main/Map';
import Event from '~/views/pages/Main/Event';
import UserPage from '~/views/pages/Main/UserPage';
import Staff from '~/views/pages/Main/Staff';
import Camera from '~/views/pages/Main/Camera';
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
    key: 'driver',
    label: 'Quản lý chủ xe',
    path: '/driver',
    element: <Driver />,
    icon: <UserOutlined />
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
  }
];

const hideRoutes = [
  {
    key: 'event',
    label: 'Nhập xuất xe',
    path: '/event',
    element: <Event />,
    icon: <InteractionOutlined />
  }
];

export { publicRoutes, adminRoutes };
