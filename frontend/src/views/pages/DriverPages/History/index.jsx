import React, { useContext, useEffect, useState } from 'react';
import { Card, Layout, Row, Table, Typography } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { getColumns } from './data';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MonitorApi, ParkingApi } from '~/api';
import AppContext from '~/context';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

function History({}) {
  const { state } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams({
    pageSize: '10',
    pageIndex: '1'
  });
  const pageIndex = Number(searchParams.get('pageIndex'));
  const pageSize = Number(searchParams.get('pageSize'));
  const params = { pageSize, pageIndex };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const { t: lag } = useTranslation();
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['history', 'personal'],
    initialData: [],
    queryFn: async () => {
      try {
        const phone = state.auth.info.phone;
        const api = await MonitorApi.getEventsOfDriverByPhone(phone);
        return api;
      } catch (error) {}
      return [];
    }
  });

  const totalThisMonth = data.reduce((acc, curr) => {
    if (curr.name === 'out' && dayjs(curr.createdAt).get('M') === dayjs().get('M'))
      return acc + curr.parkingTurn.fee;
    else return acc;
  }, 0);

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);
  return (
    <Content className="w-100 py-3">
      <Typography.Title level={5}>
        {lag(`common:costByZone`)}: {totalThisMonth / 1000}k VND
      </Typography.Title>
      <Table dataSource={data} columns={getColumns({ pageSize, pageIndex }, lag)} />
      {/* <Row className="mt-4 w-100" justify={'end'}>
      {null ? (
        <Pagination
          total={totalCount}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          pageSize={pageSize}
          current={pageIndex}
          loading={loading}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 30]}
          onChange={(page, pageSize) => {
            setSearchParams({
              ...Object.fromEntries(searchParams.entries()),
              pageIndex: page,
              pageSize
            });
          }}
        />
      ) : null}
    </Row> */}
    </Content>
  );
}

export default History;
