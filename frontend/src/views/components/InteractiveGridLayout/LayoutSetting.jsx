import { RetweetOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AppContext from '~/context';

function LayoutSetting({ onReset, onSave }) {
  const { t: lag } = useTranslation();
  const { state, actions } = useContext(AppContext);
  const { changeLayout } = state;
  const hanldeLayout = ({ key }) => {
    if (key === 'reset') {
      onReset();
    }
    if (key === 'save') {
      onSave();
    }
  };
  return (
    <Dropdown
      menu={{
        items: [
          {
            label: lag('common:layout:save'),
            icon: <SaveOutlined />,
            key: 'save'
          },
          {
            label: lag('common:layout:reset'),
            icon: <RetweetOutlined />,
            key: 'reset'
          }
        ],
        onClick: hanldeLayout
      }}>
      <Button icon={<SettingOutlined />} type="text" />
    </Dropdown>
  );
}

export default LayoutSetting;
