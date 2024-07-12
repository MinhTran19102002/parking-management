import { Button, Checkbox, Form, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

function EventFilter({ initialValues = {}, onChange, eventNames, onClose }) {
  const { t: lag } = useTranslation();
  return (
    <Form initialValues={initialValues} onFinish={onChange} layout="vertical">
      <Form.Item name="name" label={lag('event:byName:title')}>
        <Checkbox.Group
          size="large"
          options={eventNames.map((el) => {
            return {
              label: lag(`event:byName:${el.name}`),
              value: el.name
            };
          })}
        />
      </Form.Item>
      <Form.Item name="name" label={null}>
        <Space>
          <Button htmlType="button" onClick={() => onClose()} >{lag('common:cancel')}</Button>
          <Button htmlType="submit" type="primary">
            {lag('common:confirm')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default EventFilter;
