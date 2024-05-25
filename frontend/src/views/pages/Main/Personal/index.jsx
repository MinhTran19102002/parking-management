import React, { useContext, useMemo } from 'react';
import { Card, Descriptions, Layout, Row, Table } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { useQuery } from '@tanstack/react-query';
import { UserApi } from '~/api';
import AppContext from '~/context';
import dayjs from 'dayjs';

function Personal({}) {
  const { state } = useContext(AppContext);
  const { data = {}, refetch } = useQuery({
    queryKey: ['personal'],
    initialData: {},
    queryFn: async () => {
      try {
        const phone = state.auth.info.phone;
        const api = await UserApi.getPersonalByPhone(phone);
        return api;
      } catch (error) {}
      return {};
    }
  });

  const { name, driver = {} } = data;
  const { vehicle = [] } = driver;

  const items = [
    {
      key: 'name',
      label: 'Họ và tên',
      children: data.name
    },
    {
      key: 'email',
      label: 'Email',
      children: data.email
    },
    {
      key: 'phone',
      label: 'Phone',
      children: data.phone
    },
    {
      key: 'job',
      label: 'Công việc',
      children: driver.job
    },
    {
      key: 'department',
      label: 'Phòng ban',
      children: driver.department
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      children: data.address
    },
    {
      key: 'createdAt',
      label: 'Ngày tham gia',
      children: dayjs(data.createdAt).format('L LTS')
    },
    {
      key: 'updatedAt',
      label: 'Lần cập nhật gần nhất',
      children: dayjs(data.updatedAt).format('L LTS')
    },
    {
      key: 'vehicle',
      label: 'Danh sách xe',
      span: 3,
      children: (
        <Table
          dataSource={vehicle}
          pagination={false}
          columns={[
            {
              title: 'Biển số',
              dataIndex: 'licenePlate',
              key: 'licenePlate'
            },
            {
              title: 'Loại',
              dataIndex: 'type',
              key: 'type'
            }
          ]}
        />
      )
    }
  ];
  
  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Thông tin cá nhân'} />
      <Content className="w-100 py-3">
        <Card className="w-100">
          <Descriptions title={''} bordered items={items} size="small" column={3} />
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Personal;
