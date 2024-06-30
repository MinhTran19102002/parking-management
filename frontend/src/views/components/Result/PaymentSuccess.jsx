import { Layout, Result, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { VehicleApi } from '~/api';
import { FormatNumber } from '~/services';

function PaymentSuccess({}) {
  const { t: lag } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = {};
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const { vnp_Amount, vnp_BankCode, vnp_PayDate, vnp_OrderInfo } = params;

  const onSave = async () => {
    try {
      await VehicleApi.savePayment({
        paymentId: vnp_OrderInfo
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (vnp_OrderInfo) {
      onSave();
    }
  }, [JSON.stringify(params)]);
  return (
    <Layout style={{ height: '100vh' }}>
      {' '}
      <Result
        status="success"
        title={lag('common:payment:paySuccessfully')}
        subTitle={
          <Typography.Text>
            {lag('common:amount')}: {FormatNumber(vnp_Amount, { isEndZeroDecimal: false })} VND{' '}
            <br></br>
            {lag('common:payment:vnp_BankCode')}: {vnp_BankCode}
            <br></br>
            {lag('common:payment:vnp_PayDate')}: {dayjs(vnp_PayDate).format('L LTS')}
            <br></br>
          </Typography.Text>
        }
        style={{ margin: 'auto' }}
      />
    </Layout>
  );
}
export default PaymentSuccess;
