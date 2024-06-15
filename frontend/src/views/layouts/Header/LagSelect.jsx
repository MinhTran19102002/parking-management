import { Button, Col, Drawer, Form, Radio, Row, Select, Switch } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { MoonOutlined, SunOutlined } from '~/views/components/Icons';
import AppContext from '~/context';
import { useForm } from 'antd/es/form/Form';
function LagSelect({}) {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const { state, actions } = useContext(AppContext);
  const [initValues, setInitValues] = useState({});

  const onValuesChange = (values) => {
    if (values.hasOwnProperty('mode')) {
      actions.changeTheme(values.mode ? 'light' : 'dark');
    }
  };

  useEffect(() => {
    console.log(state.theme);
    setInitValues({
      mode: state.theme === 'light',
    });
  }, [open]);

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={() => setOpen(!open)} />
      <Drawer
        title="Cài đặt"
        placement={'right'}
        width={400}
        onClose={() => setOpen(false)}
        open={open}>
        <Form form={form} gutter={16} onValuesChange={onValuesChange} initialValues={initValues}>
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
          <Form.Item label="Theme" name="mode" valuePropName="checked">
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
