import { Button, Col, Drawer, Form, Radio, Row, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { MoonOutlined, SunOutlined } from '~/views/components/Icons';
function LagSelect({}) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const onValuesChange = (values) => {
    if (values.hasOwnProperty('mode')) {
      localStorage.setItem('mode', values.mode ? 'light' : 'dark');
    }
  };

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={() => setOpen(!open)} />
      <Drawer
        title="Cài đặt"
        placement={'right'}
        width={400}
        onClose={() => setOpen(false)}
        open={open}>
        <Form
          form={form}
          gutter={16}
          onValuesChange={onValuesChange}
          initialValues={{
            lag: localStorage.getItem('laguague') || 'vi',
            mode: localStorage.getItem('laguague') || 'vi' === 'vi'
          }}>
          <Form.Item label="Ngôn ngữ" name="lag">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={[
                { value: 'vi', label: 'Tiếng Việt' },
                { value: 'en', label: 'Tiếng Anh' }
              ]}
            />
          </Form.Item>
          <Form.Item label="Theme" name="mode">
            <Switch
              size="large"
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
              defaultChecked
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default LagSelect;
