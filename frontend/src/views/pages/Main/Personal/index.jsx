import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Layout, Modal, Row, Space, Table, Typography } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { useQuery } from '@tanstack/react-query';
import { UserApi, VehicleApi } from '~/api';
import AppContext from '~/context';
import dayjs from 'dayjs';
import { ErrorService } from '~/services';
import { useTranslation } from 'react-i18next';
import PaymentRegister from './PaymentRegister';

function Personal({}) {
  const { state, actions } = useContext(AppContext);
  const { t: lag } = useTranslation();
  const [open, setOpen] = useState(false);
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

  const hanldePayment = async (values) => {
    try {
      const api = await VehicleApi.registerPayment({ startDate: dayjs().format('x'), ...values });
      if (api) {
        actions.onNoti({ message: 'Chỉnh sửa chủ xe thành công', type: 'success' });
      }
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const items = [
    {
      key: 'name',
      label: lag('common:fullName'),
      children: data.name
    },
    {
      key: 'email',
      label: 'Email',
      children: data.email
    },
    {
      key: 'phone',
      label: lag('common:phone'),
      children: data.phone
    },
    {
      key: 'job',
      label: lag('common:job'),
      children: driver.job
    },
    {
      key: 'department',
      label: lag('common:department'),
      children: driver.department
    },
    {
      key: 'address',
      label: lag('common:address'),
      children: data.address
    },
    {
      key: 'createdAt',
      label: lag('common:createdAt'),
      children: dayjs(data.createdAt).format('L LTS')
    },
    {
      key: 'updatedAt',
      label: lag('common:updatedAt'),
      children: dayjs(data.updatedAt).format('L LTS')
    }
  ];

  return (
    <Content className="w-100 py-3">
      <Modal
        title={lag('common:paymentRegister')}
        open={!!open}
        onCancel={() => {
          setOpen(false);
        }}
        destroyOnClose={true}
        classNames={{ footer: 'd-none' }}>
        <PaymentRegister lag={lag} licenePlate={open} hanldeRegister={hanldePayment} />
      </Modal>
      <Card className="w-100">
        <Descriptions title={''} bordered items={items} size="small" column={3} />
      </Card>
      <Table
        className="mt-2"
        dataSource={vehicle}
        pagination={false}
        columns={[
          {
            title: lag('common:licenePlate'),
            dataIndex: 'licenePlate',
            key: 'licenePlate'
          },
          {
            title: lag('common:type'),
            dataIndex: 'type',
            key: 'type',
            render: (text) => lag(`common:${text}`)
          },
          {
            title: lag('common:dlRegister'),
            dataIndex: 'payment',
            key: 'payment',
            render: (_, item) => {
              if (item.payment) {
                const { payment = {} } = item;
                if (payment.isPay && payment.startDate && payment.endDate) {
                  return `${dayjs(payment.startDate)} - ${dayjs(payment.endDate)}`;
                }
              }
              return (
                <Space size={'large'}>
                  <Typography.Text>{lag('common:unRegister')}</Typography.Text>
                  <Button type="primary" onClick={() => setOpen(item.licenePlate)} size="small">
                    {lag('common:extend')}
                  </Button>
                </Space>
              );
            }
          }
        ]}
      />
    </Content>
  );
}

export default Personal;
