import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import Authen from './views/pages/Authen';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Main from './views/pages/Main';
import AppContext from './context';
import { ConfigProvider, Layout, Spin, Typography, message, notification, theme } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-default/dist/all.css';
import PageError from './views/pages/PageError';
import { ThemeProvider } from 'styled-components';
import DayService from './services/DayService';
import { getAntd, i18nConfig } from './config';
import { GlobalStyle } from './shared';
import Register from './views/pages/Authen/Register';
import { Content, Footer } from './views/layouts';
import { useTranslation } from 'react-i18next';

function Authencation({ children }) {
  const { state } = useContext(AppContext);
  const { auth, authorize } = state;

  if (auth.isLogin) {
    return children;
  }

  return <Navigate to={'/auth/login'} />;
}

function Authorize({ children }) {
  const { state, actions } = useContext(AppContext);
  const { auth, authorize } = state;
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const api = async () => {
    try {
      setLoading(true);
      await actions.onAuthorize({
        onError: () => {
          actions.logout();
        }
      });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    api();
  }, []);

  if (authorize) {
    return children;
  } else {
    if (loading) {
      return (
        <div className="full-screen">
          <Spin
            spinning={loading}
            size="large"
            tip={<Typography.Title level={4}>Loading...</Typography.Title>}>
            <div className="content" />
          </Spin>
        </div>
      );
    }
  }

  return (
    <div className="full-screen">
      {/* <Spin
        spinning={loading}
        size="large"
        tip={<Typography.Title level={4}>Loading...</Typography.Title>}
        fullscreen={true}>
        <div className="content" />
      </Spin> */}
    </div>
  );
}

function App() {
  //Message Function
  const { state } = useContext(AppContext);
  const { i18n } = useTranslation();
  const { mess, noti } = state;
  const [messageApi, contextHolder] = message.useMessage();
  const [notiApi, notiContextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [customedAntdTheem, setCustomedAntTheme] = useState(getAntd(state.theme, i18n));

  useEffect(() => {
    setCustomedAntTheme(getAntd(state.theme, i18n));
  }, [state.theme, i18n.language]);

  DayService.setup();
  useEffect(() => {
    if (mess) {
      const { type, content, duration = 3 } = mess;
      messageApi.open({
        type,
        content,
        duration
      });
    }
  }, [mess]);

  useEffect(() => {
    if (noti) {
      const { message, description, type = 'info', placement = 'bottomRight' } = noti;
      notiApi[type]({
        message,
        description,
        placement
      });
    }
  }, [noti]);

  return (
    <div className="app">
      <ConfigProvider {...customedAntdTheem}>
        {contextHolder}
        {notiContextHolder}
        <ThemeProvider theme={{ ...token }}>
          <GlobalStyle />
          <Layout className="vh-100">
            <Content>
              <Routes>
                <Route path="/auth/login" element={<Authen />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/*"
                  element={
                    <Authencation>
                      <Authorize>
                        <Main />
                      </Authorize>
                    </Authencation>
                  }
                  errorElement={
                    <PageError
                      status="500"
                      title={false}
                      subTitle="Không tìm thấy trang"
                      btn={{ text: 'Về trang chủ', onClick: () => <Navigate to={'/dashboard'} /> }}
                    />
                  }
                />
              </Routes>
            </Content>
            <Footer />
          </Layout>
        </ThemeProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;
