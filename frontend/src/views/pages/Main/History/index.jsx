import React, { useContext, useEffect, useState } from 'react';
import { Card, Layout, Row, Table, Typography } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { getColumns } from './data';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MonitorApi, ParkingApi } from '~/api';
import AppContext from '~/context';
import dayjs from 'dayjs';
import CustomedTable from '~/views/components/Table';

function History({}) {
  const { state } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
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
    queryKey: ['history', JSON.stringify(searchParams)],
    initialData: {},
    queryFn: async () => {
      let rs = {};
      try {
        rs = await MonitorApi.getEvents({ ...params });
        console.log(api);
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
    <Layout className="px-4">
      <Header className="border-1" title={'Home'} />
      <Content className="w-100 py-3">
        <Card>
          <CustomedTable
            dataSource={data}
            filter={params}
            columns={getColumns({ pageSize, pageIndex })}
            loading={loading}
            totalCount={totalCount}
            totalPage={totalPage}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onChange={setSearchParams}
            scroll={{ y: 1000, scrollToFirstRowOnChange: true }}
            filterList={[
              {
                name: 'eventName',
                type: 'select',
                inputProps: {
                  options: [],
                  placeholder: 'Chọn'
                }
              },
              {
                name: 'position',
                type: 'input',
                inputProps: {
                  options: [],
                  placeholder: 'Nhập'
                }
              },
              {
                name: 'licenePlate',
                type: 'input',
                inputProps: {
                  options: [],
                  placeholder: 'Nhập'
                }
              },

              {
                name: 'rangeDate',
                type: 'range',
                inputProps: {
                  options: [],
                  format: 'L'
                }
              },
              {
                name: 'timePicker',
                type: 'timePicker',
                inputProps: {
                  options: [],
                  format: 'HH:mm'
                }
              },
              {
                name: 'personName',
                type: 'input',
                inputProps: {
                  options: [],
                  placeholder: 'Nhập'
                }
              }
            ]}
          />
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
}

export default History;
