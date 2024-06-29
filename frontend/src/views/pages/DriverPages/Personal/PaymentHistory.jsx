import { Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormatNumber } from '~/services';

function PaymentHistory({ ...props }) {
  const { t: lag } = useTranslation();
  return (
    <Table
      rowKey={(_, idex) => 'tableRow' + idex}
      columns={[
        {
          title: lag('common:payment:createdAt'),
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (text) => dayjs(text).format('L LTS')
        },
        {
          title: lag('common:fee'),
          dataIndex: 'fee',
          key: 'fee',
          render: (text) => FormatNumber(text, { isEndZeroDecimal: false })
        },
        {
          title: lag('common:payment:registerStart'),
          dataIndex: 'startDay',
          key: 'startDay',
          render: (text) => dayjs(text).format('L LTS')
        },
        {
          title: lag('common:payment:endDate'),
          dataIndex: 'endDay',
          key: 'endDay',
          render: (text) => dayjs(text).format('L LTS')
        }
      ]}
      {...props}></Table>
  );
}

export default PaymentHistory;
