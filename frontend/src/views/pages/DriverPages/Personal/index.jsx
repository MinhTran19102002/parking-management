import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Layout,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Typography
} from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { useQuery } from '@tanstack/react-query';
import { UserApi, VehicleApi } from '~/api';
import AppContext from '~/context';
import dayjs from 'dayjs';
import { ErrorService } from '~/services';
import { useTranslation } from 'react-i18next';
import PaymentRegister from './PaymentRegister';
import PaymentHistory from './PaymentHistory';

function Personal({}) {
  const { state, actions } = useContext(AppContext);
  const { t: lag } = useTranslation();
  const [open, setOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);
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
  const { vehicle = [], paymentData = [] } = driver;

  const hanldePayment = async (values) => {
    try {
      const startDay = values.startDay.format('L');
      delete values.startDay;
      const api = await VehicleApi.registerPayment({
        startDay,
        ...values
      });
      if (api) {
        actions.onNoti({ message: lag('common:form:addSuccess'), type: 'success' });
      }
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const onPay = async (paymentId) => {
    try {
      const response = await VehicleApi.pay({
        paymentId
      });
      window.open(response);
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const onCancelRegisteration = async (paymentId) => {
    try {
      const response = await VehicleApi.cancelRegisteration({
        paymentId
      });
      refetch();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  useEffect(() => {
    refetch();
  }, [JSON.stringify(state.parkingEvent)]);

  const loadPaymentHistory = async (vehicles) => {
    try {
      const apis =
        vehicles?.map((licenePlate) =>
          VehicleApi.getPayment({
            licenePlate
          })
        ) || [];
      const response = await Promise.all(apis);
      const rs = response.map((el, index) => {
        const licenePlate = vehicles[index];
        return {
          licenePlate,
          data: el.data
        };
      });
      setHistory(rs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      const rs = data?.driver?.vehicle?.map((e) => e.licenePlate);
      loadPaymentHistory(rs);
    } catch (error) {
      console.log(error);
    }
  }, [JSON.stringify(data)]);

  const getPaymentHistoryByFilter = async (licenePlate) => {
    let rs = [];
    try {
      const api = await VehicleApi.getPayment({
        licenePlate
      });
      rs = api.data || [];
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
    return rs;
  };

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

  console.log(paymentData);

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
        <Descriptions
          title={''}
          bordered
          items={items}
          size="small"
          column={{ xs: 1, sm: 2, md: 2, xxl: 3 }}
        />
      </Card>
      <Table
        className="mt-2"
        dataSource={vehicle}
        pagination={false}
        rowKey={(_, index) => 'rowKey' + index}
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
              const { paymentId } = item;
              const paymentItem = paymentData.find((el) => el._id === paymentId) || {};
              const { isPay, _destroy: removed } = paymentItem;
              if (paymentId && !removed) {
                return (
                  <Space>
                    <Typography.Text>
                      {`${dayjs(paymentItem.startDay).format('L LTS')} - ${dayjs(
                        paymentItem.endDay
                      ).format('L LTS')}, `}
                    </Typography.Text>

                    <Tag color={isPay ? 'success' : 'error'}>
                      {isPay ? lag('common:payment:isPay') : lag('common:payment:isNotPay')}
                    </Tag>
                    {isPay || (
                      <Button size="small" type="primary" onClick={() => onPay(paymentId)}>
                        {lag('common:payment:pay')}
                      </Button>
                    )}

                    <Popconfirm
                      title={lag('common:popup:sure')}
                      onConfirm={() => onCancelRegisteration(paymentId)}
                      okText={lag('common:confirm')}
                      cancelText={lag('common:cancel')}>
                      <Button size="small" danger ghost>
                        {lag('common:cancelRegistration')}
                      </Button>
                    </Popconfirm>
                  </Space>
                );
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
      <br></br>
      <Typography.Title level={4}>{lag('common:pages:payment')}</Typography.Title>
      {history.map((historyItem) => {
        return (
          <div key={historyItem.licenePlate}>
            <Typography.Title level={5}>
              {lag('common:licenePlate')}: {historyItem.licenePlate}
            </Typography.Title>
            <PaymentHistory size="small" dataSource={historyItem.data} />
          </div>
        );
      })}
    </Content>
  );
}

export default Personal;
