import React, { useContext, useMemo } from 'react';
import { Layout, Modal, theme } from 'antd';
import { Sider } from '~/views/layouts';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { adminRoutes, devRoutes, driverRoutes, publicRoutes } from '~/routes';
import AppContext from '~/context';
import socket from '~/socket';
import { useEffect } from 'react';
import { managers, users } from './data';
import PasswordForm from '~/views/components/Form/PasswordForm';

function Main({}) {
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  const { auth } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const hanldeNotiParking = (event) => {
      actions.onEventParking(event);
    };
    //config websocket
    socket.on('connect', () => {
      console.log('socket successful');
    });

    socket.on('notification-parking', hanldeNotiParking);

    return () => {
      socket.off('connect', () => {
        console.log('socket close');
      });
      socket.off('notification-parking', hanldeNotiParking);
    };
  }, []);
  // addManyDriver();
  // employees();
  // users();
  // managers();

  const currRoute = useMemo(() => {
    let rs = publicRoutes;
    switch (auth.role) {
      case 'Admin':
        const username = auth?.info?.account?.username;
        rs = [...rs, ...adminRoutes];
        if (username === 'admin1') {
          rs.push(...devRoutes);
        }
        break;
      case 'driver':
        rs = [...driverRoutes];
        break;
    }
    return rs;
  }, [JSON.stringify(state.auth)]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Modal
        title={'Thay đổi mật khẩu'}
        open={state.onChangePassword}
        onCancel={() => {
          actions.onSetChangePassword();
        }}
        destroyOnClose={true}
        classNames={{ footer: 'd-none' }}>
        <PasswordForm
          account={state.auth?.info?.account}
          isOpen={state.onChangePassword}
          onClose={({ afterAction }) => {
            afterAction ? afterAction() : actions.onSetChangePassword();
          }}
          noChangeAccount
        />
      </Modal>
      <Sider routes={currRoute} />
      <Routes>
        {currRoute.map((route, ix) => {
          if (route.children) {
            return route.children.map((subRoute) => <Route {...subRoute} key={subRoute.key} />);
          }
          return <Route {...route} key={'route' + ix} />;
        })}
        <Route path="*" element={<Navigate to={currRoute[0].path} />} />
      </Routes>
    </Layout>
  );
}

export default Main;
