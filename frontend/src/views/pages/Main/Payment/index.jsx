import React, { useContext, useEffect, useState } from 'react';
import { Card, Layout, Row, Table, Typography } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { getColumns } from './data';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MonitorApi, ParkingApi, VehicleApi } from '~/api';
import AppContext from '~/context';
import dayjs from 'dayjs';
import CustomedTable from '~/views/components/Table';
import { useTranslation } from 'react-i18next';

function Payment({}) {
  const { state } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t: lag } = useTranslation();
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const params = { pageSize, pageIndex };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const {
    data: { data = [], totalCount = 0, totalPage = 0 },
    refetch,
    isFetching: loading
  } = useQuery({
    queryKey: ['history', JSON.stringify(params)],
    initialData: {},
    queryFn: async () => {
      let rs = {};
      try {
        rs = await VehicleApi.getPayment({ ...params });
      } catch (error) {
        console.log(error);
      }
      return rs;
    }
  });

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);

  return (
    <Content className="w-100 py-3">
      <Card>
        <CustomedTable
          dataSource={data}
          filter={params}
          columns={getColumns({ pageSize, pageIndex }, lag)}
          loading={loading}
          totalCount={totalCount}
          totalPage={totalPage}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onChange={setSearchParams}
          scroll={{ y: 1000, scrollToFirstRowOnChange: true }}
          filterList={[
            {
              name: 'licenePlate',
              type: 'input',
              inputProps: {
                options: [],
                placeholder: lag('common:enter')
              }
            },
            {
              name: 'rangeDate',
              type: 'range',
              inputProps: {
                options: [],
                allowClear: true,
                format: 'L'
              }
            },
            {
              name: 'isPay',
              type: 'check'
            }
          ]}
          filterNames={{
            rangeDate: ['startDate', 'endDate']
          }}
        />
      </Card>
    </Content>
  );
}

export default Payment;
