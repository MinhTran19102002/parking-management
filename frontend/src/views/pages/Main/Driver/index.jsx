import React, { useContext, useEffect, useRef, useState } from 'react';
import { TileLayout } from '@progress/kendo-react-layout';
import {
  Badge,
  Card,
  Col,
  Layout,
  Row,
  Table,
  Typography,
  Space,
  Button,
  Input,
  Modal,
  Pagination,
  theme,
  Tag
} from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DeleteFilled,
  ExclamationCircleFilled,
  CheckOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { UserApi, VehicleApi } from '~/api';
import dayjs from 'dayjs';
import DriverForm from './DriverForm';
import { useSearchParams } from 'react-router-dom';
import AppContext from '~/context';
import { ErrorService, JobServices } from '~/services';
import { useTranslation } from 'react-i18next';

function Driver({}) {
  const [data, setData] = useState({
    data: [],
    totalCount: 0,
    totalPage: 0
  });
  const { token } = theme.useToken();
  const { totalCount, totalPage } = data;
  const [formAction, setFormAction] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const { actions } = useContext(AppContext);
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
  const name = searchParams.get('name');
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');
  const licenePlate = searchParams.get('licenePlate');
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSeletedRows] = useState([]);
  const isMounted = useRef(false);
  const { t: lag } = useTranslation();

  const callApi = async () => {
    try {
      setLoading(true);
      const api = await UserApi.getDrivers({ ...params, pageSize, pageIndex });
      setData(api);
      isMounted.current = true;
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
      setData({ data: [], pageSize: 0, pageIndex: 0 });
    } finally {
      setLoading(false);
      setSeletedRows([]);
    }
  };

  useEffect(() => {
    callApi();
  }, [searchParams.toString()]);

  useEffect(() => {
    if (isMounted.current) {
      if (pageIndex > totalPage && pageIndex > 1) {
        setSearchParams({ ...params, pageIndex: totalPage });
      }
    }
  }, [data]);

  const expandedRowRender = (subData) => {
    const { _id: idUser } = subData;
    const newData = subData?.driver?.vehicle || [];

    const onConfirmVehicle = async (licenePlate, idUser) => {
      try {
        const api = await VehicleApi.active({ licenePlate, idUser });
        actions.onNoti({ message: `Xác nhận xe ${licenePlate} thành công`, type: 'success' });
        callApi();
      } catch (error) {
        ErrorService.hanldeError(error, actions.onNoti);
      }
    };

    const onUnconfirmVehicle = async (licenePlate) => {
      try {
        const api = await VehicleApi.inActive({ licenePlate });
        actions.onNoti({ message: `Xóa xác nhận xe ${licenePlate} thành công`, type: 'success' });
        callApi();
      } catch (error) {
        ErrorService.hanldeError(error, actions.onNoti);
      }
    };

    const columns = [
      {
        title: lag('common:licenePlate'),
        dataIndex: 'licenePlate',
        key: 'licenePlate'
      },
      {
        title: lag('common:type'),
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: lag('common:status'),
        key: 'status',
        render: (_, record) => {
          let config = {
            status: 'success',
            text: lag('common:statusList:vehicle:success')
          };
          if (record._destroy) {
            config = {
              status: 'error',
              text: lag('common:statusList:vehicle:error')
            };
          }
          return <Badge {...config} />;
        }
      },
      {
        title: lag('common:confirm'),
        dataIndex: 'active',
        key: 'active',
        render: (_, { active = true, driverId }, index) =>
          driverId === idUser ? (
            <Tag color={token.colorSuccessActive}>Đã xác nhận</Tag>
          ) : (
            <Tag color={token.colorWarningActive}>Chưa xác nhận</Tag>
          )
      },
      {
        title: lag('common:createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record, index) => dayjs(record.createdAt).format('L')
      },
      {
        title: ' ',
        render: (_, { active = true, licenePlate, driverId }, index) =>
          active && driverId === idUser ? (
            <Button
              size="small"
              icon={<CheckOutlined />}
              type="primary"
              danger
              onClick={() => onUnconfirmVehicle(licenePlate)}>
              {lag('common:cancel')}
            </Button>
          ) : (
            <Button
              size="small"
              icon={<CheckOutlined />}
              type="primary"
              onClick={() => onConfirmVehicle(licenePlate, idUser)}>
              {lag('common:confirm')}
            </Button>
          )
      }
    ];

    return (
      <div className="container-fluid">
        <Typography.Title type="primary" level={5}>
          {lag('common:driverPage:carList')}
        </Typography.Title>
        <Table
          columns={columns}
          dataSource={newData}
          pagination={false}
          rowKey={(record) => record._id}
        />
      </div>
    );
  };

  const onAdd = () => {
    setFormAction({
      action: 'add',
      actionText: lag('common:add'),
      title: lag('common:form:addDriver')
    });
    setOpenForm(true);
  };

  const onEdit = (values) => {
    values.licenePlate = values.driver?.vehicle[0]?.licenePlate || null;
    values = {
      ...values,
      ...values?.driver
    };
    setFormAction({
      action: 'edit',
      actionText: lag('common:edit'),
      title: lag('common:form:editDriver'),
      payload: { ...values }
    });
    setOpenForm(true);
  };

  const onDelete = async (values) => {
    try {
      actions.onMess({
        content: lag('common:form:deleting'),
        type: 'loading',
        duration: 1
      });
      const api = await UserApi.deleteDriver(values._id);
      setData(api);
      actions.onNoti({
        message: lag('common:form:deleting'),
        type: 'success'
      });
      callApi();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
    }
  };

  const onDeleteMany = async () => {
    Modal.confirm({
      title: lag('common:popup:sure'),
      icon: <ExclamationCircleFilled />,
      content: lag('common:popup:dc'),
      okText: lag('common:popup:aggree'),
      okType: 'danger',
      cancelText: lag('common:cancel'),
      onOk() {
        hanldeDeleteMany();
      }
    });
  };

  const hanldeDeleteMany = async () => {
    try {
      actions.onMess({
        content: lag('common:form:deleting'),
        type: 'loading',
        duration: 1
      });
      const ids = selectedRows.map((e) => e._id);
      const api = await UserApi.deleteManyDriver(ids);
      setData(api);
      actions.onNoti({
        message: lag('common:form:deleteAllSuccess'),
        type: 'success'
      });
      callApi();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
    }
  };

  const hanldeCloseForm = ({ reload }) => {
    setOpenForm(false);
    if (reload) callApi();
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: 60,
      render: (_, prop, index) => (pageIndex - 1) * pageSize + index + 1
    },
    {
      title: lag('common:name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name
    },
    {
      title: lag('common:phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: lag('common:address'),
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: lag('common:job'),
      dataIndex: ['driver', 'job'],
      key: 'job',
      render: (text) => lag('common:jobs:' + text)
    },
    {
      title: 'Đơn vị (Khoa)',
      dataIndex: ['driver', 'department'],
      key: 'department',
      render: (text, record, index) => text
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (_, record, index) => dayjs(record.createdAt).format('L')
    },
    {
      title: '',
      dataIndex: 'actions',
      width: 120,
      key: 'actions',
      render: (_, record, ix) => (
        <Space>
          <Button
            id={`btnEdit${ix}`}
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              onEdit(record);
            }}
          />
          <Button
            id={`btnDelete${ix}`}
            icon={<DeleteOutlined />}
            type="text"
            onClick={() => {
              onDelete(record);
            }}
          />
        </Space>
      )
    }
  ];

  const onEnterFilter = (e) => {
    const { value, name } = e.target;
    if (value) {
      setSearchParams({ ...params, [name]: value.toString().trim() });
    }
  };

  const onChangeFilter = (e) => {
    const { value, name } = e.target;
    if (!value) {
      delete params[name];
      setSearchParams({ ...params });
    }
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSeletedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  };

  return (
    <Content className="w-100 py-3">
      <Modal
        title={formAction.title}
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
        }}
        destroyOnClose={true}
        classNames={{ footer: 'd-none' }}>
        <DriverForm
          formAction={formAction}
          isOpen={openForm}
          onClose={hanldeCloseForm}
          onNoti={actions.onNoti}
          onMess={actions.onMess}
        />
      </Modal>
      <Card
        title={
          <Typography.Title type="primary" level={4}>
            {lag('common:list')}
          </Typography.Title>
        }
        extra={
          <Space>
            {selectedRows.length > 0 && (
              <Button
                id="btnDeleteMany"
                type="primary"
                icon={<DeleteFilled />}
                onClick={onDeleteMany}
                danger>
                {lag('common:delete')}
              </Button>
            )}
            <Button id="btnAdd" type="primary" ghost icon={<PlusOutlined />} onClick={onAdd}>
              {lag('common:driverPage:add')}
            </Button>
          </Space>
        }
        className="box">
        <Row className="mt-2 mb-4 w-100">
          <Row>
            <Space>
              <Typography.Title level={5} className="mb-0">
                {lag('common:filter')}:
              </Typography.Title>
              <Input
                style={{
                  width: 200
                }}
                placeholder={lag('common:name')}
                name="name"
                defaultValue={name}
                onPressEnter={onEnterFilter}
                onChange={onChangeFilter}
                allowClear={true}
              />
              <Input
                style={{
                  width: 200
                }}
                placeholder={lag('common:phone')}
                name="phone"
                defaultValue={phone}
                onPressEnter={onEnterFilter}
                onChange={onChangeFilter}
                allowClear={true}
              />
              <Input
                style={{
                  width: 320
                }}
                name="email"
                placeholder="Email"
                defaultValue={email}
                onPressEnter={onEnterFilter}
                onChange={onChangeFilter}
                allowClear={true}
              />
              <Input
                style={{
                  width: 200
                }}
                name="licenePlate"
                placeholder={lag('common:licenePlate')}
                defaultValue={licenePlate}
                onPressEnter={onEnterFilter}
                onChange={onChangeFilter}
                allowClear={true}
              />
              <Button type="text" icon={<FilterOutlined />} onClick={callApi}>
                {lag('common:filter')}
              </Button>
            </Space>
          </Row>
        </Row>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: ['0']
          }}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection
          }}
          loading={loading}
          pagination={false}
          dataSource={data.data || []}
          rowKey={(record) => record._id}
          scroll={{ y: 600, scrollToFirstRowOnChange: true }}
        />
        <Row className="mt-4 w-100" justify={'end'}>
          {data.totalCount ? (
            <Pagination
              total={totalCount}
              showTotal={(total, range) =>
                lag('common:table:paginationText', { start: range[0], end: range[1], total })
              }
              pageSize={pageSize}
              current={pageIndex}
              disabled={loading}
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
        </Row>
      </Card>
    </Content>
  );
}

export default Driver;
