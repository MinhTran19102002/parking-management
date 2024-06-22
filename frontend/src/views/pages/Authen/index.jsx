import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, Form, Image, Input, Layout, Radio, Row, Space, Typography } from 'antd';
import LOGO from '~/assets/logo/full-logo.svg';
import AppContext from '~/context';
import { useNavigate } from 'react-router-dom';
import { Content, Footer } from '~/views/layouts';
import LagSelect from '~/views/layouts/Header/LagSelect';
import { useTranslation } from 'react-i18next';

const roles = [
  {
    value: 'Admin',
    label: 'Admin'
  },
  {
    value: 'Manager',
    label: 'Quản lý'
  }
  // {
  //   value: 'Employee',
  //   label: 'Nhân viên'
  // }
];

function Authen({}) {
  const { state, actions } = useContext(AppContext);
  const { auth } = state;
  const navigate = useNavigate();
  const { t: lag } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onComplete = (type = 'error', content) => {
    if (content) {
      actions.onMess({ type, content });
    }
    setLoading(false);
  };

  const onFinish = (values) => {
    const { username, password, role } = values;
    setLoading(true);
    actions.onLogin({ username, password, role, onComplete, onNoti: actions.onNoti });
  };

  const onForgotPassword = () => {};

  const onRegister = () => {
    navigate('/register');
  };

  const onFinishFailed = (errorInfo) => {};

  useEffect(() => {
    if (auth.isLogin) {
      navigate('/');
    }
  }, [auth]);

  return (
    <Content className="d-flex justify-content-center align-items-center w-100 h-100">
      <LagSelect floatButton />
      <Space direction="vertical" size="large">
        <Row justify="center">
          <Image src={LOGO} preview={false} />
        </Row>
        <Row>
          <Form
            name="loginForm"
            style={{
              width: 400
            }}
            initialValues={{ role: 'Admin' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: lag('common:form:plsNotEmpty')
                }
              ]}>
              <Input size="large" placeholder={lag('common:form:username')} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: lag('common:form:plsNotEmpty')
                }
              ]}>
              <Input.Password size="large" placeholder={lag('common:password')} />
            </Form.Item>

            <Form.Item>
              <Button
                id="btnLogin"
                size="large"
                type="primary"
                htmlType="submit"
                block
                loading={loading}>
                {lag('common:login')}
              </Button>
            </Form.Item>
          </Form>
        </Row>
        {/* <Row justify={'center'}>
          <Divider>
            <Typography.Link className="fs-5" onClick={onForgotPassword}>
              Quên mật khẩu
            </Typography.Link>
          </Divider>
        </Row> */}
        <Row>
          <Button block size="large" onClick={onRegister}>
            {lag('common:register')}
          </Button>
        </Row>
      </Space>
    </Content>
  );
}

export default Authen;
