import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Card,
  Row,
  Table,
  Typography,
  Space,
  Button,
  Modal,
  Pagination,
  Input
} from 'antd';
import { Content } from '~/views/layouts';
import {
  PlusOutlined,
  DeleteFilled,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { UserApi } from '~/api';
import { useSearchParams } from 'react-router-dom';
import UserForm from './UserForm';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import columns from './columns';
import { useTranslation } from 'react-i18next';
const { confirm } = Modal;

function UserPage({}) {
  const { actions } = useContext(AppContext);
  const { t: lag } = useTranslation();
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
      const api = await UserApi.getManagers({ ...params, pageSize, pageIndex });
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
    setFormAction({
      action: 'add',
      actionText: lag('common:add'),
      title: lag('common:form:addUser')
    });
    setOpenForm(true);
  };

  const onEdit = (values) => {
    values.user = values.account.username;
    setFormAction({
      action: 'edit',
      actionText: lag('common:edit'),
      title: lag('common:form:editUser'),
      payload: { ...values }
    });
    setOpenForm(true);
  };

  const onDelete = async (values) => {
    try {
      setLoading(true);
      const api = await UserApi.deleteManager(values._id);
      setData(api);
      actions.onNoti({
        message: lag('common:form:deleteSuccess'),
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
    confirm({
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
      const api = await UserApi.deleteManyManager(ids);
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
        <UserForm
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
                {lag('common:delete')}
              </Button>
            )}
            <Button id="addUser" type="primary" ghost icon={<PlusOutlined />} onClick={onAdd}>
              {lag('common:form:addUser')}
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
          columns={columns({ pageSize, pageIndex, onDelete, onEdit }, lag)}
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
              showTotal={(total, range) =>
                lag('common:table:paginationText', { start: range[0], end: range[1], total })
              }
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

export default UserPage;
