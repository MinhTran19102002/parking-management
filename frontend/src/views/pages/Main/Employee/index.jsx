import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  Modal,
  Pagination,
  Select,
  Input
} from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DeleteFilled,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { UserApi } from '~/api';
import dayjs from 'dayjs';
import { useSearchParams, useParams } from 'react-router-dom';
import { GetAllParams } from '~/services/RegularService';
import EmployeeForm from './EmployeeForm';
import CustomedTable from '~/views/components/Table';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import EmployeeApi from '~/api/Collections/EmployeeApi';

function Employee({}) {
  const { actions } = useContext(AppContext);
  const [data, setData] = useState({
    data: [],
    totalCount: 0,
    totalPage: 0
  });
  const { totalCount, totalPage } = data;
  const [formAction, setFormAction] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [openFormEdit, setOpenFormEdit] = useState(false);
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
  const [selectedRows, setSeletedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);

  const callApi = async () => {
    try {
      setLoading(true);
      const api = await EmployeeApi.get({ ...params, pageSize, pageIndex });
      setData(api);
      isMounted.current = true;
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
      // setData({ data: [], pageSize: 0, pageIndex: 0 });
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

  const onAdd = () => {
    setFormAction({ action: 'add', actionText: 'Thêm', title: 'Thêm nhân viên mới' });
    setOpenForm(true);
  };

  const onEdit = (values) => {
    setFormAction({
      action: 'edit',
      actionText: 'Chỉnh sửa',
      title: 'Chỉnh sửa thông tin nhân viên',
      payload: { ...values }
    });
    setOpenForm(true);
  };

  const onDelete = async (values) => {
    try {
      setLoading(true);
      const api = await EmployeeApi.delete(values._id);
      setData(api);
      actions.onNoti({
        message: 'Xóa nhân viên thành công',
        type: 'success'
      });
      callApi();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
      setLoading(false);
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
      const api = await EmployeeApi.deleteMany(ids);
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
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (_, record, index) => dayjs(record.createdAt).format('L')
    },
    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      width: 120,
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
    setSearchParams({ ...params, [name]: value.toString().trim() });
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
        <EmployeeForm
          formAction={formAction}
          onClose={hanldeCloseForm}
          noChangeAccount={formAction.action === 'edit'}
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
              Thêm nhân viên
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
                  width: 200
                }}
                name="email"
                placeholder="Email"
                defaultValue={email}
                onPressEnter={onEnterFilter}
                onChange={onChangeFilter}
                allowClear={true}
              />
            </Space>
          </Row>
        </Row>
        <Table
          columns={columns}
          dataSource={data.data || []}
          rowKey={(record) => record._id}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection
          }}
          loading={loading}
          scroll={{ y: 600, scrollToFirstRowOnChange: true }}
        />
        <Row className="mt-4 w-100" justify={'end'}>
          {data.totalCount ? (
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
        </Row>
      </Card>
    </Content>
  );
}

export default Employee;
