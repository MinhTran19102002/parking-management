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
        title: 'Biển số xe',
        dataIndex: 'licenePlate',
        key: 'licenePlate'
      },
      {
        title: 'Loại xe',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Trạng thái',
        key: 'status',
        render: (_, record) => {
          let config = {
            status: 'success',
            text: 'Còn hoạt động'
          };
          if (record._destroy) {
            config = {
              status: 'error',
              text: 'Dừng hoạt động'
            };
          }
          return <Badge {...config} />;
        }
      },
      {
        title: 'Xác nhận',
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
        title: 'Ngày đăng ký',
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
              Hủy xác nhận
            </Button>
          ) : (
            <Button
              size="small"
              icon={<CheckOutlined />}
              type="primary"
              onClick={() => onConfirmVehicle(licenePlate, idUser)}>
              Xác nhận xe
            </Button>
          )
      }
    ];

    return (
      <div className="container-fluid">
        <Typography.Title type="primary" level={5}>
          Danh sách xe:
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
    setFormAction({ action: 'add', actionText: 'Thêm', title: 'Thêm chủ xe mới' });
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
      actionText: 'Chỉnh sửa',
      title: 'Chỉnh sửa thông tin chủ xe',
      payload: { ...values }
    });
    setOpenForm(true);
  };

  const onDelete = async (values) => {
    try {
      actions.onMess({
        content: 'Đang xóa',
        type: 'loading',
        duration: 1
      });
      const api = await UserApi.deleteDriver(values._id);
      setData(api);
      actions.onNoti({
        message: 'Xóa chủ xe thành công',
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
      title: 'Bạn có chắc chắc muốn xóa ?',
      icon: <ExclamationCircleFilled />,
      content: 'Các nội dung được chọn sẽ bị mất vĩnh viễn',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        hanldeDeleteMany();
      }
    });
  };

  const hanldeDeleteMany = async () => {
    try {
      actions.onMess({
        content: 'Đang xóa',
        type: 'loading',
        duration: 1
      });
      const ids = selectedRows.map((e) => e._id);
      const api = await UserApi.deleteManyDriver(ids);
      setData(api);
      actions.onNoti({
        message: 'Xóa tất cả thành công',
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
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Nghề nghiệp',
      dataIndex: ['driver', 'job'],
      key: 'job',
      render: (text, record, index) => JobServices.getTextByValue(text)
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
            Danh sách:
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
                Xóa
              </Button>
            )}
            <Button id="btnAdd" type="primary" ghost icon={<PlusOutlined />} onClick={onAdd}>
              Thêm chủ xe
            </Button>
          </Space>
        }
        className="box">
        <Row className="mt-2 mb-4 w-100">
          <Row>
            <Space>
              <Typography.Title level={5} className="mb-0">
                Bộ lọc:
              </Typography.Title>
              <Input
                style={{
                  width: 200
                }}
                placeholder="Tên"
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
                placeholder="Số điện thoại"
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
                placeholder="Biển số xe"
                defaultValue={licenePlate}
                onPressEnter={onEnterFilter}
                onChange={onChangeFilter}
                allowClear={true}
              />
              <Button type="text" icon={<FilterOutlined />} onClick={callApi}>
                Lọc
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
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
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
