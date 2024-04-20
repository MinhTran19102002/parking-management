import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Image,
  Layout,
  Modal,
  Space,
  Typography,
  theme
} from 'antd';
import FULL_LOGO from '~/assets/logo/logo-text.svg';
import DEFAULT_AVATAR from '~/assets/images/avatar.png';
import { DownOutlined, SettingTwoTone } from '@ant-design/icons';
import AppContext from '~/context';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '~/views/pages/Main/Employee/EmployeeForm';
import ProfileForm from '~/views/components/Form/ProfileForm';

const items = [
  {
    id: 'editProfile',
    label: 'Chỉnh sửa thông tin',
    key: 'editProfile',
    disabled: false
  },
  {
    id: 'changePassword',
    label: 'Thay đổi mật khẩu',
    key: 'changePassword',
    disabled: false
  },
  {
    id: 'logout',
    label: <Typography.Text type="danger">Đăng xuất</Typography.Text>,
    key: 'logout'
  }
];

function Header({ title }) {
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  const { auth } = state;
  const [formAction, setFormAction] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  const hanldeLogout = async () => {
    actions.logout();
    navigate('/auth/login');
  };

  const onChangePassword = () => {
    actions.onSetChangePassword();
  };

  const hanldeClickProfile = ({ key }) => {
    if (key === 'logout') {
      hanldeLogout();
    } else if (key === 'editProfile') {
      onEdit();
    } else {
      onChangePassword();
    }
  };

  useEffect(() => {
    if (!state.auth.isLogin) {
      navigate('/auth/login');
    } else {
      // hanlde avatart
      try {
        setAvatar(
          `${import.meta.env.VITE_DOMAIN}/${import.meta.env.VITE_UPLOADS}/avatar/${
            auth.info.avatar
          }`
        );
      } catch {}
    }
  }, [state.auth]);

  const onEdit = () => {
    const { info } = auth;
    info.user = info?.account?.username || '';
    setFormAction({
      action: 'edit',
      actionText: 'Chỉnh sửa',
      title: 'Chỉnh sửa thông tin cá nhân',
      payload: { ...info }
    });
    setOpenForm(true);
  };

  const hanldeCloseForm = ({ newValues }) => {
    if (newValues) {
      delete newValues.account.password;
      actions.editProfile(newValues);
      setOpenForm(false);
    } else {
      setOpenForm(false);
    }
  };

  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: colorBgContainer,
        height: 60,
        boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.16)'
      }}
      className="px-4 py-2 border-1">
      <Flex justify="space-between" className="w-100">
        <Typography.Title level={4} style={{ margin: 'auto 0', color: colorPrimary }}>
          {title}
        </Typography.Title>
        <Space>
          {useMemo(() => {
            return (
              <Space id="profileUser">
                <Avatar src={avatar} size={40} />
                <Dropdown
                  menu={{ items, onClick: hanldeClickProfile }}
                  getPopupContainer={() => document.querySelector('#root')}
                  trigger={['click']}
                  placement="bottomRight">
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {state?.auth?.info?.name}
                      </Typography.Title>
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </Space>
            );
          }, [state.auth, avatar])}
        </Space>
      </Flex>
      <Modal
        title={formAction.title}
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
        }}
        destroyOnClose={true}
        classNames={{ footer: 'd-none' }}>
        <ProfileForm
          formAction={formAction}
          isOpen={openForm}
          onClose={hanldeCloseForm}
          noChangeAccount
        />
      </Modal>
    </Layout.Header>
  );
}

export default Header;
