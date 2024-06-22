import { Button, Col, Drawer, FloatButton, Form, Radio, Row, Select, Switch } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Icon, { SettingOutlined } from '@ant-design/icons';
import { MoonOutlined, SunOutlined } from '~/views/components/Icons';
import AppContext from '~/context';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
function LagSelect({ floatButton }) {
  const { t: lag, i18n } = useTranslation();
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const { state, actions } = useContext(AppContext);
  const [initValues, setInitValues] = useState({});

  const onValuesChange = (values) => {
    if (values.hasOwnProperty('mode')) {
      actions.changeTheme(values.mode ? 'light' : 'dark');
    }
    if (values.hasOwnProperty('lag')) {
      i18n.changeLanguage(values.lag);
      localStorage.setItem('language', values.lag);
    }
  };

  useEffect(() => {
    setInitValues({
      mode: state.theme === 'light',
      lag: i18n.language
    });
  }, [open]);

  return (
    <>
      {floatButton ? (
        <FloatButton
          size="large"
          icon={<Icon component={SettingOutlined} />}
          onClick={() => setOpen(!open)}
        />
      ) : (
        <Button
          type="text"
          size="large"
          icon={<Icon component={SettingOutlined} />}
          onClick={() => setOpen(!open)}
        />
      )}

      <Drawer
        title={lag('common:pages:setting')}
        placement={'right'}
        width={400}
        onClose={() => setOpen(false)}
        open={open}>
        <Form form={form} gutter={16} onValuesChange={onValuesChange} initialValues={initValues}>
          <Form.Item label={lag('common:language')} name="lag">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={[
                { value: 'vi', label: lag('common:lags:vi') },
                { value: 'en', label: lag('common:lags:en') }
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
