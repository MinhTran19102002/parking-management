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
  Input,
  Avatar
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
import CustomedTable from '~/views/components/Table';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import EmployeeApi from '~/api/Collections/EmployeeApi';
import { CAMERAS, hanldeColumes } from './data';
import CameraForm from './CameraForm';

function Camera({}) {
  const { actions } = useContext(AppContext);
  const [data, setData] = useState({
    data: [],
    totalCount: 0,
    totalPage: 0
  });
  const { totalCount, totalPage } = data;

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
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const [selectedRows, setSeletedRows] = useState([]);
  const [formAction, setFormAction] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [openFormEdit, setOpenFormEdit] = useState(false);

  const callApi = async () => {
    try {
      setLoading(true);
      setData({
        ...data,
        data: CAMERAS
      });
      isMounted.current = true;
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
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
    <Layout className="px-4">
      <Header className="border-1" title={'Quản lý camera'} />
      <Content className="w-100 py-3">
        <Modal
          title={formAction.title}
          open={openForm}
          onCancel={() => {
            setOpenForm(false);
          }}
          destroyOnClose={true}
          classNames={{ footer: 'd-none' }}>
          <CameraForm
            formAction={formAction}
            onClose={hanldeCloseForm}
            noChangeAccount={formAction.action === 'edit'}
            onNoti={actions.onNoti}
            onMess={actions.onMess}
          />
        </Modal>
        <Card
          title={
            <Typography.Title type="primary" level={4} className="mb-0">
              Danh sách camera:
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
              <Button id="btnAdd" type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                Thêm camera
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
              </Space>
            </Row>
          </Row>
          <Table
            columns={hanldeColumes({ pageIndex, pageSize, onEdit, onDelete })}
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
      <Footer />
    </Layout>
  );
}

export default Camera;
