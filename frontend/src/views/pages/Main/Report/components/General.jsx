import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MonitorApi } from '~/api';
import AppContext from '~/context';
import { PureCard } from '~/views/components/Card';

function General({ id, loading, data = [] }) {
  const { t: lag } = useTranslation();
  return (
    <PureCard
      title={lag(`common:reportPage:${id}`)}
      classNames={{ body: 'px-0 py-0' }}
      size="small">
      <Table
        columns={[
          {
            title: lag('common:zone'),
            dataIndex: 'zone',
            render: (zone) => lag('common:zoneName', { zone })
          },
          {
            title: lag('common:entries'),
            dataIndex: 'entries'
          },
          {
            title: lag('common:exists'),
            dataIndex: 'exists'
          },
          {
            title: lag('common:fee'),
            dataIndex: 'fee'
          },
          {
            title: `${lag('common:avgParkTime')} (${lag('common:times:hour').toLocaleLowerCase()})`,
            dataIndex: 'averageDuration',
            render: (text) => text && dayjs(Number(text)).format('HH:mm')
          }
        ]}
        dataSource={data}
        size="small"
        bordered={false}
        pagination={false}
        loading={loading}
        rowKey={(i, index) => 'table-row' + index}
      />
    </PureCard>
  );
}

export default General;
