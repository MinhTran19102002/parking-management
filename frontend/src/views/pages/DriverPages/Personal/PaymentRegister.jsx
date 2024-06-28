import { Button, Form, InputNumber, Space } from 'antd';
import React from 'react';
function PaymentRegister({ licenePlate, hanldeRegister, lag }) {
  return (
    <Form onFinish={(values) => hanldeRegister({ ...values, licenePlate })}>
      <Form.Item name={'months'} label={lag('common:months')} required>
        <InputNumber min={1} max={12} />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          span: 8,
          offset: 16
        }}
        className="mt-4">
        {' '}
        <Space>
          <Button id="btnSubmit" htmlType="submit" type="primary">
            {lag('common:confirm')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default PaymentRegister;
