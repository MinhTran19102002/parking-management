import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MonitorApi } from '~/api';
import AppContext from '~/context';
import { PureCard } from '~/views/components/Card';

function General({ id, params }) {
  const { t: lag } = useTranslation();
  const { state } = useContext(AppContext);
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
        rs = state.zones.map((zone) => {
          return api.find((el) => el.zone === zone) || {
            zone,
            entries: 0,
            exists: 0,
            fee: 0,
            averageDuration: 0
          };
        });
      } catch {}

      return rs;
    }
  });

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);
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
