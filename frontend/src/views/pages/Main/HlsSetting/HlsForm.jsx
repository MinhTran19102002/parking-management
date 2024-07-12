import { Form, Input, Space, Button } from 'antd';
import React, { useEffect } from 'react';

function HlsForm({ formAction = {}, onSubmit, onClose, lag }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formAction.action === 'edit') {
      const { payload } = formAction;
      form.setFieldsValue({ ...payload });
    }
  }, [JSON.stringify(formAction)]);

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item name={'id'} label="CameraId" required>
        <Input />
      </Form.Item>
      <Form.Item name={'rtsp_url'} label="RTSP URL" required>
        <Input />
      </Form.Item>
      <Form.Item title="">
        <Space>
          <Button id="btnCancel" onClick={onClose}>
            {lag('common:cancel')}
          </Button>
          <Button id="btnSubmit" htmlType="submit" type="primary">
            {lag('common:confirm')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default HlsForm;
