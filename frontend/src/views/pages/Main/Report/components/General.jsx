import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MonitorApi } from '~/api';
import { PureCard } from '~/views/components/Card';

function General({ id, params }) {
  const { t: lag } = useTranslation();
  const {
    data,
    refetch,
    isRefetching: loading
  } = useQuery({
    queryKey: ['Report', 'General'],
    queryFn: async () => {
      let rs = [];
      try {
        const api = await MonitorApi.getReportGeneral(params);
        rs = api;
      } catch {}

      return rs;
    }
  });
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
            title: lag('common:avgParkTime'),
            dataIndex: 'avgParkTime'
          },
          {
            title: lag('common:fullParkCount'),
            dataIndex: 'parkingLotFullCount'
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
