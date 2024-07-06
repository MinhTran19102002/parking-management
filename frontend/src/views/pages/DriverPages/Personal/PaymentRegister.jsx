import { Button, DatePicker, Form, InputNumber, Space } from 'antd';
import Typography from 'antd/es/typography/Typography';
import React, { useState } from 'react';
import { FormatNumber, GetAmountFromMonths } from '~/services';
function PaymentRegister({ licenePlate, hanldeRegister, lag }) {
  const [amount, setAmount] = useState();
  return (
    <Form
      onFinish={(values) => hanldeRegister({ ...values, licenePlate })}
      onValuesChange={({ months }) => {
        if (months) setAmount(months);
      }}>
      <Form.Item name={'startDay'} label={lag('common:payment:registerStart')} required>
        <DatePicker format="L" />
      </Form.Item>
      <Form.Item name={'months'} label={lag('common:months')} required>
        <InputNumber min={1} max={12} />
      </Form.Item>
      {amount && (
        <Typography.Text>
          {lag('common:amount')}:{' '}
          {FormatNumber(GetAmountFromMonths(amount), { isEndZeroDecimal: false })} VND
        </Typography.Text>
      )}
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
