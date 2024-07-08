import { Col, Form, Popover, Row, Switch, Typography } from 'antd';
import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

function ChartSetting({ onChangeSetting, initialValues }) {
  const { t: lag } = useTranslation();
  return (
    <Popover
      title={lag('common:setting')}
      content={<SettingForm initialValues={initialValues} onChangeSetting={onChangeSetting} />}>
      <Button id="btnSettingCard" icon={<MoreOutlined />} size={'small'} type="text" />
    </Popover>
  );
}

const SettingForm = ({ onChangeSetting, initialValues }) => {
  const { t: lag } = useTranslation();
  return (
    <Form initialValues={{ ...initialValues }} onValuesChange={onChangeSetting}>
      <Form.Item name={'isLabel'} label={lag('common:popup:pointSetting')} valuePropName="checked">
        <Switch size="small" />
      </Form.Item>
    </Form>
  );
};

export default ChartSetting;
