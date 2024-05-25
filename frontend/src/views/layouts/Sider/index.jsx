import { CarOutlined, LineChartOutlined } from '@ant-design/icons';
import { Flex, Image, Layout, Menu, Space, Typography, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LOGO from '~/assets/logo/main.svg?url';
import { publicRoutes } from '~/routes';

function Sider({ routes, ...props }) {
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  console.log(token);

  const handleChangePage = ({ item }) => {
    navigate(item.props.path);
    setCurrent({
      ...current,
      selectedKeys: item.props.path.split('/').filter(Boolean),
      path: item.props.path
    });
  };

  const handleExpandSubmenu = (keys) => {
    setCurrent({ ...current, openKeys: keys });
  };

  useEffect(() => {
    if (location) {
      if (location.pathname != current?.path) {
        setCurrent({
          selectedKeys: location.pathname.split('/').filter(Boolean),
          openKeys: [...(current.openKeys || []), location.pathname.split('/').filter(Boolean)[0]],
          path: location.pathname
        });
      }
    }
  }, [location]);

  return (
    <Layout.Sider
      {...props}
      width={200}
      className="py-4"
      collapsible
      theme="dark"
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={
        {
          // background: token.colorBgContainer
        }
      }>
      <Flex vertical className="px-2 mt-1" align="center">
        <Image src={LOGO} width={40} preview={false} />
        {!collapsed && (
          <Typography.Title level={4} className="text-center" style={{ color: token.colorPrimary }}>
            Parking Management
          </Typography.Title>
        )}
      </Flex>
      <Menu
        id="menuSider"
        mode="inline"
        theme="dark"
        className={`mt-5 ${!collapsed && 'notCollapsed'}`}
        items={routes}
        selectedKeys={current?.selectedKeys}
        openKeys={current?.openKeys}
        onSelect={handleChangePage}
        onOpenChange={handleExpandSubmenu}
      />
      <Typography.Title level={5} className='text-center mt-auto' style={{ color: token.colorPrimary }}>
        Version {import.meta.env.VITE_APP_VERSION}
      </Typography.Title>
    </Layout.Sider>
  );
}

export default Sider;
